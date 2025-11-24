"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import ErrorIcon from "@mui/icons-material/Error";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import selectedOption from "@/assets/Images/selected_option.svg";
import correctOption from "@/assets/Images/correct_option.svg";
import Image from "next/image";

type OptionState = "unselected" | "selected" | "correct" | "incorrect";

interface ChoiceOptionProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  state?: OptionState;
  onSelect?: () => void;
}

export function McqOption({
  label,
  state = "unselected",
  onSelect,
  className,
  ...props
}: ChoiceOptionProps) {
  const colors = {
    unselected: "#E6E6E6",
    selected: "#0055FF",
    correct: "#008000",
    incorrect: "#FFA500",
  };

  const iconstates = {
    unselected: (
      <PanoramaFishEyeIcon
        className="h-5 w-5"
        style={{ color: colors.unselected }}
      />
    ),
    selected: <Image src={selectedOption} alt="Selected" className="h-5 w-5" />,
    correct: <Image src={correctOption} alt="Correct" className="h-5 w-5" />,
    incorrect: (
      <ErrorIcon className="h-5 w-5" style={{ color: colors.incorrect }} />
    ),
  };

  const stateColor = colors[state];
  return (
    <div
      onClick={onSelect}
      className={cn(
        "flex items-center justify-between w-full cursor-pointer rounded-[12px] border px-[10px] py-3 text-app-text-black font-semibold transition-all",
        className
      )}
      style={{
        borderWidth: "2px",
        borderColor: stateColor,
      }}
      {...props}
    >
      <div className="flex items-center gap-2">
        {iconstates[state]}
        <span>{label}</span>
      </div>
    </div>
  );
}
