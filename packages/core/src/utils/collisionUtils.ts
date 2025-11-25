import type { Position } from '../types/position.type';
import type { Size } from '../types/size.type';
import type { BlockType } from '../types/blockType.type';
import type { RefObject } from 'react';
import { getNewBlocks } from './blockUtils.ts';

export type CollisionType = 'rectangle' | 'circle' | 'obb';

// 충돌 감지 함수
export const hasCollision = (
  currentBlock: BlockType,
  targetBlock: BlockType,
  collisionType: CollisionType = 'rectangle'
): boolean => {
  switch (collisionType) {
    case 'circle':
      return hasCircleCollision(currentBlock, targetBlock);
    case 'obb':
      return hasOBBCollision(currentBlock, targetBlock);
    case 'rectangle':
    default:
      return hasRectangleCollision(currentBlock, targetBlock);
  }
};

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

const dot2D = (a: Position, b: Position) => a.x * b.x + a.y * b.y;

const sub2D = (a: Position, b: Position): Position => ({
  x: a.x - b.x,
  y: a.y - b.y,
});

interface OBBInternal {
  center: Position;
  halfSize: { x: number; y: number };
  u: Position;
  v: Position;
}

const createOBBFromBlock = (block: BlockType): OBBInternal => {
  const center: Position = {
    x: block.position.x + block.size.width / 2,
    y: block.position.y + block.size.height / 2,
  };

  // block.angle은 deg 기준으로 관리하므로 rad로 변환
  const angleDeg = block.angle ?? 0;
  const angleRad = (angleDeg * Math.PI) / 180;
  const c = Math.cos(angleRad);
  const s = Math.sin(angleRad);

  return {
    center,
    halfSize: {
      x: block.size.width / 2,
      y: block.size.height / 2,
    },
    // local X, Y 축 (단위 벡터)
    u: { x: c, y: s }, // x axis
    v: { x: -s, y: c }, // y axis (수직)
  };
};

export const hasOBBCollision = (
  currentBlock: BlockType,
  targetBlock: BlockType
): boolean => {
  const EPSILON = 1e-8;

  const A = createOBBFromBlock(currentBlock);
  const B = createOBBFromBlock(targetBlock);

  const tWorld = sub2D(B.center, A.center);
  // A의 로컬 좌표계로 변환
  const t = {
    x: dot2D(tWorld, A.u),
    y: dot2D(tWorld, A.v),
  };

  // R[i][j] = A의 i축 · B의 j축
  const R = [
    [dot2D(A.u, B.u), dot2D(A.u, B.v)],
    [dot2D(A.v, B.u), dot2D(A.v, B.v)],
  ];

  const AbsR = [
    [Math.abs(R[0][0]) + EPSILON, Math.abs(R[0][1]) + EPSILON],
    [Math.abs(R[1][0]) + EPSILON, Math.abs(R[1][1]) + EPSILON],
  ];

  const a = A.halfSize;
  const b = B.halfSize;

  let ra: number;
  let rb: number;

  // 1) A의 x축
  ra = a.x;
  rb = b.x * AbsR[0][0] + b.y * AbsR[0][1];
  if (Math.abs(t.x) > ra + rb) return false;

  // 2) A의 y축
  ra = a.y;
  rb = b.x * AbsR[1][0] + b.y * AbsR[1][1];
  if (Math.abs(t.y) > ra + rb) return false;

  // 3) B의 x축
  ra = a.x * AbsR[0][0] + a.y * AbsR[1][0];
  rb = b.x;
  if (Math.abs(t.x * R[0][0] + t.y * R[1][0]) > ra + rb) return false;

  // 4) B의 y축
  ra = a.x * AbsR[0][1] + a.y * AbsR[1][1];
  rb = b.y;
  if (Math.abs(t.x * R[0][1] + t.y * R[1][1]) > ra + rb) return false;

  return true;
};

export const hasCollisionWithOthers = <T extends BlockType>(
  draggingBlock: T,
  workBlocks: T[],
  draggingBlockId: number,
  collisionType: CollisionType = 'rectangle'
): boolean => {
  return workBlocks.some(block => {
    if (block.id === draggingBlockId) return false;
    return hasCollision(draggingBlock, block, collisionType);
  });
};

interface ResolveCollisionParams<T extends BlockType> {
  activeBlock: T;
  workBlocks: T[];
  containerRef: RefObject<HTMLDivElement | null>;
  scrollOffset: number;
  collisionType?: CollisionType;
}

interface ResolveCollisionResult<T extends BlockType> {
  updatedBlock: T;
  sortedBlocks: T[];
  newBlocks: T[];
}

export const resolveCollision = <T extends BlockType>({
  activeBlock,
  workBlocks,
  collisionType = 'rectangle',
}: ResolveCollisionParams<T>): ResolveCollisionResult<T> => {
  // 해당 x좌표와 valid한 y좌표 조합에 블록이 이미 존재하는지 확인
  // 블록이 이미 있다면 y좌표를 증가하여 생성
  const otherBlocks = workBlocks.filter(b => b.id !== activeBlock.id);

  const newBlocks = getNewBlocks(workBlocks, activeBlock);

  if (
    hasCollisionWithOthers(
      activeBlock,
      otherBlocks,
      activeBlock.id,
      collisionType
    )
  ) {
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
