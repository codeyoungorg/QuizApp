"use client";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { AnimatePresence, motion } from "framer-motion";
import { Flashcard } from "./flashcard";
import { useEffect, useState } from "react";
import { DB } from "../_types";
import { useRouter } from "next/navigation";

const DndProviderWithBackend = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [Backend, setBackend] = useState(() => HTML5Backend);

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setBackend(() => (isTouchDevice ? TouchBackend : HTML5Backend));
  }, []);

  return <DndProvider backend={Backend}>{children}</DndProvider>;
};

type FlashcardPageProps = {
  content: DB[];
  levelId: number;
  topicId: number;
  lang: string;
};
export default function LearnBox({
  content,
  levelId,
  topicId,
  lang,
}: FlashcardPageProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [flashcards, setFlashcards] = useState<DB[]>(content);
  const router = useRouter();

  useEffect(() => {
    setFlashcards(content);
  }, []);

  const handleNextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      completeSet();
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    }
  };

  const completeSet = () => {
    // const percentageCorrect = (correctAnswers / flashcards.length) * 100;
    // let progressIncrease = 0;

    // if (percentageCorrect >= 90) {
    //   progressIncrease = 20;
    // } else if (percentageCorrect >= 70) {
    //   progressIncrease = 15;
    // } else if (percentageCorrect >= 50) {
    //   progressIncrease = 10;
    // } else {
    //   progressIncrease = 5;
    // }
    localStorage.setItem(
      "result",
      JSON.stringify({ total: flashcards.length, correct: correctAnswers })
    );

    router.push("/languages/result?lang=" + lang);
  };

  return (
    <div className="">
      <DndProviderWithBackend>
        <div className="py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {flashcards && flashcards[currentCardIndex] ? (
              <motion.div
                key={"currentCardIndex"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-lg"
              >
                <Flashcard
                  key={`flashcard-${currentCardIndex}`}
                  data={{
                    question: flashcards[currentCardIndex].question,
                    options: flashcards[currentCardIndex].options.map(
                      (option, index) => ({
                        id: index.toString(),
                        text: option.text,
                      })
                    ),
                    correctAnswer:
                      flashcards[currentCardIndex].options.find(
                        (option) => option.correct === "true"
                      )?.text || "",
                    explanation: flashcards[currentCardIndex].explanation,
                  }}
                  currentCard={currentCardIndex + 1}
                  totalCards={flashcards.length}
                  onNextCard={handleNextCard}
                  onPrevCard={handlePrevCard}
                  onAnswer={handleAnswer}
                />
              </motion.div>
            ) : (
              <p>No flashcards available</p>
            )}
          </AnimatePresence>
        </div>
      </DndProviderWithBackend>
    </div>
  );
}
