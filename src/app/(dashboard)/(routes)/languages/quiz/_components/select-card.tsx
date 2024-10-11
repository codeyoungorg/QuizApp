import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, TimerIcon, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FlashcardData } from "../../learn/_types";
import { cn } from "@/lib/utils";

type QuizCardProps = {
  data: FlashcardData & { id: number }; // Add id to FlashcardData
  currentCard: number;
  totalCards: number;
  onNextCard: () => void;
  onPrevCard: () => void;
  onAnswer: (answer: string, isCorrect: boolean) => void;
};

export const SelectCard: React.FC<QuizCardProps> = ({
  data,
  currentCard,
  totalCards,
  onNextCard,
  onPrevCard,
  onAnswer,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);

  useEffect(() => {
    setSelectedAnswer(null);
    setShowCorrectAnswer(false);
    setTimeLeft(45);
  }, [data.question]);

  useEffect(() => {
    if (timeLeft > 0 && !showCorrectAnswer) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft, showCorrectAnswer]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    const correct = answer === data.correctAnswer;
    onAnswer(answer, correct);
  };

  const progressBar = Math.round((currentCard / totalCards) * 100).toFixed(0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
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
        <div className="grid grid-cols-1 gap-4 mt-6">
          {data.options.map((option: any) => (
            <Button
              key={option.id}
              variant={"outline"}
              className={cn(
                "p-2 px-4 w-full disabled:opacity-100 bg-white border border-[#FDE3D9] text-[#5B8989] justify-start rounded-xl shadow-sm font-medium transition-all",
                selectedAnswer === option.text && "bg-[#C9D2DA]",
                (showCorrectAnswer &&
                  selectedAnswer === option.text &&
                  selectedAnswer !== data.correctAnswer &&
                  "bg-[#FFE1D6] border-[#FFB35D]") ||
                  (showCorrectAnswer &&
                    option.text === data.correctAnswer &&
                    "bg-[#D4EDE1] border-[#4EB487]")
              )}
              onClick={() => handleAnswerSelect(option.text)}
              disabled={selectedAnswer !== null}
            >
              {option.text}
            </Button>
          ))}
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
          {showCorrectAnswer ? (
            <Button
              variant="outline"
              onClick={() => {
                setShowCorrectAnswer(false);
                onNextCard();
              }}
              disabled={selectedAnswer === null}
              className="bg-[#E98451] disabled:bg-[#C3B8AC] text-white cursor-pointer"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => setShowCorrectAnswer(true)}
              disabled={selectedAnswer === null}
              className="bg-[#E98451] disabled:bg-[#C3B8AC] text-white cursor-pointer"
            >
              Check Answer
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
