import Image from "next/image";
import { Check, CheckCircle2 } from "lucide-react";
import fireImg from "../../../../../assets/Images/Fire.png";
import booksImg from "../../../../../assets/Images/Books.png";

const TODAY_DONE = 3;
const TODAY_TOTAL = 5;
const STREAK_DAYS = 6;
const TOTAL_LEARNT = 128;
const TOTAL_AVAILABLE = 958;

const TODAY_TEXT_STYLE = {
  fontFamily: "Inter, sans-serif",
  fontSize: "16px",
  fontWeight: 700,
  lineHeight: "24px",
  letterSpacing: "-0.64px",
} as const;

function IncompleteCheck() {
  return <CheckCircle2 className="w-8 h-8 text-[#CCCCCC]" aria-hidden />;
}

function TodayCard() {
  return (
    <div
      className="flex-1 bg-[#F8F8F8] rounded-[24px] p-4"
      style={{ boxShadow: "0px 4px 12px 0px #00000008" }}
    >
      <p style={{ ...TODAY_TEXT_STYLE, color: "#404040" }}>
        You&apos;ve learned{" "}
        <span style={{ color: "#EB4F00" }}>
          {TODAY_DONE} / {TODAY_TOTAL}
        </span>{" "}
        words today!
      </p>
      <div className="flex items-center gap-2 my-3">
        {Array.from({ length: TODAY_TOTAL }).map((_, i) => {
          const filled = i < TODAY_DONE;
          if (!filled) return <IncompleteCheck key={i} />;
          return (
            <div
              key={i}
              className="w-8 h-8 rounded-full grid place-items-center bg-[#EB4F00] text-white"
            >
              <Check className="w-4 h-4" strokeWidth={3} />
            </div>
          );
        })}
      </div>
      <p style={{ ...TODAY_TEXT_STYLE, color: "#404040" }}>
        Complete {TODAY_TOTAL} words to finish today&apos;s streak
      </p>
    </div>
  );
}

function StreakCard() {
  return (
    <div
      className="flex-1 bg-[#FFF5E1] rounded-2xl p-4 flex items-center gap-3"
      style={{ boxShadow: "0px 4px 12px 0px #00000008" }}
    >
      <Image
        src={fireImg}
        alt="streak"
        width={64}
        height={64}
        sizes="64px"
        className="w-16 h-16 object-contain"
      />
      <div>
        <p className="text-base">
          <span className="text-[#E98451] font-bold">{STREAK_DAYS}-day</span>
        </p>
        <p className="text-xs text-[#5B8989]">word learning streak</p>
      </div>
    </div>
  );
}

function TotalLearntCard() {
  return (
    <div
      className="flex-1 bg-[#FFEDED] rounded-2xl p-4 flex items-center gap-3"
      style={{ boxShadow: "0px 4px 12px 0px #00000008" }}
    >
      <Image
        src={booksImg}
        alt="books"
        width={64}
        height={64}
        sizes="64px"
        className="w-16 h-16 object-contain"
      />
      <div>
        <p className="text-base">
          <span className="text-[#E98451] font-bold">{TOTAL_LEARNT}</span>
        </p>
        <p className="text-xs text-[#5B8989]">
          / {TOTAL_AVAILABLE} words learned
        </p>
      </div>
    </div>
  );
}

export default function StatsRow() {
  return (
    <div className="px-4 md:px-0 flex flex-col md:flex-row gap-3 md:gap-4">
      <TodayCard />
      <StreakCard />
      <TotalLearntCard />
    </div>
  );
}
