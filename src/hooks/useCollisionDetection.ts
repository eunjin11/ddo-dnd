import { useCallback, useState } from 'react';
import type { BlockType } from '../types';
import { hasRectangleCollision, hasCircleCollision } from '../utils';

export type CollisionMode = 'rectangle' | 'circle';

export const useCollisionDetection = <T extends BlockType>() => {
  const [collidedIds, setCollidedIds] = useState<number[]>([]);

  const computeCollisions = useCallback(
    (blocks: T[], mode: CollisionMode = 'rectangle') => {
      const next = new Set<number>();
      const compare =
        mode === 'rectangle' ? hasRectangleCollision : hasCircleCollision;
      for (let i = 0; i < blocks.length; i++) {
        for (let j = i + 1; j < blocks.length; j++) {
          if (compare(blocks[i], blocks[j])) {
            next.add(Number(blocks[i].id));
            next.add(Number(blocks[j].id));
          }
        }
      }
      const result = Array.from(next);
      setCollidedIds(result);
      return result;
    },
    []
  );

  return { collidedIds, computeCollisions, setCollidedIds };
};
