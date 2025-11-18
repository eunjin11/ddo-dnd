import { type RefObject } from 'react';
import {
  DragContainer,
  DraggableItem,
  DraggingItem,
  useDragBlock,
  type BlockType,
} from '../../../src';
import { colorFromPosition, colorFromPositionAlpha } from '../utils/color';
import { useCollisionDetection } from '../../../src/hooks/useCollisionDetection';

type WithTitle = BlockType & { title: string };

interface RectangleBoardProps<T extends WithTitle> {
  containerRef: RefObject<HTMLDivElement | null>;
  scrollOffset: number;
  blocks: T[];
  setBlocks: React.Dispatch<React.SetStateAction<T[]>>;
}

const RectangleBoard = <T extends WithTitle>({
  containerRef,
  scrollOffset,
  blocks,
  setBlocks,
}: RectangleBoardProps<T>) => {
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
      collisionOptions: { enabled: true, mode: 'rectangle' },
    });

  return (
    <DragContainer containerRef={containerRef}>
      <div className="board">
        {blocks.map(block => (
          <DraggableItem
            key={block.id}
            position={block.position}
            isDragging={draggingBlock?.id === block.id}
            handleStartDrag={(e: React.PointerEvent<HTMLDivElement>) => {
              handleStartDrag(e.nativeEvent as PointerEvent, block);
            }}
          >
            <div
              className="draggable-block"
              style={{
                width: block.size.width,
                height: block.size.height,
                background: collidedIds?.includes(block.id)
                  ? 'red'
                  : colorFromPosition(block.position),
              }}
            >
              {block.title} (X:{Math.round(block.position.x)} Y:
              {Math.round(block.position.y)})
            </div>
          </DraggableItem>
        ))}

        {dragPointerPosition && draggingBlock && (
          <DraggingItem
            position={{
              x: dragPointerPosition.x - dragOffset.x,
              y: dragPointerPosition.y - dragOffset.y,
            }}
          >
            <div
              className="dragging-block"
              style={{
                width: draggingBlock.size.width,
                height: draggingBlock.size.height,
                background: collidedIds?.includes(draggingBlock.id)
                  ? 'red'
                  : colorFromPositionAlpha(draggingBlock.position, 0.2),
              }}
            >
              {draggingBlock.title} (X:{Math.round(draggingBlock.position.x)} Y:
              {Math.round(draggingBlock.position.y)})
            </div>
          </DraggingItem>
        )}
      </div>
    </DragContainer>
  );
};

export default RectangleBoard;
