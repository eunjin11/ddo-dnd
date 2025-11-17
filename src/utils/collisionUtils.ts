import type { Position } from '../types/position.type';
import type { Size } from '../types/size.type';
import type { BlockType } from '../types/blockType.type';
import type { RefObject } from 'react';
import { getNewBlocks } from './blockUtils.ts';

// 충돌 감지 함수
export const hasRectangleCollision = (
  currentBlock: { position: Position; size: Size },
  targetBlock: { position: Position; size: Size }
): boolean => {
  // AABB: 사각형의 네 모서리(좌/우/상/하 경계)만 비교
  const ax1 = currentBlock.position.x;
  const ay1 = currentBlock.position.y;
  const ax2 = ax1 + currentBlock.size.width;
  const ay2 = ay1 + currentBlock.size.height;

  const bx1 = targetBlock.position.x;
  const by1 = targetBlock.position.y;
  const bx2 = bx1 + targetBlock.size.width;
  const by2 = by1 + targetBlock.size.height;

  // 한 쪽이 다른 쪽의 바깥에 완전히 있는 경우 충돌 아님
  if (ax2 <= bx1 || bx2 <= ax1 || ay2 <= by1 || by2 <= ay1) {
    return false;
  }
  return true;
};

// 원(써클) 충돌 감지: 각 블록을 중심점과 반지름(가로/세로 중 더 작은 값의 절반)으로 환산해 거리 비교
export const hasCircleCollision = (
  currentBlock: { position: Position; size: Size },
  targetBlock: { position: Position; size: Size }
): boolean => {
  const ax = currentBlock.position.x + currentBlock.size.width / 2;
  const ay = currentBlock.position.y + currentBlock.size.height / 2;
  const bx = targetBlock.position.x + targetBlock.size.width / 2;
  const by = targetBlock.position.y + targetBlock.size.height / 2;

  const ar = Math.min(currentBlock.size.width, currentBlock.size.height) / 2;
  const br = Math.min(targetBlock.size.width, targetBlock.size.height) / 2;

  const dx = ax - bx;
  const dy = ay - by;
  const distSq = dx * dx + dy * dy;
  const radiusSum = ar + br;
  return distSq < radiusSum * radiusSum;
};

export const hasCollisionWithOthers = <T extends BlockType>(
  draggingBlock: T,
  workBlocks: T[],
  draggingBlockId: number
): boolean => {
  return workBlocks.some(block => {
    if (block.id === draggingBlockId) return false;
    return hasRectangleCollision(draggingBlock, block);
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
