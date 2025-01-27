"use client";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { AnimatePresence, motion } from "framer-motion";
import { Flashcard } from "./flashcard";
import { useEffect, useState } from "react";
import { LanguageDB } from "../_types";
import { saveLearningData } from "@/actions/language.actions";
import { CompletionCard } from "./completion-card";
import saveGTMEvents from "@/lib/gtm";

type LearningSubmission = {
  questionId: number;
  answer: string;
  isCorrect: boolean;
};

type AnsweredQuestion = {
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
  topicName: string;
  content: LanguageDB[];
  levelId: number;
  topicId: number;
  lang: string;
  userId: string;
  cardState: string;
};

export default function LearnBox({
  topicName,
  content,
  levelId,
  topicId,
  lang,
  userId,
  cardState,
}: FlashcardPageProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [learningSubmissions, setLearningSubmissions] = useState<
    LearningSubmission[]
  >([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<
    AnsweredQuestion[]
  >([]);
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

  const handleAnswer = async (isCorrect: boolean, selectedAnswer: string) => {
    const currentQuestionId = content[currentCardIndex].id;

    const filteredAnswers = answeredQuestions.filter(
      (q) => q.questionId !== currentQuestionId
    );

    const newAnswer = {
      questionId: currentQuestionId,
      answer: selectedAnswer,
      isCorrect,
    };

    setAnsweredQuestions([...filteredAnswers, newAnswer]);

    const filteredSubmissions = learningSubmissions.filter(
      (q) => q.questionId !== currentQuestionId
    );
    setLearningSubmissions([...filteredSubmissions, newAnswer]);

    const previousAnswer = answeredQuestions.find(
      (q) => q.questionId === currentQuestionId
    );
    if (previousAnswer) {
      if (previousAnswer.isCorrect && !isCorrect) {
        setCorrectAnswers((prev) => prev - 1);
      } else if (!previousAnswer.isCorrect && isCorrect) {
        setCorrectAnswers((prev) => prev + 1);
      }
    } else if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    }
  };

  const resetQuiz = () => {
    setCurrentCardIndex(0);
    setCorrectAnswers(0);
    setLearningSubmissions([]);
    setAnsweredQuestions([]);
  };

  const completeSet = async () => {
    try {
      const data = await saveLearningData({
        userId,
        total: content.length,
        correct: correctAnswers,
        submission: learningSubmissions,
        language: lang,
        topicId,
        levelId,
      });
      if (data) {
        setIsCompleted(true);
      }
    } catch (error) {
      console.error("Error saving learning data:", error);
    }
  };
  useEffect(() => {
    if (isCompleted) {
      const userType = userId ? "student" : "guest";
      saveGTMEvents({
        eventAction: "learn_completed",
        label: userType,
        label1: userId || null,
        label2: lang,
        label3: topicName || null,
        label4: null,
      });
    }
  }, [isCompleted]);

  return (
    <div className="">
      <DndProviderWithBackend>
        <div className="py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {isCompleted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-lg"
              >
                <CompletionCard
                  lang={lang}
                  topicId={topicId}
                  levelId={levelId}
                  correctAnswers={correctAnswers}
                  totalCards={content.length}
                  cardState={cardState}
                />
              </motion.div>
            ) : content && content[currentCardIndex] ? (
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
                  previousAnswer={answeredQuestions.find(
                    (q) => q.questionId === content[currentCardIndex].id
                  )}
                />
              </motion.div>
            ) : (
              <p>No content available</p>
            )}
          </AnimatePresence>
        </div>
      </DndProviderWithBackend>
    </div>
  );
}
