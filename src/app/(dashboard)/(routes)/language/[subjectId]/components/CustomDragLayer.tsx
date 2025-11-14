"use client";
import { useDragLayer } from "react-dnd";

export const CustomDragLayer = () => {
  const { isDragging, item, currentOffset, clientOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    clientOffset: monitor.getClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || !item) {
    return null;
  }

  // Use clientOffset if currentOffset is not available (better for touch devices)
  const offset = currentOffset || clientOffset;
  
  if (!offset) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        pointerEvents: "none",
        zIndex: 9999,
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        touchAction: "none", // Prevent touch scrolling
      }}
    >
      <div
        style={{
          transform: `translate(${offset.x - (item.width ? item.width / 2 : 0)}px, ${offset.y - 20}px)`,
          transition: "none", // Remove any transitions for smoother dragging
        }}
      >
        <div
          className="select-none rounded-[12px] border bg-white px-[10px] py-3 text-app-text-black font-semibold shadow-lg opacity-90"
          style={{
            borderWidth: "2px",
            borderColor: "#E6E6E6",
            width: item.width ? `${item.width}px` : "auto",
            transform: "scale(0.95)", // Slightly smaller for better visual feedback
          }}
        >
          <span>{item?.text}</span>
        </div>
      </div>
    </div>
  );
};
