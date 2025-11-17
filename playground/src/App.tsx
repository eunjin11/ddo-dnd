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
  const containerRefCircle = useRef<HTMLDivElement | null>(null);
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

  const [blocksCircle, setBlocksCircle] = useState<MyBlock[]>(() => [
    {
      id: 101,
      position: { x: 60, y: 60 },
      size: { width: 100, height: 100 },
      title: 'Circle A',
      color: '#fff',
    },
    {
      id: 102,
      position: { x: 240, y: 60 },
      size: { width: 80, height: 80 },
      title: 'Circle B',
      color: '#fff',
    },
  ]);

  const updateWorkBlockCallbackCircle = (updated: MyBlock) => {
    setBlocksCircle(prev => prev.map(b => (b.id === updated.id ? updated : b)));
  };

  const {
    draggingBlock: draggingBlock2,
    dragPointerPosition: dragPointerPosition2,
    handleStartDrag: handleStartDrag2,
    dragOffset: dragOffset2,
    collidedIds: collidedIds2,
  } = useDragBlock<MyBlock>({
    containerRef: containerRefCircle,
    scrollOffset,
    workBlocks: blocksCircle,
    updateWorkBlockCallback: updateWorkBlockCallbackCircle,
    updateWorkBlocks: setBlocksCircle,
    collisionOptions: {
      enabled: true,
      mode: 'circle',
    },
  });

  return (
    <div className="app">
      <h2>ddo-dnd playground</h2>
      <p className="subtitle">블록을 드래그하여 위치를 변경해 보세요.</p>

      <h3 className="subtitle">Rectangle collision</h3>
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

      <h3 className="subtitle">Circle collision</h3>
      <DragContainer containerRef={containerRefCircle}>
        <div className="board">
          {blocksCircle.map(block => (
            <DraggableItem
              key={block.id}
              position={block.position}
              isDragging={draggingBlock2?.id === block.id}
              handleStartDrag={(e: React.PointerEvent<HTMLDivElement>) => {
                handleStartDrag2(e.nativeEvent as PointerEvent, block);
              }}
            >
              <div
                className="draggable-block"
                style={{
                  width: block.size.width,
                  height: block.size.height,
                  background: collidedIds2?.includes(block.id)
                    ? 'red'
                    : colorFromPosition(block.position),
                  borderRadius: '50%',
                }}
              >
                {block.title} (X:{Math.round(block.position.x)} Y:
                {Math.round(block.position.y)})
              </div>
            </DraggableItem>
          ))}

          {dragPointerPosition2 && draggingBlock2 && (
            <DraggingItem
              position={{
                x: dragPointerPosition2.x - dragOffset2.x,
                y: dragPointerPosition2.y - dragOffset2.y,
              }}
            >
              <div
                className="dragging-block"
                style={{
                  width: draggingBlock2.size.width,
                  height: draggingBlock2.size.height,
                  background: collidedIds2?.includes(draggingBlock2.id)
                    ? 'red'
                    : colorFromPositionAlpha(draggingBlock2.position, 0.2),
                  borderRadius: '50%',
                }}
              >
                {draggingBlock2.title} (X:
                {Math.round(draggingBlock2.position.x)} Y:
                {Math.round(draggingBlock2.position.y)})
              </div>
            </DraggingItem>
          )}
        </div>
      </DragContainer>
    </div>
  );
}

export default App;
