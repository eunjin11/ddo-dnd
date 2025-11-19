'use client';

import { useRef, useState } from 'react';
import { type BlockType } from 'ddo-dnd';
import RectangleBoard from './RectangleBoard';
import CircleBoard from './CircleBoard';
import OBBBoard from './OBBBoard';

interface MyBlock extends BlockType {
  title: string;
  color?: string;
}

function Demo() {
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

  return (
    <div className="p-10 justify-center flex flex-col items-center">
      <h2 className="text-2xl font-semibold">ddo-dnd playground</h2>
      <p className="mb-3 text-gray-600">
        블록이 충돌 시 빨간색으로 표시됩니다.
      </p>
      <div className="flex gap-6">
        <div className="flex flex-col items-center">
          <h3 className="mb-3 font-semibold">Rectangle collision</h3>
          <p className="mb-3 text-gray-600">
            블록을 드래그하여 위치를 변경해 보세요.
          </p>
          <RectangleBoard<MyBlock>
            containerRef={containerRef}
            scrollOffset={scrollOffset}
            blocks={blocks}
            setBlocks={setBlocks}
          />
        </div>

        <div className="flex flex-col items-center">
          <h3 className="mb-3 font-semibold">OBB collision</h3>
          <p className="mb-3 text-gray-600">
            모서리를 잡고 회전시킨 후 충돌을 확인해 보세요.
          </p>
          <OBBBoard<MyBlock>
            containerRef={containerRef}
            scrollOffset={scrollOffset}
            blocks={blocksOBB}
            setBlocks={setBlocksOBB}
          />
        </div>
      </div>
      <div className="flex flex-col items-center mt-6">
        <h3 className="mb-3 font-semibold">Circle collision</h3>
        <p className="mb-3 text-gray-600">원이 충돌되는지 확인해 보세요.</p>
        <CircleBoard<MyBlock>
          containerRef={containerRefCircle}
          scrollOffset={scrollOffset}
          blocks={blocksCircle}
          setBlocks={setBlocksCircle}
        />
      </div>
    </div>
  );
}

export default Demo;
