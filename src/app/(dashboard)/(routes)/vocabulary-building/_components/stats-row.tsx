import Image from "next/image";
import { Check, CheckCircle2 } from "lucide-react";
import fireImg from "../../../../../assets/Images/Fire.png";
import booksImg from "../../../../../assets/Images/Books.png";

type StatsRowProps = {
  todayDone: number;
  todayTotal: number;
  streakDays: number;
  totalLearnt: number;
  totalAvailable: number;
};

function IncompleteCheck() {
  return <CheckCircle2 className="w-7 h-7 text-[#CCCCCC]" aria-hidden />;
}

function TodayCard({ done, total }: { done: number; total: number }) {
  return (
    <div
      className="col-span-2 md:col-span-1 bg-[#F8F8F8] rounded-[24px] p-5 md:max-w-[330px] w-full"
      style={{ boxShadow: "0px 4px 12px 0px #00000008" }}
    >
      <p className="text-base font-bold text-[#404040]">
        You&apos;ve learned{" "}
        <span className="text-[#EB4F00]">{done} / {total}</span>{" "}
        words today!
      </p>
      <div className="flex items-center gap-2 my-3">
        {Array.from({ length: total }).map((_, i) => {
          const filled = i < done;
          if (!filled) return <IncompleteCheck key={i} />;
          return (
            <div
              key={i}
              className="w-7 h-7 rounded-full grid place-items-center bg-[#EB4F00] text-white"
            >
              <Check className="w-3.5 h-3.5" strokeWidth={3} />
            </div>
          );
        })}
      </div>
      <p className="text-sm font-semibold text-[#404040]">
        Complete {total} words to finish today&apos;s streak
      </p>
    </div>
  );
}

function StreakCard({ days }: { days: number }) {
  return (
    <div
      className="bg-[#F8F8F8] rounded-2xl p-5 flex items-center gap-4 md:max-w-[330px] w-full"
      style={{ boxShadow: "0px 4px 12px 0px #00000008" }}
    >
      <Image
        src={fireImg}
        alt="streak"
        width={56}
        height={56}
        sizes="56px"
        className="w-14 h-14 object-contain shrink-0"
      />
      <div>
        <p className="text-xl font-bold text-[#E98451]">{days}-day</p>
        <p className="text-base text-[#404040] font-semibold">word learning streak</p>
      </div>
    </div>
  );
}

function TotalLearntCard({ learnt, total }: { learnt: number; total: number }) {
  return (
    <div
      className="bg-[#F8F8F8] rounded-2xl p-5 flex items-center gap-4 md:max-w-[330px] w-full"
      style={{ boxShadow: "0px 4px 12px 0px #00000008" }}
    >
      <Image
        src={booksImg}
        alt="books"
        width={56}
        height={56}
        sizes="56px"
        className="w-14 h-14 object-contain shrink-0"
      />
      <div>
        <p className="text-xl font-bold text-[#E98451]">{learnt}</p>
        <p className="text-base text-[#404040] font-semibold">/ {total} words learned</p>
      </div>
    </div>
  );
}

export default function StatsRow({
  todayDone,
  todayTotal,
  streakDays,
  totalLearnt,
  totalAvailable,
}: StatsRowProps) {
  return (
    <div className="px-4 md:px-0 grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(330px,330px))] gap-3 md:gap-4">
      <TodayCard done={todayDone} total={todayTotal} />
      <StreakCard days={streakDays} />
      <TotalLearntCard learnt={totalLearnt} total={totalAvailable} />
    </div>
  );
}
