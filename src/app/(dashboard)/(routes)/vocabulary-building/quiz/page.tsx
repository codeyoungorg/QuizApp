import { Suspense } from "react";
import QuizSkeleton from "../_components/quiz/QuizSkeleton";
import QuizPageContent from "./_inner";

export default function VocabularyQuizPage() {
  return (
    <Suspense fallback={<QuizSkeleton />}>
      <QuizPageContent />
    </Suspense>
  );
}
