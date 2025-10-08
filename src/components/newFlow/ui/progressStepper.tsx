"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressStepsProps extends React.HTMLAttributes<HTMLDivElement> {
  total: number;
  current: number;
  showSteps?: boolean;
  showBorder?: boolean;
}

export function ProgressSteps({
  total,
  current,
  showSteps = true,
  showBorder = false,
  className,
  ...props
}: ProgressStepsProps) {
  const percentage = total === 0 ? 0 : (current / total) * 100;
  return (
    <div className={cn("flex items-center gap-2 h-2", className)} {...props}>
      <div className={cn("relative flex-1 h-full rounded-full bg-app-tertiary overflow-hidden",)}>
        <div
          className="h-full bg-app-primary transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {showSteps && (
        <div className="font-medium whitespace-nowrap inline-block">
          <span className="text-app-text-black">{current}</span>{" "}
          <span className="text-app-text-grey"> of {total}</span>
        </div>
      )}
    </div>
  );
}
