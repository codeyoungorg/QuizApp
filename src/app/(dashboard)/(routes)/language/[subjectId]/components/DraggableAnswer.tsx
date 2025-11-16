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

type InteractionMode = 'drag' | 'click';

export const DraggableAnswer = ({
  id,
  text,
  timerEnded,
  isCorrect,
  questionAnswered,
  onClick,
  interactionMode = 'drag',
}: AnswerOption & {
  isCorrect: boolean;
  questionAnswered?: boolean;
  onClick?: (item: { id: string; text: string }) => void;
  interactionMode?: InteractionMode;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: "answer",
    item: () => {
      const width = ref.current?.offsetWidth || 0;
      return { id, text, width };
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: interactionMode === 'drag' && !timerEnded && !questionAnswered,
    options: {
      dropEffect: "move",
    },
    previewOptions: {
      captureDraggingState: true,
    },
  }), [id, text, timerEnded, questionAnswered, interactionMode]);

  useEffect(() => {
    if (interactionMode === 'drag') {
      drag(ref);
      preview(getEmptyImage(), { captureDraggingState: true });
    }
  }, [drag, preview, timerEnded, questionAnswered, interactionMode]);

  const handleClick = () => {
    if (interactionMode === 'click' && !timerEnded && !questionAnswered && onClick) {
      onClick({ id, text });
    }
  };

  const borderColor = isCorrect ? "#008000" : "#E6E6E6";
  const canInteract = !timerEnded && !questionAnswered;
  const cursorStyle = interactionMode === 'click' 
    ? (canInteract ? 'cursor-pointer' : 'cursor-not-allowed')
    : (canInteract ? 'cursor-grab' : 'cursor-not-allowed');

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={cn(
        "w-full select-none rounded-[12px] border bg-white px-[10px] py-3 text-app-text-black font-semibold transition-all flex items-center justify-between touch-none",
        isDragging ? "opacity-50" : "opacity-100 hover:bg-gray-50",
        cursorStyle,
        !canInteract && "opacity-60",
        interactionMode === 'click' && canInteract && "active:scale-[0.98]"
      )}
      style={{
        borderWidth: "2px",
        borderColor: borderColor,
      }}
      aria-label={interactionMode === 'click' ? `Click to select: ${text}` : `Drag answer: ${text}`}
    >
      <span>{text}</span>
      {isCorrect && (
        <Image src={correctOption} alt="Correct" className="h-5 w-5" />
      )}
    </div>
  );
};
