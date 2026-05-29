"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LevelTheme } from "../_data/levels";
import booksImg from "../../../../../assets/Images/Books.png";

type LevelCardProps = {
  theme: LevelTheme;
  name: string;
  grades: string;
  learned: number;
  total: number;
};

export default function LevelCard({
  theme,
  name,
  grades,
  learned,
  total,
}: LevelCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onPlay = () => {
    if (isLoading) return;
    setIsLoading(true);
    router.push(`/vocabulary-building/quiz?level=${theme.slug}`);
  };

  return (
    <div
      className={cn(
        "rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden min-h-[220px]",
        theme.cardBg
      )}
      style={{ boxShadow: "0px 4px 12px 0px #00000008" }}
    >
      {/* Large decorative emoji top-right */}
      <span
        className="absolute -top-4 -right-6 select-none pointer-events-none"
        style={{ fontSize: "100px", lineHeight: 1, opacity: 0.9 }}
        aria-hidden
      >
        {theme.badgeEmoji}
      </span>

      <div
        className={cn(
          "inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
          theme.badgeBg,
          theme.badgeText
        )}
      >
        <span aria-hidden>{theme.badgeEmoji}</span>
        <span>{name}</span>
      </div>

      <div className="mt-auto">
        <h3 className="text-xl font-bold text-[#1F1F1F]">Grades {grades}</h3>
        <p className="text-sm font-semibold text-[#999] mt-1">{theme.description}</p>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onPlay}
          disabled={isLoading}
          className="inline-flex items-center gap-3 text-white font-bold text-base h-12 px-6 transition disabled:opacity-80 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "#FF6A1F",
            borderWidth: "3px",
            borderColor: "#F55200",
            borderRadius: "16px",
            boxShadow: isLoading
              ? "none"
              : "0px 4px 8px 0px #FF6A1F29, inset 0px -4px 0px 0px #FF8547, inset 0px 1px 0px 0px #FF9966",
          }}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Image src="/images/play_btn.png" alt="" width={20} height={20} />
          )}
          {isLoading ? "Loading…" : "Play"}
        </button>
        <p className="text-xs text-[#404040] font-bold flex items-center gap-1">
          <Image
            src={booksImg}
            alt="books"
            width={20}
            height={20}
            sizes="20px"
            className="w-5 h-5 object-contain"
          />
          {learned} / {total} words learnt
        </p>
      </div>
    </div>
  );
}
