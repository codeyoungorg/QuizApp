import { getTopicContent } from "@/actions/language.actions";
import QuizBox from "./_components/quiz-box";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

export default async function LearnPage({
  searchParams,
}: {
  searchParams: { lang: string; topic: number; level: number };
}) {
  const userId = getCookie("userId", { cookies });
  const content = await getTopicContent({
    topic: searchParams.topic,
    language: searchParams.lang,
  });
  return (
    <div className="">
      <QuizBox
        content={content!}
        levelId={searchParams.level}
        topicId={searchParams.topic}
        lang={searchParams.lang}
        userId={userId as string}
      />
    </div>
  );
}
