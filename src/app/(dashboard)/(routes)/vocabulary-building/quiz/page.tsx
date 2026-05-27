"use client";

import { useSearchParams } from "next/navigation";
import { getCookie } from "cookies-next";
import QuizBox from "../../languages/quiz/_components/quiz-box";
import { DUMMY_QUESTIONS } from "../_data/dummy-questions";
import { getLevel } from "../_data/levels";

export default function VocabularyQuizPage() {
  const searchParams = useSearchParams();
  const levelParam = searchParams.get("level") ?? "beginner";
  const level = getLevel(levelParam);
  const userId = (getCookie("userId") as string) || "";

  return (
    <QuizBox
      content={DUMMY_QUESTIONS}
      levelId={1}
      topicId={9000}
      lang="vocabulary"
      userId={userId}
      cardState="1-5"
      skipPersist
      variant="vocab"
      levelBadge={{
        label: level.badgeLabel,
        emoji: level.badgeEmoji,
        bg: level.badgeBg,
        text: level.badgeText,
      }}
      successPath={(quizId) =>
        `/vocabulary-building/success?level=${level.id}&quiz=${quizId}`
      }
    />
  );
}
