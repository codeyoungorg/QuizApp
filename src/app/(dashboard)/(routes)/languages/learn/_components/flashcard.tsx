import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, TimerIcon, Volume2 } from "lucide-react";
import { DropZone } from "./dropzone";
import { DraggableAnswer } from "./draggable-answer";
import { AnswerOption, FlashcardData } from "../_types";
import { cn } from "@/lib/utils";

type FlashcardProps = {
  data: FlashcardData;
  currentCard: number;
  totalCards: number;
  onNextCard: () => void;
  onPrevCard: () => void;
  onAnswer: (isCorrect: boolean) => void;
};

export const Flashcard: React.FC<FlashcardProps> = ({
  data,
  currentCard,
  totalCards,
  onNextCard,
  onPrevCard,
  onAnswer,
}) => {
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [droppedAnswer, setDroppedAnswer] = useState<string | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  useEffect(() => {
    // Reset state when the question changes
    setIsCorrect(null);
    setDroppedAnswer(null);
    setShowCorrectAnswer(false);
  }, [data.question, currentCard]);

  const handleDrop = (item: AnswerOption) => {
    const correct = item.text === data.correctAnswer;
    setDroppedAnswer(item.text);
    setIsCorrect(correct);
    setShowCorrectAnswer(true);
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
            disabled={!droppedAnswer || !isCorrect}
            className="bg-[#E98451] disabled:bg-[#C3B8AC] disabled:opacity-100 text-white cursor-pointer"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        {/* {droppedAnswer && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="font-bold">Explanation:</p>
            <p>{data.explanation}</p>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
};
