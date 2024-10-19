"use client";

import { cn } from "@/lib/utils";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

interface WordProps {
  word: string;
  index: number;
  moveWord: (
    dragIndex: number,
    hoverIndex: number,
    fromArea: string,
    toArea: string
  ) => void;
  area: "available" | "sentence";
}

export const Word: React.FC<WordProps> = ({ word, index, moveWord, area }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: "word",
    item: { index, area, word },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (!dropResult && area === "sentence") {
        moveWord(index, -1, "sentence", "available");
      }
    },
  });

  const [, drop] = useDrop({
    accept: "word",
    hover: (item: { index: number; area: string }, monitor) => {
      if (item.area !== area) return;
      if (item.index === index) return;

      moveWord(item.index, index, area, area);
      item.index = index;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={cn(
        "p-2 px-4 w-fit bg-white border border-[#FDE3D9] text-[#5B8989] rounded-xl shadow-sm font-medium cursor-move transition-all",
        isDragging ? "opacity-50 scale-105" : "opacity-100"
      )}
      aria-label={`Drag word: ${word}`}
      style={{
        boxShadow: "0px 2px 4px 0px #0000001F",
      }}
    >
      {word}
    </div>
  );
};
