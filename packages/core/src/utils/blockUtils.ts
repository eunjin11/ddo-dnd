import type { BlockType } from '../types/blockType.type';

export const getNewBlocks = <T extends BlockType>(
  blocks: T[],
  currentBlock: T
): T[] => {
  const newBlocks = blocks.map(block => {
    if (block.id !== currentBlock.id) {
      return block;
    }
    return currentBlock;
  });
  return newBlocks;
};
