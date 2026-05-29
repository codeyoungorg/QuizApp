"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ExitModel from "../../../practice/_components/ExitModel";
import {
  serveVocabularyQuiz,
  submitVocabularyAnswer,
} from "@/actions/vocabulary";
import { getThemeByApiId } from "../../_data/levels";
import type {
  VocabularyApiLevelId,
  VocabularySessionSummary,
} from "../../_types";
import { ErrorToast } from "@/utils/getToast";
import QuizHeader from "./QuizHeader";
import QuizQuestion from "./QuizQuestion";
import QuizSkeleton from "./QuizSkeleton";

type QuizContainerProps = {
  userId: string;
  apiLevelId: VocabularyApiLevelId;
  levelSlug: string;
};

export default function QuizContainer({
  userId,
  apiLevelId,
  levelSlug,
}: QuizContainerProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const theme = getThemeByApiId(apiLevelId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isExitOpen, setIsExitOpen] = useState(false);
  const summaryRef = useRef<VocabularySessionSummary | null>(null);
  const queryKey = ["vocabulary-serve", userId, apiLevelId];

  // Always clear cached serve data on unmount so re-entry fetches fresh
  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    data: serveData,
    isLoading: isServing,
    isError: serveError,
  } = useQuery({
    queryKey,
    queryFn: () => serveVocabularyQuiz({ userId, levelId: apiLevelId }),
    enabled: !!userId,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const totalQuestions = useMemo(() => {
    if (!serveData) return 0;
    return (
      serveData.previousAnswers.length + serveData.remainingQuestions.length
    );
  }, [serveData]);

  const goHome = () => {
    router.push("/vocabulary-building");
  };

  if (!userId) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-[#5B8989]">Please log in to continue.</p>
      </div>
    );
  }

  if (isServing) {
    return <QuizSkeleton />;
  }

  if (serveError || !serveData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-sm text-[#5B8989]">
          Could not load this session. Please try again.
        </p>
        <button
          onClick={() => router.refresh()}
          className="text-sm text-[#E98451] underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (
    serveData.remainingQuestions.length === 0 &&
    serveData.previousAnswers.length === 0
  ) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 px-6 text-center">
        <p className="text-base font-bold text-[#1F1F1F]">
          🎉 All words in this level have been learned!
        </p>
        <button
          onClick={goHome}
          className="mt-2 text-sm text-[#E98451] underline"
        >
          Pick another level
        </button>
      </div>
    );
  }

  const question = serveData.remainingQuestions[currentIndex];
  const sessionId = serveData.sessionId;
  const previousAnsweredCount = serveData.previousAnswers.length;
  const displayedNumber = previousAnsweredCount + currentIndex + 1;
  const isLast = displayedNumber === totalQuestions;

  const handleCheck = async (selectedIndex: number) => {
    if (!sessionId || !question) return null;
    setIsSubmitting(true);
    try {
      const res = await submitVocabularyAnswer({
        sessionId,
        userId,
        wordId: question.id,
        selectedOption: selectedIndex,
      });
      if (!res) {
        ErrorToast("Could not submit answer. Please try again.");
        return null;
      }
      if (res.summary) summaryRef.current = res.summary;
      return {
        isCorrect: res.isCorrect,
        correctOption: res.correctOption,
        explanation: res.explanation,
        sessionComplete: res.sessionComplete,
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  const redirectToSuccess = () => {
    setIsNavigating(true);
    const params = new URLSearchParams({ level: levelSlug });
    const last = summaryRef.current;
    if (last) {
      params.set("wordsLearned", String(last.wordsLearned));
      params.set("totalLearned", String(last.totalLearned));
      params.set("totalForLevel", String(last.totalForLevel));
      params.set("levelName", last.levelName);
    }
    router.replace(`/vocabulary-building/success?${params.toString()}`);
  };

  const handleNext = () => {
    if (currentIndex + 1 < serveData.remainingQuestions.length) {
      setCurrentIndex(currentIndex + 1);
      return;
    }
    redirectToSuccess();
  };

  return (
    <section className="w-full max-w-[810px] mx-auto px-4 sm:px-6 py-5">
      <QuizHeader
        levelName={serveData.levelName}
        theme={theme}
        current={displayedNumber}
        total={totalQuestions}
        onQuit={() => setIsExitOpen(true)}
      />

      {question && (
        <QuizQuestion
          question={question}
          isSubmitting={isSubmitting}
          isNavigating={isNavigating}
          onCheck={handleCheck}
          onNext={handleNext}
          isLast={isLast}
        />
      )}

      <ExitModel
        isOpen={isExitOpen}
        onClose={() => setIsExitOpen(false)}
        onConfirm={goHome}
      />
    </section>
  );
}
