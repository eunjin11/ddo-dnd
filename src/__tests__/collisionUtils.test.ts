import { describe, it, expect } from 'vitest';
import {
  hasRectangleCollision,
  hasCircleCollision,
  hasCollision,
} from '../utils/collisionUtils';

const block = (x: number, y: number, w: number, h: number) => ({
  position: { x, y },
  size: { width: w, height: h },
});

describe('collisionUtils', () => {
  describe('hasRectangleCollision', () => {
    it('returns false when rectangles do not overlap', () => {
      const a = block(0, 0, 50, 50);
      const b = block(60, 0, 50, 50);
      expect(hasRectangleCollision(a, b)).toBe(false);
    });

    it('returns true when rectangles overlap', () => {
      const a = block(0, 0, 50, 50);
      const b = block(25, 25, 50, 50);
      expect(hasRectangleCollision(a, b)).toBe(true);
    });

    it('returns false when rectangles are exactly touching edges', () => {
      const a = block(0, 0, 50, 50);
      const b = block(50, 0, 50, 50); // touch at edge
      expect(hasRectangleCollision(a, b)).toBe(false);
    });
  });

  describe('hasCircleCollision', () => {
    it('returns false when circles are apart', () => {
      const a = block(0, 0, 40, 40); // r=20 center (20,20)
      const b = block(100, 0, 40, 40); // r=20 center (120,20)
      expect(hasCircleCollision(a, b)).toBe(false);
    });

    it('returns true when circles overlap', () => {
      const a = block(0, 0, 40, 40); // center (20,20)
      const b = block(30, 0, 40, 40); // center (50,20) dist=30, rSum=40
      expect(hasCircleCollision(a, b)).toBe(true);
    });

    it('returns false when circles just touch', () => {
      const a = block(0, 0, 40, 40); // center (20,20)
      const b = block(40, 0, 40, 40); // center (60,20) dist=40, rSum=40
      expect(hasCircleCollision(a, b)).toBe(false);
    });
  });

  describe('hasCollision (dispatcher)', () => {
    it('dispatches to rectangle mode', () => {
      const a = block(0, 0, 50, 50);
      const b = block(25, 25, 50, 50);
      expect(hasCollision(a, b, 'rectangle')).toBe(true);
    });
    it('dispatches to circle mode', () => {
      const a = block(0, 0, 40, 40);
      const b = block(30, 0, 40, 40);
      expect(hasCollision(a, b, 'circle')).toBe(true);
    });
  });
});
