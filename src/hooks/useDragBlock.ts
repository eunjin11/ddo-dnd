import { useCallback, useState, type RefObject } from 'react';
import type { Position } from '../types/position.type';
import isInBound from '../utils/isInBoundUtil';
import { useBlocksTransition } from './useBlocksTransition';
import { useSetPointerEvents } from './useSetPointerEvents';
import { snapPositionToGrid } from '../utils/snapToGridUtil';
import type { BlockType } from '../types';
import { resolveCollision } from '../utils';

interface UseDragBlockProps {
  containerRef: RefObject<HTMLDivElement | null>;
  scrollOffset: number;
  workBlocks: BlockType[];
  updateWorkBlockTimeOnServer: (updatedBlock: BlockType) => void;
  updateWorkBlocks: (blocks: BlockType[]) => void;
}

export const getNewBlocks = (blocks: BlockType[], currentBlock: BlockType) => {
  const newBlocks = blocks.map(block => {
    if (block.id !== currentBlock.id) {
      return block;
    }
    return currentBlock;
  });
  return newBlocks;
};

export const useDragBlock = ({
  containerRef,
  scrollOffset,
  workBlocks,
  updateWorkBlockTimeOnServer,
  updateWorkBlocks,
}: UseDragBlockProps) => {
  const [draggingBlock, setDraggingBlock] = useState<BlockType | null>(null);
  //렌더링 시에만 사용하는 위치, scrollOffset 보정 x
  const [dragPointerPosition, setDragPointerPosition] =
    useState<Position | null>(null);

  //마우스 위치와 블록 위치 차이
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });

  // 블록 이동 애니메이션 훅
  const { animateBlocksTransition } =
    useBlocksTransition<BlockType>(updateWorkBlocks);

  const getContainerCoords = useCallback(
    (e: PointerEvent) => {
      if (!containerRef.current) return { x: 0, y: 0 };
      const rect = containerRef.current.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    },
    [containerRef]
  );

  const handleStartDrag = useCallback(
    (e: PointerEvent, block: BlockType) => {
      const containerCoords = getContainerCoords(e);
      const rect = containerRef.current?.getBoundingClientRect();

      setDragOffset({
        x: e.clientX - (rect?.left ?? 0) + scrollOffset - block.position.x,
        y: e.clientY - (rect?.top ?? 0) - block.position.y,
      });

      setDraggingBlock(block);
      setDragPointerPosition(containerCoords);
    },
    [containerRef, getContainerCoords, scrollOffset]
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!draggingBlock) return;

      const containerCoords = getContainerCoords(e);
      setDragPointerPosition(containerCoords);

      const newPosition = {
        x: containerCoords.x + scrollOffset - dragOffset.x,
        y: containerCoords.y - dragOffset.y,
      };

      // 6px 그리드에 스냅 (y는 validY로 제한)
      const snappedPosition = snapPositionToGrid({
        x: newPosition.x,
        y: newPosition.y,
      });

      setDraggingBlock({
        ...draggingBlock,
        position: snappedPosition,
      });
    },
    [draggingBlock, dragOffset, getContainerCoords, scrollOffset]
  );

  const handleEndDrag = useCallback(() => {
    if (!draggingBlock) return;

    const currentDraggingBlock = draggingBlock;

    setDraggingBlock(null);
    setDragPointerPosition(null);

    //컨테이너 밖일 때 초기 위치로 복귀
    if (
      !isInBound(
        currentDraggingBlock.position,
        currentDraggingBlock,
        scrollOffset,
        containerRef.current,
        { x: 0, y: 10 },
        { x: 0, y: 10 }
      )
    ) {
      animateBlocksTransition(
        getNewBlocks(workBlocks, currentDraggingBlock),
        workBlocks
      );
      return;
    }

    // 충돌 해결 및 블록 정렬
    const { newBlocks, sortedBlocks, updatedBlock } = resolveCollision({
      activeBlock: currentDraggingBlock,
      workBlocks,
      containerRef,
      scrollOffset,
    });

    animateBlocksTransition(newBlocks, sortedBlocks);

    updateWorkBlockTimeOnServer(updatedBlock);
  }, [
    animateBlocksTransition,
    containerRef,
    draggingBlock,
    scrollOffset,
    updateWorkBlockTimeOnServer,
    workBlocks,
  ]);

  useSetPointerEvents({
    onPointerMove: handlePointerMove,
    onPointerUp: handleEndDrag,
  });

  return {
    draggingBlock,
    dragPointerPosition,
    dragOffset,
    handleStartDrag,
  };
};
