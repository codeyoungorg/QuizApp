import { useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { AnswerOption } from "../_types";
import { cn } from "@/lib/utils";
import { AlertCircle, Check, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DropZone = ({
  onDrop,
  isCorrect,
  droppedAnswer,
}: {
  onDrop: (item: AnswerOption) => void;
  isCorrect: boolean | null;
  droppedAnswer: string | null;
}) => {
  const [speechSynthesis, setSpeechSynthesis] =
    useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

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

  const speakWord = (text: string) => {
    if (speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div>
      <div
        ref={ref}
        className={cn(
          "h-20 w-full ${bgColor} bg-[#F1EFEE] rounded-2xl flex flex-col items-center justify-center",
          isOver ? "" : "",
          "transition-all duration-300",
          isCorrect ? "bg-[#D4EDE1]" : isCorrect === false ? "bg-red-100" : ""
        )}
        style={{
          border:
            isCorrect === true ? "1px solid #4EB487" : "1px solid #E8E5E3",
        }}
        aria-label="Drop answer here"
      >
        {droppedAnswer ? (
          <div className="flex items-center gap-2">
            <div className={cn("text-xl font-bold text-[#5B8989]")}>
              {droppedAnswer}
            </div>
            <div
              className={cn(
                "flex items-center justify-between w-full",
                !isCorrect && "hidden"
              )}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={() => speakWord(droppedAnswer)}
                className="rounded-full w-7 h-7"
              >
                <Volume2 className="h-3 w-3 text-[#5B8989]" />
                <span className="sr-only">Pronounce question</span>
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm font-medium text-[#5B8989]">
            Drag the correct option here
          </p>
        )}
      </div>
      <div className="text-sm w-full">
        {isCorrect === true && (
          <p className="text-[#49AC7E] flex items-center text-center w-fit mx-auto mt-2">
            <Check className="size-4 mr-2" /> Wow! That is correct!
          </p>
        )}
        {isCorrect === false && (
          <p className="text-[#FF7D5D] flex items-center text-center w-fit mx-auto mt-2">
            <AlertCircle className="size-4 mr-2" /> Oops that’s not right! Try a
            different option.
          </p>
        )}
      </div>
    </div>
  );
};
