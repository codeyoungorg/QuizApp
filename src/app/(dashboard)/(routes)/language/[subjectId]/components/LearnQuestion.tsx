import { ExerciseQuestion } from "../types";
import { Button } from "@/components/newFlow/ui/buttons";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import classNames from "clsx";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DropZone } from "./DropZone";
import { DraggableAnswer } from "./DraggableAnswer";

type AnswerOption = {
  id: string;
  text: string;
};

type InteractionMode = 'drag' | 'click';

export const LearnQuestion = ({
  data,
  handleAnswer,
  handleNextCard,
  handlePrevCard,
  currentQueIndex,
  timerEnded,
  resetQuiz,
  previousAnswer,
  interactionMode = 'drag',
}: {
  data: ExerciseQuestion;
  handleAnswer: (answer: string, isCorrect: boolean) => void;
  handleNextCard: () => void;
  handlePrevCard: () => void;
  currentQueIndex: number;
  timerEnded: boolean;
  resetQuiz: () => void;
  previousAnswer?: string;
  interactionMode?: InteractionMode;
}) => {
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [droppedAnswer, setDroppedAnswer] = useState<string | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const correctAnswer = data?.options?.find((opt) => opt.correct === "true")?.text || "";

  useEffect(() => {
    if (previousAnswer && previousAnswer !== droppedAnswer) {
      setDroppedAnswer(previousAnswer);
      const wasCorrect = previousAnswer === correctAnswer;
      setIsCorrect(wasCorrect);
      setShowCorrectAnswer(true);
    } else if (!previousAnswer) {
      setIsCorrect(null);
      setDroppedAnswer(null);
      setShowCorrectAnswer(false);
    }
  }, [currentQueIndex, previousAnswer, correctAnswer, droppedAnswer]);

  const handleDrop = (item: AnswerOption) => {
    if (item.text !== droppedAnswer && !timerEnded && !isCorrect) {
      const correct = item.text === correctAnswer;
      setDroppedAnswer(item.text);
      setIsCorrect(correct);
      
      handleAnswer(item.text, correct);

      if(correct){
        setShowCorrectAnswer(true);
      }
    }
  };

  const handleAnswerClick = (item: AnswerOption) => {
    // Same logic as handleDrop but for click mode
    handleDrop(item);
  };

  const handleNext = () => {
    handleNextCard();
  };

  const handleRetry = () => {
    setIsCorrect(null);
    setDroppedAnswer(null);
    setShowCorrectAnswer(false);
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

          <DropZone
            onDrop={handleDrop}
            isCorrect={isCorrect}
            droppedAnswer={droppedAnswer}
            interactionMode={interactionMode}
          />

          <div className="flex flex-col gap-3 mt-6 select-none">
            {data.options.map((option, index) => (
              <DraggableAnswer
                key={index}
                id={index.toString()}
                text={option.text}
                isCorrect={showCorrectAnswer && option.text === correctAnswer}
                timerEnded={timerEnded}
                questionAnswered={isCorrect === true}
                onClick={handleAnswerClick}
                interactionMode={interactionMode}
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
            disabled={timerEnded}
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
            disabled={!droppedAnswer || !isCorrect}
            onClick={handleNext}
          >
            <span>Next Question</span>
            <ArrowCircleRightIcon />
          </Button>
        )}
      </div>
    </div>
  );
};
