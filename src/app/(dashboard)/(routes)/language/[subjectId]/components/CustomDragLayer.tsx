"use client";
import { useDragLayer } from "react-dnd";

export const CustomDragLayer = () => {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || !currentOffset || !item) {
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
      }}
    >
      <div
        style={{
          transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
        }}
      >
        <div
          className="select-none rounded-[12px] border bg-white px-[10px] py-3 text-app-text-black font-semibold shadow-lg"
          style={{
            borderWidth: "2px",
            borderColor: "#E6E6E6",
            width: item.width ? `${item.width}px` : "auto",
          }}
        >
          <span>{item?.text}</span>
        </div>
      </div>
    </div>
  );
};
