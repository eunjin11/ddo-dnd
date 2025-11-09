# ddo-dnd

> 또 쓰고 싶은 dnd 라이브러리, ddo-dnd

A lightweight drag-and-drop (DnD) library for React. It offers coordinate-based dragging, grid snapping, and collision checking with a simple API. The repository root contains the library, and `playground/` contains a runnable demo.

## Install & Run

Run the dev server (playground):

```bash
cd playground && pnpm i && pnpm dev
```

Open in your browser: `http://localhost:5173`

## Demo

https://github.com/user-attachments/assets/14789453-d2f0-47d4-840a-5c9041f353fe

## API

```ts
import { DragContainer, DraggableItem, DraggingItem } from 'ddo-dnd';
import {
  useDragBlock,
  useBlocksTransition,
  useSetPointerEvents,
} from 'ddo-dnd';
import type { BlockType, Position, Size } from 'ddo-dnd';
```

### Components

- `DragContainer`

  - props: `{ containerRef: RefObject<HTMLDivElement|null>, children, onDrop?, onDragOver? }`
  - Role: Root container where draggable items are placed; used as the coordinate reference.

- `DraggableItem`

  - props: `{ position: Position, isDragging: boolean, handleStartDrag: (e: React.PointerEvent<HTMLDivElement>) => void, children }`
  - Role: Absolutely positioned item moved via `transform` based on `position`. Propagates the drag-start event upward.

- `DraggingItem`
  - props: `{ position: Position, children }`
  - Role: Ghost element that follows the pointer during dragging (no pointer events).

### Hooks

- `useDragBlock({ containerRef, scrollOffset, workBlocks, updateWorkBlockTimeOnServer, updateWorkBlocks })`

  - Returns: `{ draggingBlock, dragPointerPosition, dragOffset, handleStartDrag }`
  - Behavior:
    - Receives pointer moves via global listeners and updates `draggingBlock.position` snapped with `snapPositionToGrid`
    - On drop: bounds check (`isInBound`) → resolve collisions (`resolveCollision`) → animate (`useBlocksTransition`) → final commit (`updateWorkBlockTimeOnServer`)

- `useBlocksTransition(updateWorkBlocks)`

  - Returns: `{ animateBlocksTransition(prevBlocks, nextBlocks, durationMs=250) }`
  - Role: Interpolates between previous and next block arrays to apply smooth movement animation, then commits `nextBlocks`.

- `useSetPointerEvents({ onPointerMove?, onPointerUp? })`
  - Role: Registers/unregisters pointer event listeners on `window`.

### Types

- `BlockType`: `{ id: number; position: Position; size: Size }`
- `Position`: `{ x: number; y: number }`
- `Size`: `{ width: number; height: number }`

### Utils

- `isInBound(position, block, scrollOffset, containerRect, defaultPosition, defaultPositionOffset?, directions?)`: Container bounds check

## Example

```tsx
<DragContainer containerRef={containerRef}>
  {blocks.map(block => (
    <DraggableItem
      key={block.id}
      position={block.position}
      isDragging={draggingBlock?.id === block.id}
      handleStartDrag={e => {
        handleStartDrag(e.nativeEvent as PointerEvent, block);
      }}
    >
      {/* block content */}
    </DraggableItem>
  ))}

  {dragPointerPosition && draggingBlock && (
    <DraggingItem
      position={{
        x: dragPointerPosition.x - dragOffset.x,
        y: dragPointerPosition.y - dragOffset.y,
      }}
    >
      {/* dragging content */}
    </DraggingItem>
  )}
</DragContainer>
```

## Development scripts

Root:

```bash
pnpm i
pnpm build
```

Playground:

```bash
cd playground
pnpm i
pnpm dev
```

## License

MIT
