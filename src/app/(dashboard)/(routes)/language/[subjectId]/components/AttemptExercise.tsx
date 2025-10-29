"use client";

import { ProgressSteps } from "@/components/newFlow/ui/progressStepper";
import { ExerciseData } from "../types";
import { Button } from "@/components/newFlow/ui/buttons";
import { X } from "lucide-react";
import ExitModel from "../../../practice/_components/ExitModel";
import { useState, useEffect } from "react";
import { TimerIcon } from "lucide-react";
import { DisplayQuestion } from "./DisplayQuestion";
import { LearnQuestion } from "./LearnQuestion";
import { CustomDragLayer } from "./CustomDragLayer";
import { LearnResult } from "./LearnResult";
import { useQuery } from "@tanstack/react-query";
import useQuizStore from "@/store/quiz-store";
import {
  saveLanguageLearningPractice,
  updateLanguageLearningPractice,
  LanguageLearningGetUserCardState,
  saveLanguageLearningData,
} from "@/actions/language-learning";
import { captureEvent } from "@/lib/quiz/apiClient";
import ExerciseNotFound from "./ExerciseNotFound";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { ErrorToast, SuccessToast } from "@/utils/getToast";
import { HandleQuite } from "@/utils/HandleQuite";
import { stopLoader } from "@/utils/loaderUtils";
import { handleEvent } from "@/utils/handleEvent";

type QuizSubmission = {
  questionId: number;
  answer: string;
  isCorrect: boolean;
};

type ExerciseMode = "learn" | "practice";

