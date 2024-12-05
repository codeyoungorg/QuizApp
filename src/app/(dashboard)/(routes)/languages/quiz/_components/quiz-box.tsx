"use client";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { LanguageDB } from "../../learn/_types";
import { SelectCard } from "./select-card";
import { useRouter } from "next/navigation";
import {
  getUserCardState,
  saveQuizData,
  updateQuizData,
} from "@/actions/language.actions";
import { Loader2 } from "lucide-react"; // Import the loader icon
import { useQuery } from "@tanstack/react-query";
import useQuizStore from "@/store/quiz-store";
import { saveStreak } from "@/lib/quiz/apiClient";

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
  content: LanguageDB[];
  levelId: number;
  topicId: number;
  lang: string;
  userId: string;
  cardState: string;
};

// TODO: Uncomment <QuickQuiz /> in HomePage.tsx to use this component

export default function QuizBox({
  content,
  levelId,
  topicId,
  lang,
  userId,
  cardState,
}: FlashcardPageProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizSubmissions, setQuizSubmissions] = useState<QuizSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const state =
    cardState === "1-5"
      ? 1
      : cardState === "6-10"
      ? 2
      : cardState === "11-15"
      ? 3
      : cardState === "16-20"
      ? 4
      : 0;
  const { data: prevQuiz } = useQuery({
    queryKey: ["user_card_state"],
    queryFn: async () => {
      return await getUserCardState({
        userId: userId as string,
        topicId,
        levelId,
        state,
        lang,
      });
    },
  });

  const router = useRouter();

  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(
    new Set()
  );

  const setCurrentQuizScore = useQuizStore(
    (state) => state.setCurrentQuizScore
  );

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
      questionId: content[currentCardIndex].id,
      answer,
      isCorrect,
    };

    setQuizSubmissions((prevSubmissions) => {
      const existingSubmissionIndex = prevSubmissions.findIndex(
        (sub) => sub.questionId === submission.questionId
      );

      if (existingSubmissionIndex !== -1) {
        const newSubmissions = [...prevSubmissions];
        newSubmissions[existingSubmissionIndex] = submission;
        return newSubmissions;
      } else {
        return [...prevSubmissions, submission];
      }
    });

    setAnsweredQuestions((prev) => new Set(prev).add(currentCardIndex));

    setCorrectAnswers((prev) => {
      const previousSubmission = quizSubmissions.find(
        (sub) => sub.questionId === content[currentCardIndex].id
      );

      if (previousSubmission) {
        if (previousSubmission.isCorrect && !isCorrect) {
          return prev - 1;
        } else if (!previousSubmission.isCorrect && isCorrect) {
          return prev + 1;
        }
        return prev;
      } else {
        return isCorrect ? prev + 1 : prev;
      }
    });
  };

  const resetQuiz = () => {
    setCurrentCardIndex(0);
    setCorrectAnswers(0);
    setQuizSubmissions([]);
    setAnsweredQuestions(new Set());
    setIsCompleted(false);
    setIsLoading(false);
  };

  const completeSet = async () => {
    setIsLoading(true);
    setIsCompleted(true);

    try {
      const currentScore = {
        correct: correctAnswers,
        total: content.length,
      };
      setCurrentQuizScore(currentScore);

      if (prevQuiz?.id) {
        const data = await updateQuizData({
          userId,
          total: content.length,
          correct: correctAnswers,
          submission: quizSubmissions,
          language: lang,
          topicId,
          levelId,
          quizId: prevQuiz?.id,
          state: state,
        });

        if (data) {
          // Use router.replace for smoother transition
          router.replace(`/languages/result?lang=${lang}&quiz=${data.id}`);
        }
      } else {
        const data = await saveQuizData({
          userId,
          total: content.length,
          correct: correctAnswers,
          submission: quizSubmissions,
          language: lang,
          topicId,
          levelId,
          state,
        });

        const res = await saveStreak();

        if (data) {
          router.replace(`/languages/result?lang=${lang}&quiz=${data.id}`);
        }
      }
    } catch (error) {
      console.error("Error saving quiz data:", error);
      setIsLoading(false);
      setIsCompleted(false);
    }
  };

  return (
    <div className="">
      <DndProviderWithBackend>
        <div className="py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {isLoading && isCompleted ? (
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
            ) : !isCompleted && content ? (
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
                    id: content[currentCardIndex].id,
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
                  resetQuiz={resetQuiz}
                  isAnswered={answeredQuestions.has(currentCardIndex)}
                  previousAnswer={
                    quizSubmissions.find(
                      (sub) => sub.questionId === content[currentCardIndex].id
                    )?.answer
                  }
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </DndProviderWithBackend>
    </div>
  );
}
