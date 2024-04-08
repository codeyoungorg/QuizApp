"use client";
import React, { useState } from "react";
import mathIcon from "@/assets/Images/mathIcon.png";
import gkIcon from "@/assets/Images/gk-icon.png";
import chatsIcon from "@/assets/Images/chatsIcon.png";
import chatIcon from "@/assets/Images/chat-icon.png";
import Image from "next/image";
import ProgressBar from "./progress-bar";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";
import FastForwardOutlinedIcon from "@mui/icons-material/FastForwardOutlined";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  type: string;
};

const Card = ({ type }: Props) => {
  const router = useRouter();
  const [loader, setLoader] = useState<boolean>(false);
  const navigateTo = () => {
    if (type === "chat") {
      router.push("/chat-home");
    }
  };
  return (
    <div className="bg-[#F0F6FA] w-full py-4 px-6 flex flex-col justify-center content-center items-center">
      <Image
        src={type === "math" ? mathIcon : type === "gk" ? gkIcon : chatIcon}
      />
      <span className="text-[#2F4F4F] text-lg font-extrabold ">
        {type === "math"
          ? "Math Quiz"
          : type === "gk"
          ? "General Quiz"
          : "Doubt Solving"}
      </span>
      <div className="text-[#5B8989] text-sm font-medium">
        {type === "math"
          ? "Get better. One quiz at a time"
          : type === "gk"
          ? "General trivia. Just for fun."
          : "Ask anything. Anytime"}
      </div>
      {type === "chat" ? (
        <div className="w-full text-[#5B8989] flex justify-center content-center items-center mt-[2rem]">
          <Image src={chatsIcon} alt="chat" />
          <span className="font-bold text-xl ml-1">80</span>
          <span className="text-sm font-medium ml-1">chats done</span>
        </div>
      ) : (
        <div className="w-full">
          <ProgressBar />
        </div>
      )}
      <div className="flex justify-center">
        <Button
          className={cn(
            "w-max mt-[1.5rem] py-[6px] px-[12px] bg-[#E98451] text-sm font-semibold text-[#FFF] hover:bg-[#E98451]"
          )}
          onClick={() => navigateTo()}
          //onClick={()=> router.push("/quizes")}
        >
          Continue
          {loader ? (
            <CircularProgress color="inherit" size={25} className="ml-2" />
          ) : (
            <FastForwardOutlinedIcon className="ml-[0.5rem]" fontSize="small" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default Card;
