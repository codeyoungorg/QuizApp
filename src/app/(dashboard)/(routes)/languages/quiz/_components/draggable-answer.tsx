"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useDrag } from "react-dnd";

type AnswerOption = {
  id: string;
  text: string;
  disabled?: boolean;
};

export const DraggableAnswer = ({
  id,
  text,
  isCorrect,
  disabled,
}: AnswerOption & { isCorrect: boolean }) => {
  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: "answer",
      item: { id, text },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      canDrag: !disabled,
    }),
    [disabled]
  );

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!disabled) {
      drag(ref);
      dragPreview(ref);
    } else {
      drag(null);
      dragPreview(null);
    }
  }, [drag, dragPreview, disabled]);

  return (
    <div
      ref={ref}
      className={cn(
        "p-2 px-4 w-fit bg-white border border-[#FDE3D9] text-[#5B8989] rounded-xl shadow-sm font-medium cursor-move transition-all",
        isDragging ? "opacity-50 scale-105" : "opacity-100",
        isCorrect && "bg-[#D4EDE1] border-[#4EB487]"
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
