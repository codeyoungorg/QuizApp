"use client";

import { useSearchParams } from "next/navigation";
import { getCookie } from "cookies-next";
import { getThemeBySlug } from "../_data/levels";
import QuizContainer from "../_components/quiz/QuizContainer";

export default function QuizPageContent() {
  const searchParams = useSearchParams();
  const levelParam = searchParams.get("level") ?? "beginner";
  const theme = getThemeBySlug(levelParam);
  const userId = (getCookie("userId") as string) || "";

  return (
    <QuizContainer
      userId={userId}
      apiLevelId={theme.apiLevelId}
      levelSlug={theme.slug}
    />
  );
}
