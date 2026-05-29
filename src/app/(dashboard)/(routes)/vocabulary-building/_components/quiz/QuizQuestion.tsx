"use client";

import { useEffect, useState } from "react";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/newFlow/ui/buttons";
import { McqOption } from "@/components/newFlow/ui/McqOption";
import { cn } from "@/lib/utils";
import ExplanationCard from "./ExplanationCard";
import type { VocabularyQuestion } from "../../_types";

type OptionState = "unselected" | "selected" | "correct" | "incorrect";

type QuizQuestionProps = {
  question: VocabularyQuestion;
  isSubmitting: boolean;
  isNavigating: boolean;
  onCheck: (selectedIndex: number) => Promise<{
    isCorrect: boolean;
    correctOption: number;
    explanation: string;
    sessionComplete: boolean;
  } | null>;
  onNext: () => void;
  isLast: boolean;
};

type Submitted = {
  selectedIndex: number;
  correctOption: number;
  explanation: string;
  sessionComplete: boolean;
};

const YELLOW_BUTTON_STYLE: React.CSSProperties = {
  backgroundColor: "#FFC62E",
  borderWidth: "3px",
  borderColor: "#C79000",
  borderRadius: "16px",
  boxShadow:
    "0px 8px 8px 0px #00000014, inset 0px -4px 0px 0px #FBB600, inset 0px 2px 0px 0px #FFE294",
  color: "#404040",
};

const YELLOW_BUTTON_LOADING_STYLE: React.CSSProperties = {
  ...YELLOW_BUTTON_STYLE,
  boxShadow: "none",
  opacity: 0.8,
};

export default function QuizQuestion({
  question,
  isSubmitting,
  isNavigating,
  onCheck,
  onNext,
  isLast,
}: QuizQuestionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<Submitted | null>(null);

  useEffect(() => {
    setSelectedIndex(null);
    setSubmitted(null);
  }, [question.id]);

  const getOptionState = (index: number): OptionState => {
    if (!submitted) {
      return index === selectedIndex ? "selected" : "unselected";
    }
    if (index === submitted.correctOption) return "correct";
    if (index === submitted.selectedIndex) return "incorrect";
    return "unselected";
  };

  const handlePrimary = async () => {
    if (submitted) {
      onNext();
      return;
    }
    if (selectedIndex === null) return;

    const result = await onCheck(selectedIndex);
    if (!result) return;
    setSubmitted({
      selectedIndex,
      correctOption: result.correctOption,
      explanation: result.explanation,
      sessionComplete: result.sessionComplete,
    });
  };

  const primaryLabel = submitted
    ? submitted.sessionComplete && isLast
      ? "Submit"
      : "Next"
    : "Check answer";

  const isBusy = isSubmitting || isNavigating;
  const primaryDisabled = isBusy || (!submitted && selectedIndex === null);

  const buttonLabel = isSubmitting
    ? "Checking…"
    : isNavigating
    ? "Loading…"
    : primaryLabel;

  return (
    <div className="p-2 rounded-xl">
      <p className="text-lg sm:text-[22px] font-bold text-[#404040] mb-6">
        {question.question}
      </p>

      <div className="flex flex-col gap-4">
        {question.options.map((opt, index) => (
          <McqOption
            key={`${question.id}-${opt.id ?? index}`}
            label={opt.text}
            state={getOptionState(index)}
            onSelect={() => {
              if (!submitted && !isBusy) setSelectedIndex(index);
            }}
            className={cn(
              submitted || isBusy ? "cursor-not-allowed" : "cursor-pointer"
            )}
          />
        ))}
      </div>

      <div className="border-t border-[#E6E6E6] my-6" />

      <Button
        variant="primary"
        size="full"
        className={cn(
          "flex justify-between w-full sm:max-w-[260px] sm:mx-auto py-4 px-6 font-bold text-base sm:text-lg",
          "hover:brightness-95"
        )}
        style={isBusy ? YELLOW_BUTTON_LOADING_STYLE : YELLOW_BUTTON_STYLE}
        disabled={primaryDisabled}
        onClick={handlePrimary}
      >
        <span>{buttonLabel}</span>
        {isBusy ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <ArrowCircleRightIcon style={{ color: "#404040" }} />
        )}
      </Button>

      {submitted && <ExplanationCard text={submitted.explanation} />}
    </div>
  );
}
