"use client";

import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import botIcon from "@/assets/Images/noah_dp.svg";
import lucide_trophy from "@/assets/Images/lucide_trophy.png";
import Image from "next/image";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import CircularProgress from "@mui/material/CircularProgress";

import { useRouter } from "next/navigation";

if (typeof window !== "undefined") {
}

export function InitialChatMessage({
  setStart,
  user,
}: {
  setStart: Dispatch<SetStateAction<boolean>>;
  user: { name: string; grade: number; id: string };
}) {
  return (
    <div className="max-w-3xl my-2 flex items-start w-full gap-x-2">
      <div className=" w-10 h-10 rounded-full grid place-items-center">
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
  startNewQuiz,
  endQuiz,
  loader,
}: {
  showQuizScore: Dispatch<SetStateAction<boolean>>;
  user: { name: string; grade: number; id: string };
  startNewQuiz: any;
  endQuiz: any;
  loader: boolean;
}) {
  const router = useRouter();
  return (
    <div className="max-w-3xl my-2 flex items-start w-full gap-x-2">
      <div className=" w-10 h-10 rounded-full grid place-items-center">
        <Image src={botIcon} alt="bot" className="stroke-white" />
      </div>
      <div className="w-full">
        <div className="flex flex-col gap-x-2 justify-between border-2 font-medium text-sm leading-5 border-[#DAE7E7] text-[#5B8989] bg-[#F9FBFB] p-4 rounded-lg rounded-ss-none">
          <p className="text-sm py-0.5">
            {user ? (
              <span className="mb-2">
                Great {user.name}! <br /> You have completed the quiz.
              </span>
            ) : (
              "Great, You have completed the quiz. Click on the button to see your score."
            )}
          </p>
          <div className="mt-[1rem] flex-col md:flex-row">
            <Button
              className="min-w-[164px] mt-2 bg-[#E98451] text-[#FFF] hover:bg-[#E98451]"
              onClick={() => showQuizScore(true)}
            >
              View Score
              <Image
                src={lucide_trophy}
                alt="trophy"
                className="w-4 h-4 ml-2"
              />
            </Button>
            <Button
              className="min-w-[164px] mt-2 border-2 border-[#E98451] bg-transparent text-[#E98451] hover:bg-transparent md:ml-2"
              onClick={() => startNewQuiz()}
            >
              Start New Quiz{" "}
              {loader ? (
                <CircularProgress color="inherit" size={25} className="ml-2" />
              ) : (
                <EastOutlinedIcon className="ml-[0.5rem]" fontSize="small" />
              )}
            </Button>
            <Button
              className="min-w-[164px] mt-2 border-2 border-[#E98451] bg-transparent text-[#E98451] hover:bg-transparent md:ml-2"
              onClick={() => endQuiz()}
            >
              End Quiz & Exit{" "}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
