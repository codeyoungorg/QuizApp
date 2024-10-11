"use client";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { DB } from "../../learn/_types";
import { SelectCard } from "./select-card";
import { useRouter } from "next/navigation";
import { saveQuizData } from "@/actions/language.actions";
import { Loader2 } from "lucide-react"; // Import the loader icon

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

type QuizSubmission = {
  questionId: number;
  answer: string;
  isCorrect: boolean;
};

type FlashcardPageProps = {
  content: DB[];
  levelId: number;
  topicId: number;
  lang: string;
  userId: string;
};

export default function QuizBox({
  content,
  levelId,
  topicId,
  lang,
  userId,
}: FlashcardPageProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizSubmissions, setQuizSubmissions] = useState<QuizSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const router = useRouter();

  const handleNextCard = () => {
    if (currentCardIndex < content.length - 1) {
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

  const handleAnswer = (answer: string, isCorrect: boolean) => {
    const submission: QuizSubmission = {
      questionId: content[currentCardIndex].id, // Assuming each question has an id
      answer,
      isCorrect,
    };
    setQuizSubmissions([...quizSubmissions, submission]);
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    }
  };

  const completeSet = async () => {
    setIsLoading(true); // Set loading to true when saving starts
    try {
      const data = await saveQuizData({
        userId,
        total: content.length,
        correct: correctAnswers,
        submission: quizSubmissions,
        language: lang,
        topicId,
        levelId,
      });
      if (data) {
        router.push("/languages/result?lang=" + lang + "&quiz=" + data.id);
      }
    } catch (error) {
      console.error("Error saving quiz data:", error);
      // Optionally, show an error message to the user
    } finally {
      setIsLoading(false); // Set loading to false when saving is complete (success or failure)
    }
  };

  return (
    <div className="">
      <DndProviderWithBackend>
        <div className="py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center"
              >
                <Loader2 className="h-8 w-8 animate-spin text-[#E98451]" />
                <p className="mt-2 text-[#5B8989]">
                  Saving your quiz results...
                </p>
              </motion.div>
            ) : content ? (
              <motion.div
                key={currentCardIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-lg"
              >
                <SelectCard
                  data={{
                    id: content[currentCardIndex].id, // Add this line
                    question: content[currentCardIndex].question,
                    options: content[currentCardIndex].options.map(
                      (option, index) => ({
                        id: index.toString(),
                        text: option.text,
                      })
                    ),
                    correctAnswer:
                      content[currentCardIndex].options.find(
                        (option) => option.correct === "true"
                      )?.text || "",
                    explanation: content[currentCardIndex].explanation,
                  }}
                  currentCard={currentCardIndex + 1}
                  totalCards={content.length}
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
