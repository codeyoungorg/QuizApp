import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  TimerIcon,
  Volume2,
} from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import booksIcon from "@/assets/Images/Books.png";
import { FlashcardData } from "../../learn/_types";
import { cn } from "@/lib/utils";

export type LevelBadge = {
  label: string;
  emoji: string;
  bg: string;
  text: string;
};

type QuizCardProps = {
  data: FlashcardData & { id: number };
  currentCard: number;
  totalCards: number;
  onNextCard: () => void;
  onPrevCard: () => void;
  onAnswer: (answer: string, isCorrect: boolean) => void;
  resetQuiz: () => void;
  isAnswered: boolean;
  previousAnswer: string | undefined;
  variant?: "default" | "vocab";
  levelBadge?: LevelBadge;
};

export const SelectCard: React.FC<QuizCardProps> = ({
  data,
  currentCard,
  totalCards,
  onNextCard,
  onPrevCard,
  onAnswer,
  resetQuiz,
  isAnswered,
  previousAnswer,
  variant = "default",
  levelBadge,
}) => {
  const isVocab = variant === "vocab";
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [timerEnded, setTimerEnded] = useState(false);

  useEffect(() => {
    if (isAnswered && previousAnswer && previousAnswer !== selectedAnswer) {
      setSelectedAnswer(previousAnswer);
      setShowCorrectAnswer(true);
    } else if (!isAnswered) {
      setSelectedAnswer(null);
      setShowCorrectAnswer(false);
    }
    setTimeLeft(45);
    setTimerEnded(false);
  }, [data.question, isAnswered, previousAnswer]);

  useEffect(() => {
    if (isVocab) return;
    if (timeLeft > 0 && !showCorrectAnswer) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      setTimerEnded(true);
    }
  }, [timeLeft, showCorrectAnswer, isVocab]);

  const handleAnswerSelect = (answer: string) => {
    if (answer !== selectedAnswer) {
      setSelectedAnswer(answer);
      if (showCorrectAnswer) {
        onAnswer(answer, answer === data.correctAnswer);
      }
    }
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
    setSelectedAnswer(null);
    setShowCorrectAnswer(false);
    setTimerEnded(false);
    resetQuiz();
  };

  if (isVocab) {
    const correctAnswer = data.correctAnswer;
    const badge = levelBadge;

    return (
      <div className="w-full max-w-2xl mx-auto px-2">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 md:gap-6 items-start mb-10">
          <div className="flex flex-col gap-2 pt-1">
            {badge && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold w-fit",
                  badge.bg,
                  badge.text
                )}
              >
                <span>{badge.emoji}</span>
                <span>{badge.label}</span>
              </span>
            )}
            <span className="text-sm text-[#1F1F1F]">
              <span className="font-bold">{currentCard}</span> of {totalCards}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1F1F1F] leading-snug">
            {data.question}
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {data.options.map((option) => {
            const isSelected = selectedAnswer === option.text;
            const isCorrectOption = option.text === correctAnswer;
            const revealCorrect = showCorrectAnswer && isCorrectOption;
            const revealWrong =
              showCorrectAnswer && isSelected && !isCorrectOption;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleAnswerSelect(option.text)}
                disabled={showCorrectAnswer || isAnswered}
                className={cn(
                  "flex items-center gap-3 w-full px-5 py-4 rounded-2xl border bg-white text-left text-base md:text-lg font-medium text-[#1F1F1F] transition-all",
                  "border-[#E5E7EB] hover:border-[#C8D6D6]",
                  isSelected && !showCorrectAnswer && "border-[#22C55E] border-2",
                  revealCorrect && "border-[#22C55E] border-2",
                  revealWrong && "border-[#E5E7EB]",
                  (showCorrectAnswer || isAnswered) && "cursor-default"
                )}
              >
                {revealCorrect || (isSelected && !showCorrectAnswer) ? (
                  <CheckCircle2 className="size-5 shrink-0 fill-[#22C55E] text-white" />
                ) : revealWrong ? (
                  <span className="inline-flex items-center justify-center size-5 shrink-0 rounded-full bg-[#F59E0B] text-white text-xs font-bold leading-none">
                    !
                  </span>
                ) : (
                  <Circle className="size-5 text-[#D1D5DB] shrink-0" />
                )}
                <span>{option.text}</span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-center mt-8">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3F4F6] text-sm text-[#1F1F1F]">
            <Image src={booksIcon} alt="" width={16} height={16} />
            <span>
              <span className="font-bold">{currentCard}</span> of {totalCards}
            </span>
          </span>
        </div>

        <div className="mt-6">
          {showCorrectAnswer ? (
            <Button
              type="button"
              onClick={() => {
                setShowCorrectAnswer(false);
                onNextCard();
              }}
              className="w-full justify-between bg-[#F5B400] hover:bg-[#E0A500] rounded-xl py-7"
            >
              <span className="text-base font-bold leading-6 text-[#1F1F1F]">
                Next
              </span>
              <span className="inline-flex items-center justify-center size-6 rounded-full bg-[#1F1F1F]/20">
                <ArrowRight className="size-4 text-[#1F1F1F]" />
              </span>
            </Button>
          ) : (
            <Button
              type="button"
              disabled={selectedAnswer === null}
              onClick={() => {
                setShowCorrectAnswer(true);
                if (selectedAnswer) {
                  onAnswer(
                    selectedAnswer,
                    selectedAnswer === data.correctAnswer
                  );
                }
              }}
              className="w-full justify-between bg-[#F5B400] hover:bg-[#E0A500] disabled:bg-[#F5B400]/60 rounded-xl py-7"
            >
              <span className="text-base font-bold leading-6 text-[#1F1F1F]">
                Check answer
              </span>
              <span className="inline-flex items-center justify-center size-6 rounded-full bg-[#1F1F1F]/20">
                <ArrowRight className="size-4 text-[#1F1F1F]" />
              </span>
            </Button>
          )}

          {showCorrectAnswer && data.explanation && (
            <div className="mt-4 rounded-xl bg-[#F3F4F6] p-4">
              <p className="font-bold text-[#1F1F1F] mb-1">Here's why!</p>
              <p className="text-sm text-[#5B6B6B]">{data.explanation}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

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
                selectedAnswer === option.text &&
                  !showCorrectAnswer &&
                  "bg-[#C9D2DA]",
                showCorrectAnswer &&
                  selectedAnswer === option.text &&
                  selectedAnswer !== data.correctAnswer &&
                  "bg-[#FFE1D6] border-[#FFB35D]",
                showCorrectAnswer &&
                  option.text === data.correctAnswer &&
                  "bg-[#D4EDE1] border-[#4EB487]"
              )}
              onClick={() => handleAnswerSelect(option.text)}
              disabled={(showCorrectAnswer || isAnswered) && !timerEnded}
            >
              {option.text}
            </Button>
          ))}
        </div>
        <div className="flex justify-between items-center mt-6">
          <Button
            variant="ghost"
            onClick={onPrevCard}
            className={cn(
              "text-[#E98451] cursor-pointer",
              currentCard === 1 && "invisible"
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
          ) : isAnswered ? (
            <Button
              variant="outline"
              onClick={onNextCard}
              className="bg-[#E98451] text-white cursor-pointer hover:bg-[#E98451]/80 hover:text-white active:bg-[#E98451]/80 focus:bg-[#E98451]"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : showCorrectAnswer ? (
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
              onClick={() => {
                setShowCorrectAnswer(true);
                if (selectedAnswer) {
                  onAnswer(
                    selectedAnswer,
                    selectedAnswer === data.correctAnswer
                  );
                }
              }}
              disabled={selectedAnswer === null}
              className="disabled:bg-[#C3B8AC] bg-[#E98451] text-white cursor-pointer hover:bg-[#E98451]/80 hover:text-white active:bg-[#E98451]/80 focus:bg-[#E98451]"
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
