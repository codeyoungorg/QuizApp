"use client";
import { useEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import { cn } from "@/lib/utils";
import correctOption from "@/assets/Images/correct_option.svg";
import Image from "next/image";

type AnswerOption = {
  id: string;
  text: string;
  timerEnded: boolean;
};

export const DraggableAnswer = ({
  id,
  text,
  timerEnded,
  isCorrect,
  questionAnswered,
}: AnswerOption & { isCorrect: boolean; questionAnswered?: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "answer",
    item: () => {
      const width = ref.current?.offsetWidth || 0;
      return { id, text, width };
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: !timerEnded && !questionAnswered,
  }), [id, text, timerEnded, questionAnswered]);

  useEffect(() => {
    drag(ref);
  }, [drag]);

  const borderColor = isCorrect ? "#008000" : "#E6E6E6";
  const canDragItem = !timerEnded && !questionAnswered;

  return (
    <div
      ref={ref}
      className={cn(
        "w-full select-none rounded-[12px] border bg-white px-[10px] py-3 text-app-text-black font-semibold transition-all flex items-center justify-between touch-none",
        isDragging ? "opacity-50" : "opacity-100 hover:bg-gray-50",
        canDragItem ? "cursor-move" : "cursor-not-allowed opacity-60"
      )}
      style={{
        borderWidth: "2px",
        borderColor: borderColor,
      }}
      aria-label={`Drag answer: ${text}`}
    >
      <span>{text}</span>
      {isCorrect && (
        <Image src={correctOption} alt="Correct" className="h-5 w-5" />
      )}
    </div>
  );
};
