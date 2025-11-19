import type { Position } from '../types/position.type';

const DraggingItem = ({
  position,
  children,
}: {
  position: Position;
  children: React.ReactNode;
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      {children}
    </div>
  );
};

export default DraggingItem;
