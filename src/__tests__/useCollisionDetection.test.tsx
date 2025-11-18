/* @vitest-environment jsdom */
import { describe, it, expect, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { useCollisionDetection } from '../hooks/useCollisionDetection';
import type { BlockType } from '../types';

afterEach(() => {
  cleanup();
});

type MyBlock = BlockType & { title: string };

const TestComp: React.FC<{
  blocks: MyBlock[];
  mode?: 'rectangle' | 'circle';
}> = ({ blocks, mode = 'rectangle' }) => {
  const { collidedIds, computeCollisions } = useCollisionDetection<MyBlock>();
  React.useEffect(() => {
    computeCollisions(blocks, mode);
  }, [blocks, mode, computeCollisions]);
  return <div data-testid="ids">{JSON.stringify(collidedIds.sort())}</div>;
};

const block = (
  id: number,
  x: number,
  y: number,
  w: number,
  h: number
): MyBlock => ({
  id,
  position: { x, y },
  size: { width: w, height: h },
  title: String(id),
});

describe('useCollisionDetection', () => {
  it('detects rectangle collisions', () => {
    const blocks: MyBlock[] = [
      block(1, 0, 0, 50, 50),
      block(2, 25, 25, 50, 50),
    ];
    render(<TestComp blocks={blocks} mode="rectangle" />);
    expect(screen.getByTestId('ids').textContent).toBe(JSON.stringify([1, 2]));
  });

  it('detects circle collisions', () => {
    const blocks: MyBlock[] = [block(1, 0, 0, 40, 40), block(2, 30, 0, 40, 40)];
    render(<TestComp blocks={blocks} mode="circle" />);
    expect(screen.getByTestId('ids').textContent).toBe(JSON.stringify([1, 2]));
  });

  it('no collisions => empty list', () => {
    const blocks: MyBlock[] = [block(1, 0, 0, 50, 50), block(2, 60, 0, 50, 50)];
    render(<TestComp blocks={blocks} mode="rectangle" />);
    expect(screen.getByTestId('ids').textContent).toBe(JSON.stringify([]));
  });
});
