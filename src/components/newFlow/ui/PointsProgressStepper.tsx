"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

import goldBadgeImg from "@/assets/Images/gold_badge.png";
import silverBadgeImg from "@/assets/Images/silver_badge.png";
import bronzeBadgeImg from "@/assets/Images/bronze_badge.png";
import Image from "next/image";

interface BadgeMeta {
  title: string;
  percentage: number;
  points: number;
}

interface PointsProgressStepperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  total: number;
  current: number;
  data: {
    summary: {
      pointsEarned: number;
      pointsAvailable: number;
      badge: number;
      percentage: number;
      list: {
        NOVICE: number;
        PRO: number;
        MASTER: number;
      };
      meta: Record<number, BadgeMeta>;
    };
  };
}

export function PointsProgressStepper({
  total,
  current,
  className,
  data,
  ...props
}: PointsProgressStepperProps) {

  current = current > total ? total : current;

  const percentage = total === 0 ? 0 : (current / total) * 100;

  const badges = {
    30: goldBadgeImg,
    31: silverBadgeImg,
    32: bronzeBadgeImg,
  };

  return (
    <div
      className={cn("flex items-center gap-2 h-2.5 mb-8 mt-10", className)}
      {...props}
    >
      <div className="relative flex-1 h-full rounded-full bg-[#E6E6E6]">
        <div
          className="h-full bg-app-primary transition-all duration-300 border-2 border-[#C79000] rounded-xl"
          style={{ width: `${percentage}%` }}
        />
        {Object.entries(badges).map(([key, value]) => (
          <div
            key={key}
            className="absolute flex flex-col items-center -top-[26px] gap-[2px]"
            style={{
              left: `${
                data?.summary?.meta[key as unknown as number]?.percentage
              }%`,
              mixBlendMode:
                data?.summary?.meta[key as unknown as number]?.percentage <
                percentage
                  ? "normal"
                  : "luminosity",
            }}
          >
            <p className="text-app-text-black font-semibold text-xs">
              {data?.summary?.meta[key as unknown as number]?.title}
            </p>
            <div className="w-6 h-6 rounded-full border-2 border-[#C79000] flex justify-center items-center bg-white">
              <Image src={value} alt={key} className="w-3.5 h-3.5" />
            </div>
            <p className="text-app-text-black font-semibold text-xs">
              {data?.summary?.meta[key as unknown as number]?.points}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
