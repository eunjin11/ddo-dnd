import { useRef, useState } from 'react';
import './App.css';
import {
  DragContainer,
  DraggableItem,
  DraggingItem,
  useDragBlock,
  type BlockType,
} from '../../src';

interface MyBlock extends BlockType {
  title: string;
  color?: string;
}

const colorFromPosition = (pos: { x: number; y: number }) => {
  const hue = Math.abs(pos.x * 37 + pos.y * 57) % 360;
  return `hsl(${hue} 65% 60%)`;
};

const colorFromPositionAlpha = (pos: { x: number; y: number }, alpha = 0.2) => {
  const hue = Math.abs(pos.x * 37 + pos.y * 57) % 360;
  return `hsl(${hue} 65% 60% / ${alpha})`;
};

function App() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollOffset] = useState(0);

  const [blocks, setBlocks] = useState<MyBlock[]>(() => [
    {
      id: 1,
      position: { x: 40, y: 40 },
      size: { width: 120, height: 60 },
      title: 'Block A',
      color: '#fff',
    },
    {
      id: 2,
      position: { x: 220, y: 40 },
      size: { width: 120, height: 60 },
      title: 'Block B',
      color: '#fff',
    },
    {
      id: 3,
      position: { x: 40, y: 120 },
      size: { width: 120, height: 60 },
      title: 'Block C',
      color: '#fff',
    },
  ]);

  const updateWorkBlockCallback = (updated: MyBlock) => {
    console.log('commit block (mock API):', updated);
    setBlocks(prevBlocks =>
      prevBlocks.map(block => (block.id === updated.id ? updated : block))
    );
  };

  const {
    draggingBlock,
    dragPointerPosition,
    handleStartDrag,
    dragOffset,
    collidedIds,
  } = useDragBlock<MyBlock>({
    containerRef,
    scrollOffset,
    workBlocks: blocks,
    updateWorkBlockCallback,
    updateWorkBlocks: setBlocks,
    collisionOptions: {
      enabled: true,
      mode: 'rectangle',
    },
  });

  return (
    <div className="app">
      <h2>ddo-dnd playground</h2>
      <p className="subtitle">블록을 드래그하여 위치를 변경해 보세요.</p>

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
                {draggingBlock.title} (X:{Math.round(draggingBlock.position.x)}{' '}
                Y:
                {Math.round(draggingBlock.position.y)})
              </div>
            </DraggingItem>
          )}
        </div>
      </DragContainer>
    </div>
  );
}

export default App;
