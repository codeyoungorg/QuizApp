import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PracticeResult } from "./components/PracticeResult";
import { ResultNotFound } from "./components/ResultNotFound";
import { LanguageLearningFetchQuizResult } from "@/actions/language-learning";

export default async function ResultPage({
  searchParams,
  params,
}: {
  searchParams: { quiz: string };
  params: { subjectId: string };
}) {
  const userId = getCookie("userId", { cookies });
  const { subjectId: lang } = params;

  if (!searchParams.quiz) {
    redirect(`/language/${lang}/practice`);
  }

  const quizResult = await LanguageLearningFetchQuizResult(searchParams.quiz, userId);

  if (!quizResult) {
    return (
      <div className="h-full">
        <ResultNotFound lang={lang} />
      </div>
    );
  }

  return (
    <div className="h-full">
      <PracticeResult quizResult={quizResult} lang={lang} />
    </div>
  );
}
