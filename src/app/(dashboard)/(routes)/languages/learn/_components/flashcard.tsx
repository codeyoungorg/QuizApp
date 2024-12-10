import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, TimerIcon } from "lucide-react";
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
  onAnswer: (isCorrect: boolean, selectedAnswer: string) => void;
  resetQuiz: () => void;
  previousAnswer?: {
    answer: string;
    isCorrect: boolean;
  };
};

export const Flashcard: React.FC<FlashcardProps> = ({
  data,
  currentCard,
  totalCards,
  onNextCard,
  onPrevCard,
  onAnswer,
  resetQuiz,
  previousAnswer,
}) => {
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [droppedAnswer, setDroppedAnswer] = useState<string | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [timerEnded, setTimerEnded] = useState(false);

  useEffect(() => {
    if (previousAnswer && previousAnswer.answer !== droppedAnswer) {
      setDroppedAnswer(previousAnswer.answer);
      setIsCorrect(previousAnswer.isCorrect);
      setShowCorrectAnswer(true);
    } else if (!previousAnswer) {
      setIsCorrect(null);
      setDroppedAnswer(null);
      setShowCorrectAnswer(false);
    }
    setTimeLeft(45);
    setTimerEnded(false);
  }, [data.question, currentCard, previousAnswer]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      setTimerEnded(true);
    }
  }, [timeLeft]);

  const handleDrop = (item: AnswerOption) => {
    if (item.text !== droppedAnswer) {
      const correct = item.text === data.correctAnswer;
      setDroppedAnswer(item.text);
      setIsCorrect(correct);
      setShowCorrectAnswer(true);
      onAnswer(correct, item.text);
    }
  };

  const handleNext = () => {
    onNextCard();
  };

  const progressBar = Math.round((currentCard / totalCards) * 100).toFixed(0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleRetry = () => {
    setTimeLeft(45);
    setIsCorrect(null);
    setDroppedAnswer(null);
    setShowCorrectAnswer(false);
    setTimerEnded(false);
    resetQuiz();
  };

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
          <span className="text-sm font-semibold text-[#2F4F4F]">
            {formatTime(timeLeft)}
          </span>
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
          {timerEnded ? (
            <Button
              variant="outline"
              onClick={handleRetry}
              className="bg-[#E98451] text-white cursor-pointer"
            >
              Retry
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={!droppedAnswer || !isCorrect}
              className="bg-[#E98451] disabled:bg-[#C3B8AC] disabled:opacity-100 text-white cursor-pointer hover:bg-[#E98451]/80 hover:text-white active:bg-[#E98451]/80 focus:bg-[#E98451]"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