export const AttemptExercise = ({
  content,
  exerciseInfo,
  mode = "practice",
}: {
  content: ExerciseData;
  exerciseInfo: {
    userId: string;
    topicId: number;
    lang: string;
    from: number;
    to: number;
  };
  mode?: ExerciseMode;
}) => {
  const { userId, topicId, lang, from, to } = exerciseInfo;

  if (!content || content.length === 0) {
    return <ExerciseNotFound onRefresh={() => window.location.reload()} />;
  }

  const [currentQueIndex, setCurrentQueIndex] = useState(0);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [timerEnded, setTimerEnded] = useState(false);

  const [quizSubmissions, setQuizSubmissions] = useState<QuizSubmission[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(
    new Set()
  );
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const router = useRouter();
  
  const [dndBackend, setDndBackend] = useState<any>(() => HTML5Backend);
  const [backendOptions, setBackendOptions] = useState<any>({});


  useEffect(() => {
    stopLoader();
  }, []);

  useEffect(() => {
    if (mode === "learn") {
      const isTouchDevice =
        typeof window !== "undefined" &&
        ("ontouchstart" in window || navigator.maxTouchPoints > 0);
      
      if (isTouchDevice) {
        setDndBackend(() => TouchBackend);
        setBackendOptions({
          ignoreContextMenu: true,
        });
      } else {
        setDndBackend(() => HTML5Backend);
        setBackendOptions({});
      }
    }
  }, [mode]);

  const cardState = `${from}-${to}`;

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
    queryKey: ["user_card_state", mode],
    queryFn: () =>
      mode === "practice"
        ? LanguageLearningGetUserCardState({
            userId,
            topicId,
            levelId: content[0].level_id,
            state,
            lang,
          })
        : null,
    enabled: mode === "practice",
  });

  const setCurrentQuizScore = useQuizStore(
    (state) => state.setCurrentQuizScore
  );

  const handleNextCard = () => {
    if (currentQueIndex < content.length - 1) {
      setCurrentQueIndex(currentQueIndex + 1);
      setTimeLeft(45); 
      setTimerEnded(false);
    } else {
      completeSet();
    }
  };

  const handlePrevCard = () => {
    if (currentQueIndex > 0) {
      setCurrentQueIndex(currentQueIndex - 1);
      setTimeLeft(45); 
      setTimerEnded(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQueIndex(0);
    setCorrectAnswers(0);
    setQuizSubmissions([]);
    setAnsweredQuestions(new Set());
    setIsCompleted(false);
    setIsLoading(false);
    setTimeLeft(45); 
    setTimerEnded(false);
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

      if (mode === "learn") {
        const data = await saveLanguageLearningData({
          userId,
          total: content.length,
          correct: correctAnswers,
          submission: quizSubmissions,
          language: lang,
          topicId,
          levelId: content[0].level_id,
        });

        if (data) {
          setIsLoading(false);
          setIsCompleted(true);
          SuccessToast("Progress saved successfully!");
          handleEvent("lang_learning_completed", "When language learning quiz is completed");
        } else {
          setIsLoading(false);
          setIsCompleted(false);
          setSaveError("Failed to save your progress. Please try again.");
          ErrorToast("Failed to save your progress. Please try again.");
          handleEvent("lang_learning_failed_submit", "When language learning quiz fails to submit");
        }
      } else {
        if (prevQuiz?.id) {
          const data = await updateLanguageLearningPractice({
            userId,
            total: content.length,
            correct: correctAnswers,
            submission: quizSubmissions,
            language: lang,
            topicId,
            levelId: content[0].level_id,
            quizId: prevQuiz?.id,
            state: state,
          });

          if (data) {
            SuccessToast("Quiz submitted successfully!");
            router.replace(`/language/${lang}/result?quiz=${data.id}`);
            handleEvent("lang_practice_complete", "When language learning practice is completed");
          } else {
            setIsLoading(false);
            setIsCompleted(false);
            handleEvent("lang_practice_failed_submit", "When language learning practice fails to submit");
            setSaveError("Failed to update quiz results. Please try again.");
            ErrorToast("Failed to update quiz results. Please try again.");
          }
        } else {
          const data = await saveLanguageLearningPractice({
            userId,
            total: content.length,
            correct: correctAnswers,
            submission: quizSubmissions,
            language: lang,
            topicId,
            levelId: content[0].level_id,
            state,
          });

          if (data) {
            try {
              await captureEvent({
                data: {
                  type: "language-practice",
                  subject: lang,
                  quizId: parseInt(data.id),
                  topicId: parseInt(topicId as unknown as string),
                  difficulty: quizSubmissions.map((row) => content[0].level_id),
                  questionId: quizSubmissions.map(
                    (row) => parseInt(row.questionId as unknown as string)
                  ),
                },
              });
            } catch (eventError) {
              console.error("Failed to capture event:", eventError);
            }
            SuccessToast("Quiz submitted successfully!");
            router.replace(`/language/${lang}/result?quiz=${data.id}`);
            handleEvent("lang_practice_complete", "When language learning practice is completed");
          } else {
            setIsLoading(false);
            setIsCompleted(false);
            handleEvent("lang_practice_failed_submit", "When language learning practice fails to submit");
            setSaveError("Failed to save quiz results. Please try again.");
            ErrorToast("Failed to save quiz results. Please try again.");
          }
        }
      }
    } catch (error) {
      console.error("Error saving exercise data:", error);
      setIsLoading(false);
      setIsCompleted(false);
      setSaveError("An unexpected error occurred. Please try again.");
      ErrorToast("An unexpected error occurred. Please try again.");
    } finally {
      stopLoader();
    }
  };

  const handleAnswer = async (answer: string, isCorrect: boolean) => {
    const submission: QuizSubmission = {
      questionId: content[currentQueIndex].id,
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

    setAnsweredQuestions((prev) => new Set(prev).add(currentQueIndex));

    setCorrectAnswers((prev) => {
      const previousSubmission = quizSubmissions.find(
        (sub) => sub.questionId === content[currentQueIndex].id
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const isCurrentQuestionAnswered = answeredQuestions.has(currentQueIndex);
    
    if (timeLeft > 0 && !isCurrentQuestionAnswered) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      setTimerEnded(true);
    }
  }, [timeLeft, answeredQuestions, currentQueIndex]);

  const handleExit = () => {
    HandleQuite();
    setIsExitModalOpen(false);
  };

  if (isLoading && isCompleted) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-app-primary" />
          <p className="text-lg font-semibold text-app-text-black">
            Saving your results...
          </p>
        </div>
      </div>
    );
  }

  if (saveError && !isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-6 max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-app-text-black mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-base text-app-text-grey">
              {saveError}
            </p>
          </div>
          <div className="flex gap-3 w-full">
            <Button
              variant="secondary"
              onClick={() => router.push(`/language/${lang}?topic=${topicId}&from=${from}&to=${to}`)}
              className="flex-1"
            >
              Go Back
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setSaveError(null);
                completeSet();
              }}
              className="flex-1"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted && mode === "learn") {
    const handleTakeQuiz = () => {
      router.push(`/language/${lang}/practice?topic=${topicId}&from=${from}&to=${to}`);
    };

    return (
      <LearnResult
        correct={correctAnswers}
        total={content.length}
        onTakeQuiz={handleTakeQuiz}
      />
    );
  }

  const renderQuestion = () => {
    if (mode === "learn") {
      return (
        <LearnQuestion
          key={currentQueIndex}
          data={content[currentQueIndex]}
          handleAnswer={handleAnswer}
          handleNextCard={handleNextCard}
          handlePrevCard={handlePrevCard}
          currentQueIndex={currentQueIndex}
          timerEnded={timerEnded}
          resetQuiz={resetQuiz}
          previousAnswer={
            quizSubmissions.find(
              (sub) => sub.questionId === content[currentQueIndex].id
            )?.answer
          }
        />
      );
    } else {
      return (
        <DisplayQuestion
          key={currentQueIndex}
          data={content[currentQueIndex]}
          handleAnswer={handleAnswer}
          quizLength={content.length}
          handleNextCard={handleNextCard}
          handlePrevCard={handlePrevCard}
          currentQueIndex={currentQueIndex}
          timerEnded={timerEnded}
          resetQuiz={resetQuiz}
          isAnswered={answeredQuestions.has(currentQueIndex)}
          previousAnswer={
            quizSubmissions.find(
              (sub) => sub.questionId === content[currentQueIndex].id
            )?.answer
          }
        />
      );
    }
  };

  const content_wrapper = (
    <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <ProgressSteps
          current={currentQueIndex + 1}
          total={content.length}
          className="w-[100px] md:w-[150px]"
        />
        <div className="">
          <div className="w-fit mx-auto flex items-center gap-1 bg-white text-app-secondary px-3 py-2 rounded-[32px] border-2 border-app-secondary">
            <span>
              <TimerIcon className="size-4 text-app-secondary" />
            </span>
            <span className="text-sm font-semibold text-app-secondary">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        <Button variant="secondary" onClick={() => setIsExitModalOpen(true)}>
          Exit <X />
        </Button>
        <ExitModel
          isOpen={isExitModalOpen}
          onClose={() => setIsExitModalOpen(false)}
          onConfirm={handleExit}
        />
      </div>

      {renderQuestion()}
    </div>
  );

  if (mode === "learn") {
    return (
      <DndProvider backend={dndBackend} options={backendOptions}>
        <CustomDragLayer />
        {content_wrapper}
      </DndProvider>
    );
  }

  return content_wrapper;
};
