"use client";
import { useEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
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
  const touchStartTime = useRef<number>(0);

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: "answer",
    item: () => {
      const width = ref.current?.offsetWidth || 0;
      // Handle touch prevention when drag starts
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
        document.body.style.userSelect = 'none';
      }
      return { id, text, width };
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: !timerEnded && !questionAnswered,
    options: {
      dropEffect: "move",
    },
    previewOptions: {
      captureDraggingState: true,
      anchorX: 0.5,
      anchorY: 0.5,
    },
  }), [id, text, timerEnded, questionAnswered]);

  // Handle touch restoration when drag ends
  useEffect(() => {
    if (!isDragging) {
      // Re-enable scrolling when drag ends
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
        document.body.style.userSelect = '';
      }
    }
  }, [isDragging]);

  useEffect(() => {
    drag(ref);
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [drag, preview, timerEnded, questionAnswered]);

  const borderColor = isCorrect ? "#008000" : "#E6E6E6";
  const canDragItem = !timerEnded && !questionAnswered;

  return (
    <div
      ref={ref}
      className={cn(
        "w-full select-none rounded-[12px] border bg-white px-[10px] py-3 text-app-text-black font-semibold transition-all flex items-center justify-between touch-none",
        isDragging ? "opacity-50" : "opacity-100 hover:bg-gray-50",
        canDragItem ? "cursor-grab" : "cursor-not-allowed opacity-60"
      )}
      style={{
        borderWidth: "2px",
        borderColor: borderColor,
        touchAction: "none", // Prevent all touch actions
        userSelect: "none", // Prevent text selection
        WebkitUserSelect: "none", // Safari
        MozUserSelect: "none", // Firefox
        msUserSelect: "none", // IE/Edge
      }}
      aria-label={`Drag answer: ${text}`}
      onTouchStart={(e) => {
        touchStartTime.current = Date.now();
        console.log('DraggableAnswer: Touch start event at', touchStartTime.current, 'for text:', text);
        if (canDragItem) {
          // Don't prevent default - let react-dnd handle it
          console.log('DraggableAnswer: Touch start - item can be dragged');
        } else {
          console.log('DraggableAnswer: Touch start - item cannot be dragged (timerEnded or questionAnswered)');
        }
      }}
      onTouchMove={(e) => {
        const touchMoveTime = Date.now();
        const timeDiff = touchMoveTime - touchStartTime.current;
        console.log('DraggableAnswer: Touch move after', timeDiff, 'ms, isDragging:', isDragging);
        if (canDragItem) {
          // Let react-dnd handle the touch move
          console.log('DraggableAnswer: Touch move - allowing for drag');
        }
      }}
      onTouchEnd={(e) => {
        const touchEndTime = Date.now();
        const totalTime = touchEndTime - touchStartTime.current;
        console.log('DraggableAnswer: Touch end after', totalTime, 'ms, isDragging was:', isDragging);
      }}
    >
      <span>{text}</span>
      {isCorrect && (
        <Image src={correctOption} alt="Correct" className="h-5 w-5" />
      )}
    </div>
  );
};
