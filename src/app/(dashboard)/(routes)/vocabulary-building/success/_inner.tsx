"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, RefreshCw, XCircle } from "lucide-react";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { getThemeBySlug, getNextThemeByApiId } from "../_data/levels";

type NavTarget = "close" | "keep" | "switch" | null;

export default function SuccessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [navigating, setNavigating] = useState<NavTarget>(null);

  const levelParam = searchParams.get("level") ?? "beginner";
  const theme = getThemeBySlug(levelParam);
  const nextTheme = getNextThemeByApiId(theme.apiLevelId);

  const wordsLearned = Number(searchParams.get("wordsLearned") ?? 0);
  const totalLearned = Number(searchParams.get("totalLearned") ?? 0);
  const totalForLevel = Number(searchParams.get("totalForLevel") ?? 0);
  const levelName = searchParams.get("levelName") ?? "";

  const onClose = () => {
    if (navigating) return;
    setNavigating("close");
    router.push("/vocabulary-building");
  };

  const onKeepPlaying = () => {
    if (navigating) return;
    setNavigating("keep");
    router.push(`/vocabulary-building/quiz?level=${theme.slug}`);
  };

  const onSwitchLevel = () => {
    if (!nextTheme || navigating) return;
    setNavigating("switch");
    router.push(`/vocabulary-building/quiz?level=${nextTheme.slug}`);
  };

  return (
    <div className="w-full max-w-[640px] mx-auto px-4 sm:px-6 py-6 relative">
      <div className="flex justify-end">
        <button
          onClick={onClose}
          disabled={!!navigating}
          className="inline-flex items-center gap-2 bg-white border-[3px] border-[#E6E6E6] rounded-full h-10 px-4 text-sm font-semibold text-[#404040] hover:bg-[#F5F5F5] disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {navigating === "close" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <XCircle className="w-4 h-4 text-[#404040]" strokeWidth={2} />
          )}
          Close
        </button>
      </div>

      <div className="flex flex-col items-center text-center mt-2">
        <Image
          src="/images/ballons.png"
          alt=""
          width={64}
          height={64}
          className="w-[64px] sm:w-[64px] h-auto object-contain"
          priority
        />

        <h1 className="text-3xl sm:text-4xl font-bold text-[#404040] mt-2">
          Activity complete!
        </h1>

        <div className="w-full mt-8 relative">
          <Image
            src="/images/book_stack_rectangle.png"
            alt=""
            width={350}
            height={180}
            className="max-w-[350px] max-h-[180px] mx-auto w-full h-full object-contain"
            priority
          />
          <p className="absolute bottom-4 left-0 right-0 text-center text-lg sm:text-xl font-bold">
            <span className="text-[#2BA84A]">{wordsLearned}</span>
            <span className="text-[#404040]"> new words learned!</span>
          </p>
        </div>

        <p className="mt-8 text-sm text-[#999999] font-semibold">Your learning progress:</p>
        <p className="mt-2 text-lg sm:text-xl font-bold text-[#404040]">
          <span className={`${theme.progressAccent}`}>{totalLearned}</span>
          <span className="text-[#404040]">
            {" "}/ {totalForLevel} words learned as{" "}
          </span>
          <span className={`${theme.progressAccent}`}>{levelName}</span>
        </p>

        <button
          onClick={onKeepPlaying}
          disabled={!!navigating}
          className="mt-6 inline-flex items-center gap-3 text-white font-bold text-base h-12 px-6 hover:brightness-95 transition disabled:opacity-80 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "#FF6A1F",
            borderWidth: "3px",
            borderColor: "#F55200",
            borderRadius: "16px",
            boxShadow:
              navigating === "keep"
                ? "none"
                : "0px 4px 8px 0px #FF6A1F29, inset 0px -4px 0px 0px #FF8547, inset 0px 1px 0px 0px #FF9966",
          }}
        >
          {navigating === "keep" ? "Loading…" : "Keep playing"}
          <span className=" rounded-full w-6 h-6 grid place-items-center">
            {navigating === "keep" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
               <ArrowCircleRightIcon style={{ color: "#fff" }} />
            )}
          </span>
        </button>

        {nextTheme && (
          <>
            <hr className="border-t border-[#E6E6E6] my-8 w-full" />
            <p className="text-base font-bold text-[#404040]">
              Finding it too easy? Bump up the difficulty level!
            </p>
            <button
              onClick={onSwitchLevel}
              disabled={!!navigating}
              className="mt-4 inline-flex items-center gap-2 bg-white border-[3px] border-[#E6E6E6] rounded-[16px] h-11 px-5 text-sm font-bold text-[#404040] hover:bg-[#F5F5F5] disabled:opacity-60 disabled:cursor-not-allowed transition"
              style={{ boxShadow: "0px 2px 6px 0px #00000010, inset 0px -4px 0px 0px #F2F2F2" }}
            >
              {navigating === "switch" ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#999999]" />
              ) : (
                <RefreshCw className="w-4 h-4 text-[#999999]" />
              )}
              Switch to {nextTheme.difficultyLabel}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
