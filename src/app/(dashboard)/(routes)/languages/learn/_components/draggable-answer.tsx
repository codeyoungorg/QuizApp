"use client";
import { useEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import { AnswerOption } from "../_types";
import { cn } from "@/lib/utils";

export const DraggableAnswer = ({
  id,
  text,
  isCorrect,
}: AnswerOption & { isCorrect: boolean }) => {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: "answer",
    item: { id, text },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    drag(ref);
    dragPreview(ref);
  }, [drag, dragPreview]);

  return (
    <div
      ref={ref}
      className={cn(
        "p-2 px-4 w-fit bg-white border border-[#FDE3D9] text-[#5B8989] rounded-xl shadow-sm font-medium cursor-move transition-all",
        isDragging ? "opacity-50 scale-105" : "opacity-100",
        isCorrect ? "bg-green-200" : "bg-orange-100 border"
      )}
      aria-label={`Drag answer: ${text}`}
      style={{
        boxShadow: "0px 2px 4px 0px #0000001F",
      }}
    >
      {text}
    </div>
  );
};
