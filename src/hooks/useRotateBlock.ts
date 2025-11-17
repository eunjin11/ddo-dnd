import { useCallback, useState, type RefObject } from 'react';
import type { BlockType } from '../types';
import { useSetPointerEvents } from './useSetPointerEvents';
import { resolveCollision, type CollisionType } from '../utils';
import { useCollisionDetection } from './useCollisionDetection';
import { useBlocksTransition } from './useBlocksTransition';

interface UseRotateBlockProps<T extends BlockType> {
  containerRef: RefObject<HTMLDivElement | null>;
  scrollOffset: number;
  workBlocks: T[];
  updateWorkBlockCallback: (updatedBlock: T) => void;
  updateWorkBlocks: (blocks: T[]) => void;
  collisionOptions?: {
    enabled?: boolean;
    mode?: CollisionType;
  };
}

export const useRotateBlock = <T extends BlockType>({
  containerRef,
  scrollOffset,
  workBlocks,
  updateWorkBlockCallback,
  updateWorkBlocks,
  collisionOptions = { enabled: false, mode: 'obb' },
}: UseRotateBlockProps<T>) => {
  const { computeCollisions, collidedIds } = useCollisionDetection<T>();

  const enableCollision = collisionOptions?.enabled ?? false;
  const collisionType: CollisionType = collisionOptions?.mode ?? 'obb';

  const { animateBlocksTransition } = useBlocksTransition<T>(updateWorkBlocks);

  const [rotatingBlock, setRotatingBlock] = useState<T | null>(null);
  const [startPointerAngleRad, setStartPointerAngleRad] = useState<
    number | null
  >(null);
  const [startAngleDeg, setStartAngleDeg] = useState<number>(0);

  const handleStartRotate = useCallback(
    (e: PointerEvent, block: T) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const centerX = rect.left + block.position.x + block.size.width / 2;
      const centerY = rect.top + block.position.y + block.size.height / 2;
      const pointerAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      setStartPointerAngleRad(pointerAngle);
      setStartAngleDeg(block.angle ?? 0);
      setRotatingBlock(block);
    },
    [containerRef]
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!rotatingBlock || startPointerAngleRad === null) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const centerX =
        rect.left + rotatingBlock.position.x + rotatingBlock.size.width / 2;
      const centerY =
        rect.top + rotatingBlock.position.y + rotatingBlock.size.height / 2;
      const currentAngleRad = Math.atan2(
        e.clientY - centerY,
        e.clientX - centerX
      );
      const deltaRad = currentAngleRad - startPointerAngleRad;
      const deltaDeg = (deltaRad * 180) / Math.PI;
      const nextDeg = startAngleDeg + deltaDeg;

      setRotatingBlock({ ...rotatingBlock, angle: nextDeg });
    },
    [containerRef, rotatingBlock, startPointerAngleRad, startAngleDeg]
  );

  const handlePointerUp = useCallback(() => {
    if (!rotatingBlock) return;
    setRotatingBlock(null);
    setStartPointerAngleRad(null);

    // 충돌 해결 및 블록 정렬
    const { newBlocks, sortedBlocks, updatedBlock } = resolveCollision({
      activeBlock: rotatingBlock,
      workBlocks,
      containerRef,
      scrollOffset,
      collisionType,
    });

    animateBlocksTransition(newBlocks, sortedBlocks);
    updateWorkBlockCallback(updatedBlock);

    if (enableCollision) {
      // enableCollision 옵션이 활성화되어 있으면 충돌 처리
      computeCollisions(sortedBlocks, collisionType);
    }
  }, [
    rotatingBlock,
    workBlocks,
    containerRef,
    scrollOffset,
    collisionType,
    animateBlocksTransition,
    updateWorkBlockCallback,
    enableCollision,
    computeCollisions,
  ]);

  useSetPointerEvents({
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
  });

  return {
    rotatingBlock,
    handleStartRotate,
    collidedIds,
  };
};
