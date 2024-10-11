"use client";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { AnimatePresence, motion } from "framer-motion";
import { Flashcard } from "./flashcard";
import { useEffect, useState } from "react";
import { DB } from "../_types";
import { useRouter } from "next/navigation";
import { saveLearningData } from "@/actions/language.actions";

type LearningSubmission = {
  questionId: number;
  answer: string;
  isCorrect: boolean;
};

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
  userId: string; // Add userId prop
};

export default function LearnBox({
  content,
  levelId,
  topicId,
  lang,
  userId,
}: FlashcardPageProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [flashcards, setFlashcards] = useState<DB[]>(content);
  const [learningSubmissions, setLearningSubmissions] = useState<
    LearningSubmission[]
  >([]);
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
    // Add submission to learningSubmissions
    setLearningSubmissions([
      ...learningSubmissions,
      {
        questionId: flashcards[currentCardIndex].id,
        answer:
          flashcards[currentCardIndex].options.find(
            (option) => option.correct === "true"
          )?.text || "",
        isCorrect,
      },
    ]);
  };

  const completeSet = async () => {
    try {
      const data = await saveLearningData({
        userId,
        total: flashcards.length,
        correct: correctAnswers,
        submission: learningSubmissions,
        language: lang,
        topicId,
        levelId,
      });
      if (data) {
        router.push("/languages?lang=" + lang);
      }
    } catch (error) {
      console.error("Error saving learning data:", error);
    }
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
