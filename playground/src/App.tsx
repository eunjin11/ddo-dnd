import { useRef, useState } from 'react';
import './App.css';
import { type BlockType } from '../../src';
import RectangleBoard from './components/RectangleBoard';
import CircleBoard from './components/CircleBoard';
import OBBBoard from './components/OBBBoard';

interface MyBlock extends BlockType {
  title: string;
  color?: string;
}

// color helpers moved to playground/src/utils/color.ts

function App() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const containerRefCircle = useRef<HTMLDivElement | null>(null);
  const [scrollOffset] = useState(0);

  const [blocks, setBlocks] = useState<MyBlock[]>(() => [
    {
      id: 1,
      position: { x: 60, y: 30 },
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

  const [blocksOBB, setBlocksOBB] = useState<MyBlock[]>(() => [
    {
      id: 4,
      position: { x: 60, y: 40 },
      size: { width: 120, height: 60 },
      angle: 0,
      title: 'Block A',
      color: '#fff',
    },
    {
      id: 5,
      position: { x: 220, y: 60 },
      size: { width: 120, height: 60 },
      angle: 15,
      title: 'Block B',
      color: '#fff',
    },
    {
      id: 6,
      position: { x: 90, y: 140 },
      size: { width: 120, height: 60 },
      angle: -20,
      title: 'Block C',
      color: '#fff',
    },
  ]);

  // kept for reference: updates happen inside board components

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

  // kept for reference: updates happen inside board components

  return (
    <div className="app">
      <h2>ddo-dnd playground</h2>
      <p className="subtitle">블록을 드래그하여 위치를 변경해 보세요.</p>

      <h3 className="subtitle">Rectangle collision</h3>
      <RectangleBoard<MyBlock>
        containerRef={containerRef}
        scrollOffset={scrollOffset}
        blocks={blocks}
        setBlocks={setBlocks}
      />

      <h3 className="subtitle">OBB collision</h3>
      <OBBBoard<MyBlock>
        containerRef={containerRef}
        scrollOffset={scrollOffset}
        blocks={blocksOBB}
        setBlocks={setBlocksOBB}
      />

      <h3 className="subtitle">Circle collision</h3>
      <CircleBoard<MyBlock>
        containerRef={containerRefCircle}
        scrollOffset={scrollOffset}
        blocks={blocksCircle}
        setBlocks={setBlocksCircle}
      />
    </div>
  );
}

export default App;
