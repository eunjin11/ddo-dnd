# ddo-dnd

> 또 쓰고 싶은 dnd 라이브러리, ddo-dnd

간단한 React용 드래그앤드롭(DnD) 라이브러리입니다. 좌표 기반 드래그, 격자 스냅, 충돌 체크를 단순한 API로 제공합니다. 루트에는 라이브러리, `playground/`에는 실행 가능한 데모가 포함됩니다.

## 설치 & 실행

개발 서버(플레이그라운드) 실행:

```bash
cd playground && pnpm i && pnpm dev
```

브라우저에서 `http://localhost:5173` 접속

## 데모 영상
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

### 컴포넌트

- `DragContainer`

  - props: `{ containerRef: RefObject<HTMLDivElement|null>, children, onDrop?, onDragOver? }`
  - 역할: 드래그 대상이 배치될 루트 컨테이너. 상대 좌표 계산 기준.

- `DraggableItem`

  - props: `{ position: Position, isDragging: boolean, handleStartDrag: (e: React.PointerEvent<HTMLDivElement>) => void, children }`
  - 역할: 고정 스타일을 가지며 `position`을 기반으로 `transform` 이동. 드래그 시작 이벤트를 위로 전달.

- `DraggingItem`
  - props: `{ position: Position, children }`
  - 역할: 드래그 중 마우스/포인터를 따라다니는 고스트(포인터 이벤트 없음).

### 훅

- `useDragBlock({ containerRef, scrollOffset, workBlocks, updateWorkBlockTimeOnServer, updateWorkBlocks })`

  - 반환: `{ draggingBlock, dragPointerPosition, dragOffset, handleStartDrag }`
  - 동작:
    - 포인터 이동을 전역 리스너로 수신하고, `draggingBlock.position`을 스냅(`snapPositionToGrid`)해 갱신
    - 드롭 시 범위 체크(`isInBound`) 후 충돌 처리(`resolveCollision`) → 애니메이션(`useBlocksTransition`) → 최종 커밋(`updateWorkBlockTimeOnServer`)

- `useBlocksTransition(updateWorkBlocks)`

  - 반환: `{ animateBlocksTransition(prevBlocks, nextBlocks, durationMs=250) }`
  - 역할: 이전/다음 블록 배열을 보간해 자연스러운 이동 애니메이션 적용 후 마지막에 `nextBlocks` 커밋.

- `useSetPointerEvents({ onPointerMove?, onPointerUp? })`
  - 역할: `window`에 포인터 이벤트 리스너를 등록/해제.

### 타입

- `BlockType`: `{ id: number; position: Position; size: Size }`
- `Position`: `{ x: number; y: number }`
- `Size`: `{ width: number; height: number }`

### 유틸

- `isInBound(position, block, scrollOffset, containerRect, defaultPosition, defaultPositionOffset?, directions?)`: 컨테이너 범위 체크

## 사용 예 (playground 발췌)

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
      {/* ghost content */}
    </DraggingItem>
  )}
</DragContainer>
```

## 개발 스크립트

루트:

```bash
pnpm i
pnpm build
```

플레이그라운드:

```bash
cd playground
pnpm i
pnpm dev
```

## 라이선스

MIT
