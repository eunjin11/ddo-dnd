import { useCallback, useState } from 'react';
import type { BlockType } from '../types';
import { hasCollision, type CollisionType } from '../utils';

export const useCollisionDetection = <T extends BlockType>() => {
  const [collidedIds, setCollidedIds] = useState<number[]>([]);

  const computeCollisions = useCallback(
    (blocks: T[], mode: CollisionType = 'rectangle') => {
      const next = new Set<number>();
      for (let i = 0; i < blocks.length; i++) {
        for (let j = i + 1; j < blocks.length; j++) {
          if (hasCollision(blocks[i], blocks[j], mode)) {
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
