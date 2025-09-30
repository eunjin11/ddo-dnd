import { useRef, useState } from "react";
import "./App.css";
import {
  DragContainer,
  DraggableItem,
  DraggingItem,
  useDragBlock,
  type BlockType,
} from "../../src";

function App() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollOffset] = useState(0);

  const [blocks, setBlocks] = useState<BlockType[]>(() => [
    { id: 1, position: { x: 40, y: 40 }, size: { width: 120, height: 60 } },
    { id: 2, position: { x: 220, y: 40 }, size: { width: 120, height: 60 } },
  ]);

  const updateWorkBlockTimeOnServer = (updated: BlockType) => {
    // playground에서는 로그만 남깁니다
    console.log("commit block (mock API):", updated);
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) => (block.id === updated.id ? updated : block))
    );
  };

  const { draggingBlock, dragPointerPosition, handleStartDrag, dragOffset } =
    useDragBlock({
      containerRef,
      scrollOffset,
      workBlocks: blocks,
      updateWorkBlockTimeOnServer,
      updateWorkBlocks: setBlocks,
    });

  return (
    <div style={{ padding: 24 }}>
      <h2>ddo-dnd playground</h2>
      <p style={{ marginBottom: 12 }}>
        블록을 드래그하여 위치를 변경해 보세요.
      </p>

      <DragContainer containerRef={containerRef}>
        <div
          style={{
            position: "relative",
            width: 600,
            height: 320,
            border: "1px dashed #999",
            background: "#fafafa",
            userSelect: "none",
          }}
        >
          {blocks.map((block) => (
            <DraggableItem
              key={block.id}
              position={block.position}
              isDragging={draggingBlock?.id === block.id}
              handleStartDrag={(e) => {
                // React PointerEvent -> native PointerEvent로 변환 필요
                // useDragBlock은 native PointerEvent를 받습니다
                handleStartDrag(e.nativeEvent as PointerEvent, block);
              }}
            >
              <div
                style={{
                  width: block.size.width,
                  height: block.size.height,
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  background: "#fff",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                }}
              >
                Block {block.id}
              </div>
            </DraggableItem>
          ))}

          {dragPointerPosition && draggingBlock && (
            <DraggingItem
              position={{
                x: dragPointerPosition.x - dragOffset.x,
                y: dragPointerPosition.y - dragOffset.y,
              }}
            >
              <div
                style={{
                  width: draggingBlock.size.width,
                  height: draggingBlock.size.height,
                  borderRadius: 8,
                  border: "1px solid #bbb",
                  background: "rgba(100, 100, 255, 0.2)",
                }}
              />
            </DraggingItem>
          )}
        </div>
      </DragContainer>
    </div>
  );
}

export default App;
