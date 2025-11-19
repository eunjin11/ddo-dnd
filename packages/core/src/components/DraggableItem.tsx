import type { Position } from '..//types/position.type';

const DraggableItem = ({
  position,
  isDragging,
  handleStartDrag,
  children,
}: {
  position: Position;
  isDragging: boolean;
  handleStartDrag: (e: React.PointerEvent<HTMLDivElement>) => void;
  children: React.ReactNode;
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        opacity: isDragging ? 0 : 1,
        pointerEvents: 'auto',
        zIndex: 1000,
      }}
      onPointerDown={handleStartDrag}
    >
      {children}
    </div>
  );
};

export default DraggableItem;
