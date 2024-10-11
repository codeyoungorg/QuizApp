import { getTopicContent } from "@/actions/language.actions";
import LearnBox from "./_components/learn-box";
import MultiSelectBox from "./_components/multi-select/box";
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
      <LearnBox
        content={content!}
        levelId={searchParams.level}
        topicId={searchParams.topic}
        lang={searchParams.lang}
        userId={userId as string}
      />
      {/* Sentence Creation Card */}
      {/* <MultiSelectBox content={content} levelId={1} topicId={1} /> */}
    </div>
  );
}
