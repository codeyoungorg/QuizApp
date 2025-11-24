import { ExerciseQuestion } from "../types";
import { McqOption } from "@/components/newFlow/ui/McqOption";
import { Button } from "@/components/newFlow/ui/buttons";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import classNames from "clsx";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const DisplayQuestion = ({
  data,
  handleAnswer,
  quizLength,
  handleNextCard,
  handlePrevCard,
  currentQueIndex,
  timerEnded,
  resetQuiz,
  isAnswered,
  previousAnswer,
}: {
  data: ExerciseQuestion;
  handleAnswer: (answer: string, isCorrect: boolean) => void;
  quizLength: number;
  handleNextCard: () => void;
  handlePrevCard: () => void;
  currentQueIndex: number;
  timerEnded: boolean;
  resetQuiz: () => void;
  isAnswered: boolean;
  previousAnswer?: string;
}) => {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null
  );
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    setSelectedOptionIndex(null);
    setShowAnswer(false);
  }, [currentQueIndex]);

  useEffect(() => {
    if (isAnswered && previousAnswer) {
      const answerIndex = data.options.findIndex(
        (opt) => opt.text === previousAnswer
      );
      if (answerIndex !== -1) {
        setSelectedOptionIndex(answerIndex);
      }
      setShowAnswer(true);
    }
  }, [isAnswered, previousAnswer, data.options]);

  const getOptionState = (index: number) => {
    if (showAnswer) {
      if (index === selectedOptionIndex) {
        return data.options[index].correct === "true" ? "correct" : "incorrect";
      } else {
        return data.options[index].correct === "true"
          ? "correct"
          : "unselected";
      }
    } else {
      return index === selectedOptionIndex ? "selected" : "unselected";
    }
  };

  const handleNext = () => {
    if (selectedOptionIndex !== null) {
      if (showAnswer || selectedOptionIndex === quizLength) {
        handleNextCard();
        return;
      }
      const selectedOption = data.options[selectedOptionIndex];
      handleAnswer(selectedOption.text, selectedOption.correct === "true");
      setShowAnswer(true);
    }
  };

  const handleRetry = () => {
    setSelectedOptionIndex(null);
    setShowAnswer(false);
    resetQuiz();
  };

  if (!data || !data.options || data.options.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-lg font-semibold text-app-text-black mb-2">
            No options available
          </p>
          <p className="text-base text-app-text-grey">
            This question doesn't have any answer options.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className=" flex-grow md:flex-grow-0 flex flex-col md:w-full md:max-w-[600px] mx-auto md:p-6 md:border md:border-[#E6E6E6] md:rounded-[12px] mt-6 md:mt-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={data.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="flex-grow flex flex-col"
        >
          <p className="text-[28px] font-bold text-app-text-black mb-8">
            {data.question}
          </p>
          <div className="flex flex-col gap-4">
            {data.options.map((option, index) => (
              <McqOption
                key={option.text}
                label={option.text}
                state={getOptionState(index)}
                onSelect={() => {
                  if (!showAnswer && !timerEnded) {
                    setSelectedOptionIndex(index);
                  }
                }}
                className={cn(
                  "cursor-pointer",
                  timerEnded ? "cursor-not-allowed" : ""
                )}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div
        className={classNames(
          "flex  mt-auto md:mt-10",
          currentQueIndex === 0 ? "justify-center" : "justify-between"
        )}
      >
        {currentQueIndex > 0 && (
          <Button
            variant="ghost"
            className="flex gap-2.5 w-full sm:max-w-[168px]"
            onClick={handlePrevCard}
            disabled={timerEnded || !showAnswer}
          >
            <ArrowCircleRightIcon className="ml-2 rotate-180" />
            <span>Previous</span>
          </Button>
        )}
        {timerEnded ? (
          <Button
            variant="primary"
            className={classNames(
              "flex justify-between max-w-[180px]  mt-auto",
              currentQueIndex === 0 && "w-full"
            )}
            onClick={handleRetry}
          >
            <span>Retry</span>
            <ArrowCircleRightIcon />
          </Button>
        ) : (
          <Button
            variant="primary"
            className={classNames(
              "flex justify-between w-full max-w-[180px]  mt-auto",
              currentQueIndex === 0 && "w-full"
            )}
            disabled={selectedOptionIndex === null}
            onClick={handleNext}
          >
            <span>{showAnswer ? "Next Question" : "Check Answer"}</span>
            <ArrowCircleRightIcon />
          </Button>
        )}
      </div>
    </div>
  );
};
