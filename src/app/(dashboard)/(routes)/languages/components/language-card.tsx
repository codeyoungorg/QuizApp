"use client";

import { useEffect, useState } from "react";
import { LinearProgress } from "@mui/material";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import LanguageImage from "@/public/images/icons/language-card.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getLanguageTopics } from "@/actions/language.actions";
import { getCookie } from "cookies-next";
import { useQuery } from "@tanstack/react-query";
import LanguageCardSkeleton from "./language-card-skeleton";

export default function LanguageCard({
  lang,
  langId,
  totalQuestions,
}: {
  lang: string;
  langId: number;
  totalQuestions: { id: number; language_id: number }[];
}) {
  const router = useRouter();
  const totalQuestionsCount = totalQuestions.filter(
    (item) => item.language_id === langId
  ).length;
  const userId = getCookie("userId");
  const [completedQuestions, setCompletedQuestions] = useState(0);
  const { data, isLoading } = useQuery({
    queryKey: ["language_topics", langId, userId],
    queryFn: async () => {
      if (!userId) return null;
      return await getLanguageTopics({ langId, userId });
    },
    retry: false,
  });

  useEffect(() => {
    let totalCorrect = 0;
    if (!data) return;
    for (const topic of data) {
      if (topic.languages_quiz && topic.languages_quiz.length > 0) {
        for (const quiz of topic.languages_quiz) {
          totalCorrect += quiz.correct * topic.level_id;
        }
      }
    }
    setCompletedQuestions(totalCorrect);
  }, [data]);

  const progress =
    totalQuestionsCount === 0
      ? 0
      : ((completedQuestions || 0) / totalQuestionsCount) * 100;

  if (isLoading) return <LanguageCardSkeleton />;

  return (
    <div className="bg-[#F5F9FF] shadow-[0px_0px_8px_0px_#0053F429] p-8 rounded-xl max-w-xl w-full mx-auto my-10 flex items-center gap-8">
      <div className="shrink-0">
        <Image
          src={LanguageImage}
          alt="Language Image"
          className="md:w-[100px] md:h-[100px] w-[80px] h-[80px]"
        />
      </div>
      <div className="space-y-4 w-full">
        {completedQuestions == 0 ? (
          <h1 className="text-[#5B8989] font-semibold text-lg">
            You have {totalQuestionsCount} sets of flashcards to practice
          </h1>
        ) : (
          <div className="w-full">
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                backgroundColor: "rgb(209 213 219)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#F0A919",
                },
                height: 18,
                borderRadius: 1,
                width: "100%",
              }}
            />
            <p className="text-lg font-semibold text-[#5B8989] mt-1">{`Completed ${completedQuestions} of ${totalQuestionsCount} cards`}</p>
          </div>
        )}

        <Button
          onClick={() => router.push("/languages?lang=" + lang + "#topics")}
          className="text-white bg-[#E98451] p-4 rounded-lg hover:bg-[#e69167]"
        >
          {completedQuestions == 0 ? "Get Started" : "Continue Learning"}{" "}
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
