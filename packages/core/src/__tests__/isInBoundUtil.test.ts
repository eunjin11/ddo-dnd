import { describe, it, expect } from 'vitest';
import isInBound from '../utils/isInBoundUtil';

const block = (w: number, h: number) => ({
  size: { width: w, height: h },
});

describe('isInBoundUtil', () => {
  const container = {
    clientWidth: 300,
    clientHeight: 200,
  } as unknown as HTMLDivElement;
  const defaultPos = { x: 0, y: 0 };
  const defaultOffset = { x: 0, y: 10 };

  it('returns true when fully inside container', () => {
    const pos = { x: 10, y: 10 };
    expect(
      isInBound(pos, block(50, 50), 0, container, defaultPos, defaultOffset)
    ).toBe(true);
  });

  it('returns false when left overflow', () => {
    const pos = { x: -1, y: 10 };
    expect(
      isInBound(pos, block(50, 50), 0, container, defaultPos, defaultOffset)
    ).toBe(false);
  });

  it('returns false when right overflow', () => {
    const pos = { x: 260, y: 10 }; // 260 + 50 > 300
    expect(
      isInBound(pos, block(50, 50), 0, container, defaultPos, defaultOffset)
    ).toBe(false);
  });

  it('returns false when bottom overflow', () => {
    const pos = { x: 10, y: 160 }; // 160 + 50 > 200
    expect(
      isInBound(pos, block(50, 50), 0, container, defaultPos, defaultOffset)
    ).toBe(false);
  });
});
