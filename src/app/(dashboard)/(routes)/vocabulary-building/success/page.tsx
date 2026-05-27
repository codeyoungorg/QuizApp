"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, RefreshCw, X, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLevel, getNextLevel } from "../_data/levels";

export default function VocabularySuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const levelParam = searchParams.get("level") ?? "beginner";
  const level = getLevel(levelParam);
  const nextLevel = getNextLevel(levelParam);

  const onClose = () => router.push("/vocabulary-building");
  const onKeepPlaying = () =>
    router.push(`/vocabulary-building/quiz?level=${level.id}`);
  const onSwitchLevel = () =>
    nextLevel &&
    router.push(`/vocabulary-building/quiz?level=${nextLevel.id}`);

  return (
    <div className="w-full md:max-w-2xl mx-auto px-4 py-6 relative">
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-1.5 bg-white border border-[#E7EEEE] rounded-full h-8 px-3 text-xs text-[#5B8989] hover:bg-[#F5F9F9]"
        >
          <X className="w-3.5 h-3.5" />
          Close
        </button>
      </div>

      <div className="flex flex-col items-center text-center mt-2">
        <div className="text-3xl mb-2" aria-hidden>
          🎈🎈🎈
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#1F1F1F]">
          Activity complete!
        </h1>

        <div className="mt-6 bg-[#E8F6E1] rounded-xl px-4 py-3 inline-flex items-center gap-2">
          <Library className="w-5 h-5 text-[#4EB487]" />
          <span className="text-sm font-semibold text-[#4EB487]">
            5 new words learned!
          </span>
        </div>

        <p className="mt-5 text-xs text-[#8B8B8B]">Your learning progress:</p>
        <p className="mt-1 text-sm text-[#5B8989]">
          <span className="text-[#7C5CFF] font-semibold">
            {level.wordsLearnt}
          </span>{" "}
          / {level.totalWords} words learned as{" "}
          <span className="text-[#7C5CFF] font-semibold">
            {level.badgeLabel}
          </span>
        </p>

        <Button
          onClick={onKeepPlaying}
          className="mt-5 bg-[#E98451] hover:bg-[#E98451]/90 text-white rounded-full h-11 px-6 gap-2"
        >
          Keep playing
          <span className="bg-white/25 rounded-full w-5 h-5 grid place-items-center">
            <ArrowRight className="w-3 h-3" />
          </span>
        </Button>

        {nextLevel && (
          <>
            <hr className="border-t border-[#EFEFEF] my-6 w-full" />
            <p className="text-sm text-[#5B8989]">
              Finding it too easy? Bump up the difficulty level!
            </p>
            <button
              onClick={onSwitchLevel}
              className="mt-3 inline-flex items-center gap-2 bg-white border border-[#E7EEEE] rounded-full h-10 px-5 text-sm text-[#5B8989] hover:bg-[#F5F9F9]"
            >
              <RefreshCw className="w-4 h-4" />
              Switch to {nextLevel.badgeLabel}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
