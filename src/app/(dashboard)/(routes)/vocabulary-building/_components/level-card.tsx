"use client";

import { useRouter } from "next/navigation";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Level } from "../_data/levels";

export default function LevelCard({ level }: { level: Level }) {
  const router = useRouter();

  const onPlay = () => {
    router.push(`/vocabulary-building/quiz?level=${level.id}`);
  };

  return (
    <div
      className={cn(
        "rounded-2xl p-4 md:p-5 flex flex-col gap-3 relative overflow-hidden min-h-[180px]",
        level.cardBg
      )}
      style={{ boxShadow: "0px 4px 12px 0px #00000008" }}
    >
      <div
        className={cn(
          "inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
          level.badgeBg,
          level.badgeText
        )}
      >
        <span aria-hidden>{level.badgeEmoji}</span>
        <span>{level.badgeLabel}</span>
      </div>

      <div>
        <h3 className="text-xl font-bold text-[#1F1F1F]">{level.gradeText}</h3>
        <p className="text-sm text-[#5B8989] mt-1">{level.description}</p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2">
        <Button
          onClick={onPlay}
          className="bg-[#FF6A1F] hover:bg-[#FF6A1F]/90 text-white rounded-2xl h-10 px-5 gap-1.5 border-[3px] border-[#F55200]"
          style={{ boxShadow: "0 4px 8px 0 rgba(255, 106, 31, 0.16)" }}
        >
          <Play className="w-4 h-4 fill-white" />
          Play
        </Button>
        <p className="text-xs text-[#5B8989] font-medium flex items-center gap-1">
          <span aria-hidden>🚩</span>
          {level.wordsLearnt} / {level.totalWords} words learnt
        </p>
      </div>
    </div>
  );
}
