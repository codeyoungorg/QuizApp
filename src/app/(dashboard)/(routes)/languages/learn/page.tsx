// 'use client'
import { redirect } from "next/navigation";
import { getLanguageTopics, getTopicContent } from "@/actions/language.actions";
import LearnBox from "./_components/learn-box";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { Suspense } from "react";

export default async function LearnPage({
  searchParams,
}: {
  searchParams: { lang: string; topic: number; level: number; cards: string; topicName: string};
}) {
  if (
    !searchParams.lang ||
    !searchParams.topic ||
    !searchParams.level ||
    !searchParams.cards
  ) {
    redirect("/languages");
  }
  try {
    const userId = getCookie("userId", { cookies });
    if (!userId) {
      redirect("/login");
    }

    const [from, to] = searchParams.cards
      .split("-")
      .map((num) => parseInt(num));
    if (isNaN(from) || isNaN(to)) {
      redirect("/languages");
    }

    const content = await getTopicContent({
      topic: searchParams.topic,
      language: searchParams.lang,
      from,
      to,
    });

    if (!content) {
      redirect("/languages");
    }

    return (
      <div className="container mx-auto px-4">
        <LearnBox
          content={content}
          topicName={searchParams.topicName}
          levelId={searchParams.level}
          topicId={searchParams.topic}
          lang={searchParams.lang}
          userId={userId}
          cardState={searchParams.cards}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading learn page:", error);
    redirect("/languages");
  }
}
