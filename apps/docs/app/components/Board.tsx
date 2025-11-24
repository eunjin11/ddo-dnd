'use client';

import { type RefObject } from 'react';
import {
  DragContainer,
  DraggableItem,
  DraggingItem,
  useDragBlock,
  type BlockType,
  useCollisionDetection,
  useRotateBlock,
} from 'ddo-dnd';
import { colorFromPosition, colorFromPositionAlpha } from '../utils/color';

type CollisionMode = 'rectangle' | 'circle' | 'obb';

type WithTitle = BlockType & { title: string; angle?: number };

interface BoardProps<T extends WithTitle> {
  mode: CollisionMode;
  containerRef: RefObject<HTMLDivElement | null>;
  scrollOffset: number;
  blocks: T[];
  setBlocks: React.Dispatch<React.SetStateAction<T[]>>;
}

const Board = <T extends WithTitle>({
  mode,
  containerRef,
  scrollOffset,
  blocks,
  setBlocks,
}: BoardProps<T>) => {
  const updateWorkBlockCallback = (updated: T) => {
    setBlocks(prev => prev.map(b => (b.id === updated.id ? updated : b)));
  };

  const { collidedIds } = useCollisionDetection<T>();

  const { draggingBlock, dragPointerPosition, handleStartDrag, dragOffset } =
    useDragBlock<T>({
      containerRef,
      scrollOffset,
      workBlocks: blocks,
      updateWorkBlockCallback,
      updateWorkBlocks: setBlocks,
      collisionOptions: { enabled: true, mode },
    });

  const usingOBB = mode === 'obb';

  const {
    rotatingBlock,
    handleStartRotate,
    collidedIds: rotatingCollidedIds,
  } = useRotateBlock<T>({
    containerRef,
    workBlocks: blocks,
    updateWorkBlocks: setBlocks,
    scrollOffset,
    updateWorkBlockCallback,
    collisionOptions: { enabled: true, mode: 'obb' },
  });

  const cornerHandleBaseClass =
    'absolute w-[10px] h-[10px] rounded-full bg-white border border-black';

  return (
    <DragContainer containerRef={containerRef}>
      <div className="relative w-[300px] md:w-[400px] h-[220px] border border-dashed border-gray-400 bg-gray-100 select-none">
        {blocks.map(block => (
          <DraggableItem
            key={block.id}
            position={block.position}
            isDragging={
              usingOBB
                ? !!(
                    draggingBlock?.id === block.id ||
                    (rotatingBlock && rotatingBlock.id === block.id)
                  )
                : !!(draggingBlock?.id === block.id)
            }
            handleStartDrag={(e: React.PointerEvent<HTMLDivElement>) => {
              handleStartDrag(e.nativeEvent, block);
            }}
          >
            <div
              className="relative rounded-lg border border-gray-300 shadow flex items-center justify-center text-sm"
              style={{
                width: block.size.width,
                height: block.size.height,
                transform: usingOBB
                  ? `rotate(${block.angle ?? 0}deg)`
                  : undefined,
                transformOrigin: usingOBB ? 'center' : undefined,
                background:
                  collidedIds?.includes(block.id) ||
                  (usingOBB && rotatingCollidedIds?.includes(block.id))
                    ? 'red'
                    : colorFromPosition(block.position),
                borderRadius: mode === 'circle' ? '50%' : 8,
              }}
            >
              {block.title}
              {usingOBB && (
                <>
                  <div
                    className={`${cornerHandleBaseClass} left-[-5px] top-[-5px] ${
                      usingOBB && rotatingBlock
                        ? 'cursor-grabbing'
                        : 'cursor-grab'
                    }`}
                    onPointerDown={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleStartRotate?.(e.nativeEvent, block);
                    }}
                  />
                  <div
                    className={`${cornerHandleBaseClass} right-[-5px] top-[-5px] ${
                      usingOBB && rotatingBlock
                        ? 'cursor-grabbing'
                        : 'cursor-grab'
                    }`}
                    onPointerDown={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleStartRotate?.(e.nativeEvent, block);
                    }}
                  />
                  <div
                    className={`${cornerHandleBaseClass} left-[-5px] bottom-[-5px] ${
                      usingOBB && rotatingBlock
                        ? 'cursor-grabbing'
                        : 'cursor-grab'
                    }`}
                    onPointerDown={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleStartRotate?.(e.nativeEvent, block);
                    }}
                  />
                  <div
                    className={`${cornerHandleBaseClass} right-[-5px] bottom-[-5px] ${
                      usingOBB && rotatingBlock
                        ? 'cursor-grabbing'
                        : 'cursor-grab'
                    }`}
                    onPointerDown={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleStartRotate?.(e.nativeEvent, block);
                    }}
                  />
                </>
              )}
            </div>
          </DraggableItem>
        ))}

        {dragPointerPosition &&
          draggingBlock &&
          (!usingOBB || !rotatingBlock) && (
            <DraggingItem
              position={{
                x: dragPointerPosition.x - dragOffset.x,
                y: dragPointerPosition.y - dragOffset.y,
              }}
            >
              <div
                className="rounded-lg border border-gray-300 flex items-center justify-center"
                style={{
                  width: draggingBlock.size.width,
                  height: draggingBlock.size.height,
                  transform: usingOBB
                    ? `rotate(${draggingBlock.angle ?? 0}deg)`
                    : undefined,
                  transformOrigin: usingOBB ? 'center' : undefined,
                  background: collidedIds?.includes(draggingBlock.id)
                    ? 'red'
                    : colorFromPositionAlpha(draggingBlock.position, 0.2),
                  borderRadius: mode === 'circle' ? '50%' : 8,
                }}
              >
                {draggingBlock.title}
              </div>
            </DraggingItem>
          )}

        {usingOBB && rotatingBlock && (
          <DraggingItem
            position={{
              x: rotatingBlock.position.x,
              y: rotatingBlock.position.y,
            }}
          >
            <div
              className="rounded-lg border border-gray-300 flex items-center justify-content"
              style={{
                width: rotatingBlock.size.width,
                height: rotatingBlock.size.height,
                transform: `rotate(${rotatingBlock.angle ?? 0}deg)`,
                transformOrigin: 'center',
                background: collidedIds?.includes(rotatingBlock.id)
                  ? 'red'
                  : colorFromPositionAlpha(rotatingBlock.position, 0.2),
              }}
            >
              {rotatingBlock.title}
            </div>
          </DraggingItem>
        )}
      </div>
    </DragContainer>
  );
};

export default Board;
