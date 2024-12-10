"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Lock from "@/public/images/icons/lock-white.png";
import { getCardIcon } from "../_utils";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import saveGTMEvents from "@/lib/gtm";
import { getCookie } from "cookies-next";

type TopicCardProps = {
  lock: boolean;
  cards: number;
  topic: {
    id: number;
    name: string;
    languages_quiz: { card_state: number; id: number; points: number }[];
  };
  levelId: number;
};

export default function TopicCard({
  cards,
  lock,
  topic,
  levelId,
}: TopicCardProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang");
  const [selectedState, setSelectedState] = useState<string>("");

  const quizSubmission = topic?.languages_quiz.sort(
    (a, b) => a.card_state - b.card_state
  )[topic?.languages_quiz.length - 1];

  const hasCompletedAllStates = topic?.languages_quiz.length === 4;

  const stateToRange = (state: number) => {
    switch (state) {
      case 1:
        return "1-5";
      case 2:
        return "6-10";
      case 3:
        return "11-15";
      case 4:
        return "16-20";
      default:
        return "1-5";
    }
  };

  const nextState =
    quizSubmission?.card_state == 1
      ? "6-10"
      : quizSubmission?.card_state == 2
      ? "11-15"
      : quizSubmission?.card_state == 3
      ? "16-20"
      : "1-5";

  const getLevelText = (state: string | null) => {
    if (!state || !hasCompletedAllStates) return "";
    return `Level ${Math.ceil(parseInt(state.split("-")[0]) / 5)}`;
  };

  const getStatePoints = (stateNumber: number) => {
    const quiz = topic?.languages_quiz.find(
      (q) => q.card_state === stateNumber
    );
    return quiz?.points || 0;
  };

  const getStateWithLowestPoints = () => {
    if (!hasCompletedAllStates) return nextState;

    let lowestPoints = Infinity;
    let stateWithLowestPoints = "1-5";

    topic.languages_quiz.forEach((quiz) => {
      if (quiz.points < lowestPoints) {
        lowestPoints = quiz.points;
        stateWithLowestPoints = stateToRange(quiz.card_state);
      }
    });

    return stateWithLowestPoints;
  };
  const userId = getCookie("userId");
  const handleLearnButtonClick = () => {
    saveGTMEvents({
      eventAction: "learn_language_opened",
      label: userId?"Student":"Guest",
      label1: userId?.toString()||null,
      label2: lang,
      label3: topic.name||null,
      label4: null,
    });
    router.push(
      `/languages/learn?lang=${lang}&topic=${topic.id}&level=${levelId}&cards=${
        hasCompletedAllStates
          ? selectedState || getStateWithLowestPoints()
          : nextState
      }&topicName=${topic.name}`
    );
  };
  const handleClickForQuiz = () => {
    saveGTMEvents({
      eventAction: "test_language_opened",
      label: userId?"Student":"Guest",
      label1: userId?.toString()||null,
      label2: lang,
      label3: topic.name||null,
      label4: null,
    });
    router.push(
      `/languages/quiz?lang=${lang}&topic=${topic.id}&level=${levelId}&cards=${
        hasCompletedAllStates
          ? selectedState || getStateWithLowestPoints()
          : nextState
      }`
    );
  };
  
  

  return (
    <div className="px-2 h-full">
      <Card
        className={cn(
          "w-full h-full shadow-none rounded-2xl min-h-[14.5rem] flex flex-col",
          lock ? "bg-[#FAFAFA]" : "bg-[#F5F9FF]"
        )}
        style={{
          boxShadow: "0px 0px 8px 0px #0053F429",
        }}
      >
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-xl">{getCardIcon(topic.name)}</span>
            <h3 className="text-lg md:text-xl font-semibold text-[#517B7B]">
              {topic.name}
            </h3>
          </div>
          <p className="text-sm text-[#A3A3A3] font-medium">
            <span className="font-bold">{cards}</span> flash cards available
          </p>
          <div className="flex flex-col gap-2 pt-4">
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.ceil(cards / 5) }).map((_, index) => (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        onClick={() =>
                          hasCompletedAllStates &&
                          setSelectedState(stateToRange(index + 1))
                        }
                        className={cn(
                          "w-full max-w-12 h-1.5 rounded-full transition-all duration-200",
                          hasCompletedAllStates
                            ? "cursor-pointer hover:opacity-80"
                            : "cursor-default",
                          selectedState === stateToRange(index + 1)
                            ? "bg-[#F0A919]"
                            : "bg-[#f2c445]",
                          index < topic?.languages_quiz.length
                            ? "opacity-100"
                            : "opacity-30"
                        )}
                      />
                    </TooltipTrigger>
                    {index < topic?.languages_quiz.length && (
                      <TooltipContent className="bg-[#517B7B] text-white px-2 py-1 rounded text-xs">
                        {getStatePoints(index + 1)} pts
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        </CardContent>
        {lock ? (
          <CardFooter className="flex justify-between p-6 gap-6 mt-auto">
            <Button
              disabled={lock}
              onClick={() => {}}
              className="bg-[#C3B8AC] hover:bg-[#C3B8AC]/80 disabled:opacity-1000 rounded-lg text-white w-fit items-center flex"
            >
              Start Learning{" "}
              <Image
                src={Lock}
                alt="lock"
                width={12}
                height={12}
                className="ml-2"
              />
            </Button>
          </CardFooter>
        ) : (
          <CardFooter className="flex flex-col px-6 gap-3 mt-auto">
            {hasCompletedAllStates && (
              <div className="mr-auto">
                <p className="text-sm text-[#517B7B] font-medium">
                  Click on any level bar to practice again
                </p>
              </div>
            )}
            <div className="flex justify-between w-full gap-6">
              <Button
                onClick={handleLearnButtonClick}
                className="bg-[#F0A919] hover:bg-yellow-500 text-white w-full"
              >
                Learn{" "}
                {hasCompletedAllStates &&
                  selectedState &&
                  `(${getLevelText(selectedState)})`}
              </Button>
              <Button
                onClick={handleClickForQuiz}
                className="bg-[#E98451] hover:bg-orange-500 text-white w-full disabled:opacity-50"
              >
                Practice{" "}
                {hasCompletedAllStates &&
                  selectedState &&
                  `(${getLevelText(selectedState)})`}
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
