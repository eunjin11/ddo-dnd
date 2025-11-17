import { type RefObject, useEffect, useState } from 'react';
import {
  DragContainer,
  DraggableItem,
  DraggingItem,
  useDragBlock,
  type BlockType,
} from '../../../src';
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
  const [rotating, setRotating] = useState<{
    id: number;
    angleStartDeg: number;
    startPointerAngleRad: number;
  } | null>(null);

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

  // 회전 핸들 pointermove/up 전역 처리
  useEffect(() => {
    if (!rotating) return;
    const handleMove = (e: PointerEvent) => {
      const targetBlock = blocks.find(b => Number(b.id) === rotating.id);
      if (!targetBlock) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const centerX =
        rect.left + targetBlock.position.x + targetBlock.size.width / 2;
      const centerY =
        rect.top + targetBlock.position.y + targetBlock.size.height / 2;
      const currentAngleRad = Math.atan2(
        e.clientY - centerY,
        e.clientX - centerX
      );
      const deltaRad = currentAngleRad - rotating.startPointerAngleRad;
      const deltaDeg = (deltaRad * 180) / Math.PI;
      const nextDeg = rotating.angleStartDeg + deltaDeg;
      setBlocks(prev =>
        prev.map(b =>
          Number(b.id) === rotating.id ? { ...b, angle: nextDeg } : b
        )
      );
    };
    const handleUp = () => {
      setRotating(null);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [rotating, blocks, containerRef, setBlocks]);

  const startRotate = (e: React.PointerEvent, block: T) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + block.position.x + block.size.width / 2;
    const centerY = rect.top + block.position.y + block.size.height / 2;
    const startPointerAngleRad = Math.atan2(
      e.clientY - centerY,
      e.clientX - centerX
    );
    const angleStartDeg = block.angle ?? 0;
    setRotating({
      id: Number(block.id),
      angleStartDeg,
      startPointerAngleRad,
    });
  };

  const cornerHandleStyle: React.CSSProperties = {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: '#fff',
    border: '1px solid #000',
    cursor: rotating ? 'grabbing' : 'grab',
  };

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
                position: 'relative',
                width: block.size.width,
                height: block.size.height,
                transform: `rotate(${block.angle ?? 0}deg)`,
                transformOrigin: 'center',
                background: collidedIds?.includes(block.id)
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
                onPointerDown={e => startRotate(e, block)}
              />
              <div
                style={{ ...cornerHandleStyle, right: -5, top: -5 }}
                onPointerDown={e => startRotate(e, block)}
              />
              <div
                style={{ ...cornerHandleStyle, left: -5, bottom: -5 }}
                onPointerDown={e => startRotate(e, block)}
              />
              <div
                style={{ ...cornerHandleStyle, right: -5, bottom: -5 }}
                onPointerDown={e => startRotate(e, block)}
              />
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
      </div>
    </DragContainer>
  );
};

export default OBBBoard;
