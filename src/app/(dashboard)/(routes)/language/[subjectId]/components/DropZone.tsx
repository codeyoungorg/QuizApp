import { useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type AnswerOption = {
  id: string;
  text: string;
};

export const DropZone = ({
  onDrop,
  isCorrect,
  droppedAnswer,
}: {
  onDrop: (item: AnswerOption) => void;
  isCorrect: boolean | null;
  droppedAnswer: string | null;
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "answer",
    drop: (item: AnswerOption) => onDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    drop(ref);
  }, [drop]);

  return (
    <div>
      <div
        ref={ref}
        className={cn     (
          "min-h-[90px] w-full rounded-[20px] flex flex-col items-center justify-center px-4 py-5",
          "transition-all duration-300 border-2",
          droppedAnswer && isCorrect === null
            ? "bg-white border-[#E6E6E6]"
            : isCorrect === true
            ? "bg-white border-[#008000] bg-[#008000]/10"
            : isCorrect === false
            ? "bg-red-50 border-red-400"
            : "bg-[#FAFAFA] border-[#E6E6E6] border-dashed",
          isOver && !droppedAnswer && "border-app-primary bg-blue-50"
        )}
        aria-label="Drop answer here"
      >
        {droppedAnswer ? (
          <div className="text-base font-medium text-app-text-black">
            {droppedAnswer}
          </div>
        ) : (
          <p className="text-sm font-normal text-[#999999]">
            Drag the correct option here
          </p>
        )}
      </div>
      <div className="text-sm w-full mt-4">
        {isCorrect === true && (
          <div className="bg-[#16A34A] text-white px-5 py-2.5 rounded-full flex items-center justify-center w-fit mx-auto font-medium text-sm">
            That's correct! Great job!
          </div>
        )}
        {isCorrect === false && (
          <p className="text-red-500 flex items-center justify-center text-center w-fit mx-auto font-medium text-sm">
            <X className="size-4 mr-2" /> Oops! That's not right. Try a different option.
          </p>
        )}
      </div>
    </div>
  );
};
