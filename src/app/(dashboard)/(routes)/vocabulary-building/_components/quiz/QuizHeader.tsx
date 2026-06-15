"use client";

import { X } from "lucide-react";
import { ProgressSteps } from "@/components/newFlow/ui/progressStepper";
import { cn } from "@/lib/utils";
import type { LevelTheme } from "../../_data/levels";

type QuizHeaderProps = {
  levelName: string;
  theme: LevelTheme;
  current: number;
  total: number;
  onQuit: () => void;
};

export default function QuizHeader({
  levelName,
  theme,
  current,
  total,
  onQuit,
}: QuizHeaderProps) {
  return (
    <div className="flex flex-col gap-3 mb-6 sm:mb-10">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold",
            theme.badgeBg,
            theme.badgeText
          )}
        >
          <span aria-hidden>{theme.badgeEmoji}</span>
          <span>{levelName}</span>
        </div>

        <div className="font-sm font-semibold text-[#999999]">
          <span className="font-bold text-[#404040]">{current}</span> of <span>{total}</span>
        </div>
        </div>

        <button
          type="button"
          onClick={onQuit}
          className="inline-flex items-center gap-1.5 bg-white border-[3px] border-[#FFCCCC] rounded-full h-9 px-3.5 text-sm font-semibold text-[#FF3333] hover:bg-[#FFF5F5]"
        >
          <X className="w-4 h-4 text-[#FF3333]" />
          Quit
        </button>
      </div>
    </div>
  );
}
