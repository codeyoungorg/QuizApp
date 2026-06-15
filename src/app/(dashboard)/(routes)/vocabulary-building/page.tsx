"use client";

import { getCookie } from "cookies-next";
import { useQuery } from "@tanstack/react-query";
import VocabHeader from "./_components/vocab-header";
import StatsRow from "./_components/stats-row";
import LevelsGrid from "./_components/levels-grid";
import LandingSkeleton from "./_components/landing-skeleton";
import { getVocabularyStats } from "@/actions/vocabulary";

export default function VocabularyBuildingPage() {
  const userId = (getCookie("userId") as string) || "";

  const { data: stats, isLoading } = useQuery({
    queryKey: ["vocabulary-stats", userId],
    queryFn: () => getVocabularyStats({ userId }),
    enabled: !!userId,
  });

  return (
    <div className="w-full md:max-w-6xl mx-auto md:p-4 pb-10">
      <VocabHeader />
      {isLoading || !stats ? (
        <LandingSkeleton />
      ) : (
        <>
          <StatsRow
            todayDone={stats.dailyProgress.totalLearnedToday}
            todayTotal={stats.dailyProgress.target}
            streakDays={stats.streak}
            totalLearnt={stats.totalLearned}
            totalAvailable={stats.totalAvailable}
          />
          <LevelsGrid levels={stats.levels} />
        </>
      )}
    </div>
  );
}
