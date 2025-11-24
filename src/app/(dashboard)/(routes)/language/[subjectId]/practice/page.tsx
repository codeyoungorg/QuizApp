import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { AttemptExercise } from "../components/AttemptExercise";
import { ExerciseData } from "../types";
import { LanguageLearningGetTopicContent } from "@/actions/language-learning";

export default async function PracticePage({
  searchParams,
  params,
}: {
  searchParams: { topic: string; from: string; to: string };
  params: { subjectId: string };
}) {
    const userId = getCookie("userId", { cookies });
  const { topic, from, to } = searchParams;
  const { subjectId: lang } = params;

  const topicContent = await LanguageLearningGetTopicContent({
    topic: Number(topic),
    language: lang,
    from: Number(from),
    to: Number(to),
  }) as ExerciseData;

  const exerciseInfo = {
    userId: userId || "",
    topicId: Number(topic),
    lang,    
    from: Number(from),
    to: Number(to),
  };

  return (
    <div className="h-full">
      <AttemptExercise content={topicContent} exerciseInfo={exerciseInfo} mode="practice" />
    </div>
  );
}
