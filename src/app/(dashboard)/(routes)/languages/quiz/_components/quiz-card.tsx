import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, TimerIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnswerOption, FlashcardData } from "../../learn/_types";
import { DropZone } from "./dropzone";
import { DraggableAnswer } from "./draggable-answer";

type FlashcardProps = {
  data: FlashcardData;
  currentCard: number;
  totalCards: number;
  onNextCard: () => void;
  onPrevCard: () => void;
  onAnswer: (isCorrect: boolean) => void;
};

export const Quizcard: React.FC<FlashcardProps> = ({
  data,
  currentCard,
  totalCards,
  onNextCard,
  onAnswer,
  onPrevCard,
}) => {
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [droppedAnswer, setDroppedAnswer] = useState<string | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    setIsCorrect(null);
    setDroppedAnswer(null);
    setShowCorrectAnswer(false);
    setHasAnswered(false);
  }, [data.question]);

  const handleDrop = (item: AnswerOption) => {
    if (hasAnswered) return;
    const correct = item.text === data.correctAnswer;
    setDroppedAnswer(item.text);
    setIsCorrect(correct);
    setShowCorrectAnswer(true);
    setHasAnswered(true);
    onAnswer(correct);
  };

  const progressBar = Math.round((currentCard / totalCards) * 100).toFixed(0);
  return (
    <Card
      className="w-full max-w-lg bg-[#faf9f9]"
      style={{
        boxShadow: "0px 8px 16px 0px #00000014",
      }}
    >
      <div className="grid grid-cols-3 items-center p-4 py-2 border-b relative">
        <span className="text-sm text-[#5B8989] text-left w-full">
          {currentCard} of {totalCards}
        </span>
        <div className="w-fit mx-auto flex items-center gap-1 bg-[#E7EEEE] px-2 py-1 rounded-lg border border-[#C0D8D8]">
          <span>
            <TimerIcon className="size-4 text-[#5B8989]" />
          </span>
          <span className="text-sm font-semibold text-[#2F4F4F]">00:45</span>
        </div>
        <div
          className={cn(
            "absolute -bottom-[2px] left-0 h-[4px] rounded-full bg-[#E98451] transition-all duration-300"
          )}
          style={{
            width: `${progressBar}%`,
          }}
        ></div>
      </div>
      <CardContent className="p-6 w-full">
        <div className="text-xl font-bold mb-6 text-center text-[#446C6C]">
          {data.question}
        </div>
        <DropZone
          onDrop={handleDrop}
          isCorrect={isCorrect}
          droppedAnswer={droppedAnswer}
          hasAnswered={hasAnswered}
        />
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
          {data.options && data.options.length > 0 ? (
            data.options.map((option: any) => (
              <DraggableAnswer
                key={option.id}
                id={option.id}
                text={option.text}
                isCorrect={
                  showCorrectAnswer && option.text === data.correctAnswer
                }
                disabled={hasAnswered}
              />
            ))
          ) : (
            <p>No options available</p>
          )}
        </div>
        <div
          className={cn(
            "flex justify-between items-center mt-6",
            currentCard === 1 && "justify-center"
          )}
        >
          <Button
            variant="ghost"
            onClick={onPrevCard}
            className={cn(
              "text-[#E98451] cursor-pointer",
              currentCard === 1 && "hidden"
            )}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={onNextCard}
            disabled={!droppedAnswer}
            className="bg-[#E98451] disabled:bg-[#C3B8AC] text-white cursor-pointer"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
