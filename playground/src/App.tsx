import { useRef, useState } from 'react';
import './App.css';
import {
  DragContainer,
  DraggableItem,
  DraggingItem,
  useDragBlock,
  type BlockType,
} from 'ddo-dnd';

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
  ]);

  const updateWorkBlockTimeOnServer = (updated: MyBlock) => {
    console.log('commit block (mock API):', updated);
    setBlocks(prevBlocks =>
      prevBlocks.map(block => (block.id === updated.id ? updated : block))
    );
  };

  const { draggingBlock, dragPointerPosition, handleStartDrag, dragOffset } =
    useDragBlock<MyBlock>({
      containerRef,
      scrollOffset,
      workBlocks: blocks,
      updateWorkBlockTimeOnServer,
      updateWorkBlocks: setBlocks,
    });

  return (
    <div style={{ padding: 24 }}>
      <h2>ddo-dnd playground</h2>
      <p style={{ marginBottom: 12 }}>
        블록을 드래그하여 위치를 변경해 보세요.
      </p>

      <DragContainer containerRef={containerRef}>
        <div
          style={{
            position: 'relative',
            width: 600,
            height: 320,
            border: '1px dashed #999',
            background: '#fafafa',
            userSelect: 'none',
          }}
        >
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
                style={{
                  width: block.size.width,
                  height: block.size.height,
                  borderRadius: 8,
                  border: '1px solid #ccc',
                  background: colorFromPosition(block.position),
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
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
                style={{
                  width: draggingBlock.size.width,
                  height: draggingBlock.size.height,
                  borderRadius: 8,
                  border: '1px solid #bbb',
                  background: colorFromPositionAlpha(
                    draggingBlock.position,
                    0.2
                  ),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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
