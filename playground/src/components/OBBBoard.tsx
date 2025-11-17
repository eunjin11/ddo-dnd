import { type RefObject } from 'react';
import {
  DragContainer,
  DraggableItem,
  DraggingItem,
  useDragBlock,
  type BlockType,
} from '../../../src';
import { useRotateBlock } from '../../../src';
import { colorFromPosition, colorFromPositionAlpha } from '../utils/color';

type WithAngle = BlockType & { title: string; angle?: number };

interface OBBBoardProps<T extends WithAngle> {
  containerRef: RefObject<HTMLDivElement | null>;
  scrollOffset: number;
  blocks: T[];
  setBlocks: React.Dispatch<React.SetStateAction<T[]>>;
}

const OBBBoard = <T extends WithAngle>({
  containerRef,
  scrollOffset,
  blocks,
  setBlocks,
}: OBBBoardProps<T>) => {
  const updateWorkBlockCallback = (updated: T) => {
    setBlocks(prev => prev.map(b => (b.id === updated.id ? updated : b)));
  };

  const {
    draggingBlock,
    dragPointerPosition,
    handleStartDrag,
    dragOffset,
    collidedIds,
  } = useDragBlock<T>({
    containerRef,
    scrollOffset,
    workBlocks: blocks,
    updateWorkBlockCallback,
    updateWorkBlocks: setBlocks,
    collisionOptions: { enabled: true, mode: 'obb' },
  });

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

  const cornerHandleStyle: React.CSSProperties = {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: '#fff',
    border: '1px solid #000',
    cursor: rotatingBlock ? 'grabbing' : 'grab',
  };

  return (
    <DragContainer containerRef={containerRef}>
      <div className="board">
        {blocks.map(block => (
          <DraggableItem
            key={block.id}
            position={block.position}
            isDragging={
              draggingBlock?.id === block.id || rotatingBlock?.id === block.id
            }
            handleStartDrag={(e: React.PointerEvent<HTMLDivElement>) => {
              handleStartDrag(e.nativeEvent as PointerEvent, block);
            }}
          >
            <div
              className="draggable-block"
              style={{
                position: 'relative',
                width: block.size.width,
                height: block.size.height,
                transform: `rotate(${block.angle ?? 0}deg)`,
                transformOrigin: 'center',
                background:
                  collidedIds?.includes(block.id) ||
                  rotatingCollidedIds?.includes(block.id)
                    ? 'red'
                    : colorFromPosition(block.position),
              }}
            >
              {block.title} (X:{Math.round(block.position.x)} Y:
              {Math.round(block.position.y)})
              <br />
              Angle: {Math.round(block.angle ?? 0)}deg
              <div
                style={{ ...cornerHandleStyle, left: -5, top: -5 }}
                onPointerDown={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleStartRotate(e.nativeEvent as PointerEvent, block);
                }}
              />
              <div
                style={{ ...cornerHandleStyle, right: -5, top: -5 }}
                onPointerDown={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleStartRotate(e.nativeEvent as PointerEvent, block);
                }}
              />
              <div
                style={{ ...cornerHandleStyle, left: -5, bottom: -5 }}
                onPointerDown={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleStartRotate(e.nativeEvent as PointerEvent, block);
                }}
              />
              <div
                style={{ ...cornerHandleStyle, right: -5, bottom: -5 }}
                onPointerDown={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleStartRotate(e.nativeEvent as PointerEvent, block);
                }}
              />
            </div>
          </DraggableItem>
        ))}

        {dragPointerPosition && draggingBlock && !rotatingBlock && (
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
                transform: `rotate(${draggingBlock.angle ?? 0}deg)`,
                transformOrigin: 'center',
                background: collidedIds?.includes(draggingBlock.id)
                  ? 'red'
                  : colorFromPositionAlpha(draggingBlock.position, 0.2),
              }}
            >
              {draggingBlock.title} (X:{Math.round(draggingBlock.position.x)} Y:
              {Math.round(draggingBlock.position.y)})
              <br /> Angle:{Math.round(draggingBlock.angle ?? 0)}deg
            </div>
          </DraggingItem>
        )}
        {rotatingBlock && (
          <DraggingItem
            position={{
              x: rotatingBlock.position.x,
              y: rotatingBlock.position.y,
            }}
          >
            <div
              className="dragging-block"
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
              {rotatingBlock.title} (X:{Math.round(rotatingBlock.position.x)} Y:
              {Math.round(rotatingBlock.position.y)})
              <br /> Angle:{Math.round(rotatingBlock.angle ?? 0)}deg
            </div>
          </DraggingItem>
        )}
      </div>
    </DragContainer>
  );
};

export default OBBBoard;
