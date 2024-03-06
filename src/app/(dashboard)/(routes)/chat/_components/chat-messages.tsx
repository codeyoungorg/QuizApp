"use client";

import { Button } from "@/components/ui/button";
import { BarChart, Bot } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import botIcon from "@/assets/Images/botIcon.svg";
import Image from "next/image";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";

import { useRouter } from "next/navigation";

if (typeof window !== "undefined") {
}

export function InitialChatMessage({
  setStart,
  user,
}: {
  setStart: Dispatch<SetStateAction<boolean>>;
  user: { name: string; grade: string; id: string };
}) {
  return (
    <div className="max-w-3xl my-2 flex items-start w-full gap-x-2">
      <div className="bg-orange-300 w-10 h-10 rounded-full grid place-items-center">
        <Image src={botIcon} alt="bot" className="stroke-white" />
      </div>
      <div className="flex-1 ">
        <div className="border-2 font-medium text-sm leading-5 border-[#DAE7E7] text-[#5B8989] bg-[#F9FBFB] p-4 rounded-lg rounded-ss-none">
          <div>
            <p className="text-sm py-0.5">{user && `Hi ${user.name}!`}</p>
            <p className="mt-2">
              Are you ready for the quiz? Click on ‘Start’ button to begin.
            </p>
          </div>
          <Button
            className="font-sans font-medium text-sm leading-5 mt-2 bg-[#E98451] text-[#FFF] min-w-36 hover:bg-[#E98451]"
            onClick={() => setStart(true)}
          >
            Start <EastOutlinedIcon className="ml-[0.5rem]" fontSize="small" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function EndChatMessage({
  showQuizScore,
  user,
  startNewQuiz
}: {
  showQuizScore: Dispatch<SetStateAction<boolean>>;
  user: { name: string; grade: string; id: string };
  startNewQuiz: any
}) {
  return (
    <div className="max-w-lg my-2 flex items-start w-full gap-x-2">
      <div className="bg-orange-300 w-10 h-10 rounded-full grid place-items-center">
        <Image src={botIcon} alt="bot" className="stroke-white" />
      </div>
      <div className="flex-1">
        <div className="flex flex-col gap-x-2 justify-between border-2 font-medium text-sm leading-5 border-[#DAE7E7] text-[#5B8989] bg-[#F9FBFB] p-4 rounded-lg rounded-ss-none">
          <p className="text-sm py-0.5">
            {user
              ? <span className="mb-2">Great {user.name}! <br/> You have completed the quiz.</span>
              : "Great, You have completed the quiz. Click on the button to see your score."}
          </p>
          <div className="mt-[1rem] flex-col md:flex-row">
          <Button
            className="w-fit mt-2 bg-[#E98451] text-[#FFF] hover:bg-[#E98451]"
            onClick={() => showQuizScore(true)}
          >
            View Score
            <BarChart className="w-4 h-4 ml-2" />
          </Button>
          <Button
            className="w-fit mt-2 bg-[#E98451] text-[#FFF] hover:bg-[#E98451] md:ml-2"
            onClick={() => startNewQuiz()}
          >
            Start New Quiz <EastOutlinedIcon fontSize="small"/>
          </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
