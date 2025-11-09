import type { Position } from '../types/position.type';
import type { Size } from '../types/size.type';
import type { BlockType } from '../types/blockType.type';
import type { RefObject } from 'react';
import { getNewBlocks } from './blockUtils.ts';

// 충돌 감지 함수
export const hasCollision = (
  currentBlock: { position: Position; size: Size },
  targetBlock: { position: Position; size: Size }
): boolean => {
  const currentCenterX = currentBlock.position.x + currentBlock.size.width / 2;
  const currentCenterY = currentBlock.position.y + currentBlock.size.height / 2;

  const targetCenterX = targetBlock.position.x + targetBlock.size.width / 2;
  const targetCenterY = targetBlock.position.y + targetBlock.size.height / 2;

  const distanceX = Math.abs(currentCenterX - targetCenterX);
  const distanceY = Math.abs(currentCenterY - targetCenterY);

  return (
    distanceX < currentBlock.size.width / 2 + targetBlock.size.width / 2 &&
    distanceY < currentBlock.size.height / 2 + targetBlock.size.height / 2
  );
};

export const hasCollisionWithOthers = <T extends BlockType>(
  draggingBlock: T,
  workBlocks: T[],
  draggingBlockId: number
): boolean => {
  return workBlocks.some(block => {
    if (block.id === draggingBlockId) return false;
    return hasCollision(draggingBlock, block);
  });
};

interface ResolveCollisionParams<T extends BlockType> {
  activeBlock: T;
  workBlocks: T[];
  containerRef: RefObject<HTMLDivElement | null>;
  scrollOffset: number;
}

interface ResolveCollisionResult<T extends BlockType> {
  updatedBlock: T;
  sortedBlocks: T[];
  newBlocks: T[];
}

export const resolveCollision = <T extends BlockType>({
  activeBlock,
  workBlocks,
}: ResolveCollisionParams<T>): ResolveCollisionResult<T> => {
  // 해당 x좌표와 valid한 y좌표 조합에 블록이 이미 존재하는지 확인
  // 블록이 이미 있다면 y좌표를 증가하여 생성
  const otherBlocks = workBlocks.filter(b => b.id !== activeBlock.id);

  const newBlocks = getNewBlocks(workBlocks, activeBlock);

  if (hasCollisionWithOthers(activeBlock, otherBlocks, activeBlock.id)) {
    // 현재 블록이 가득차있는 블록이면 y좌표를 증가하여 생성
    const newPosition = {
      x: activeBlock.position.x,
      y: activeBlock.position.y, // TODO: 충돌 처리 후 이동 가능한 위치 반환
    };

    const updatedBlock = {
      ...activeBlock,
      position: newPosition,
    };

    return {
      updatedBlock,
      sortedBlocks: newBlocks, // TODO: sort 처리 코드 분리 및 함수 분리
      newBlocks,
    };
  }

  return {
    updatedBlock: activeBlock,
    sortedBlocks: newBlocks, // TODO: sort 처리 코드 분리 및 함수 분리
    newBlocks,
  };
};
