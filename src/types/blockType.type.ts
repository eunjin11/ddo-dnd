import type { Position } from './position.type';
import type { Size } from './size.type';

export interface BlockType {
  id: number;
  position: Position;
  size: Size;
}
