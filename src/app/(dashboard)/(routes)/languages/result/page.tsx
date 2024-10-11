import { fetchQuizResult } from "@/actions/language.actions";
import ScoreCard from "./_components/score";
import UpcomingTopics from "./_components/upcoming-topics";

export default async function ResultPage({
  searchParams,
}: {
  searchParams: { lang: string; quiz: number; learning: number };
}) {
  const quizResult = await fetchQuizResult(searchParams.quiz);
  return (
    <div className="">
      <ScoreCard lang={searchParams.lang} quizResult={quizResult} />
      <UpcomingTopics />
    </div>
  );
}
