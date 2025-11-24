'use client';

import { useRef, useState } from 'react';
import { type BlockType, type CollisionType } from 'ddo-dnd';
import Board from './Board';

interface MyBlock extends BlockType {
  title: string;
  color?: string;
}

const CustomBoard = () => {
  const [mode, setMode] = useState<CollisionType>('rectangle');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [blocks, setBlocks] = useState<MyBlock[]>(() => [
    {
      id: 1,
      position: { x: 40, y: 30 },
      size: { width: 50, height: 50 },
      title: 'Block A',
      color: '#fff',
    },
    {
      id: 2,
      position: { x: 120, y: 40 },
      size: { width: 50, height: 50 },
      title: 'Block B',
      color: '#fff',
    },
    {
      id: 3,
      position: { x: 210, y: 120 },
      size: { width: 50, height: 50 },
      title: 'Block C',
      color: '#fff',
    },
  ]);
  return (
    <div className="p-4 md:p-10 justify-center flex flex-col items-center">
      <div className="mb-4 flex items-center justify-center">
        <div className="inline-flex rounded-lg bg-gray-100 p-1">
          {[
            { value: 'rectangle' as CollisionType, label: 'Rectangle' },
            { value: 'circle' as CollisionType, label: 'Circle' },
            { value: 'obb' as CollisionType, label: 'OBB' },
          ].map(opt => {
            const checked = mode === opt.value;
            return (
              <label
                key={opt.value}
                className={
                  'cursor-pointer select-none px-3 py-1.5 text-sm font-medium transition ' +
                  (checked
                    ? 'bg-white text-gray-900 shadow ring-1 ring-gray-200 rounded-md'
                    : 'text-gray-600 hover:text-gray-900 rounded-md')
                }
              >
                <input
                  type="radio"
                  name="collision-mode"
                  value={opt.value}
                  checked={checked}
                  onChange={() => setMode(opt.value)}
                  className="sr-only"
                  aria-label={opt.label}
                />
                {opt.label}
              </label>
            );
          })}
        </div>
      </div>
      <Board<MyBlock>
        mode={mode}
        containerRef={containerRef}
        scrollOffset={0}
        blocks={blocks}
        setBlocks={setBlocks}
      />
    </div>
  );
};

export default CustomBoard;
