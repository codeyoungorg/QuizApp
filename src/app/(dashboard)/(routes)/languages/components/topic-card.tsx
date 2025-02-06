"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Lock from "@/public/images/icons/lock-white.png";
import { getCardIcon } from "../_utils";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import saveGTMEvents from "@/lib/gtm";
import { getCookie } from "cookies-next";
import star from "@/public/images/icons/pointsStar.svg";
import tickIcon from "@/public/images/icons/tickIcon.png";

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
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);

  const getNumCorrectSubmissions = (data: any[]) => {
    let numCorrect = 0;
    for (const submission of data) {
      for (const submissionItem of submission.submission) {
        if (submissionItem.isCorrect) {
          numCorrect++;
        }
      }
    }
    return numCorrect;
  };

  useEffect(() => {
    const data = getNumCorrectSubmissions(topic.languages_quiz);
    setCorrectAnswer(data);
  }, []);

  const getNumCorrectSubmissionsLevelWise = (data: any) => {
    if (!data) return 0;
    const totalCorrectAnswers = data.submission.reduce(
      (acc: any, submission: any) => {
        if (submission.isCorrect) {
          return acc + 1;
        }
        return acc;
      },
      0
    );
    return totalCorrectAnswers;
  };

  const quizSubmission = topic?.languages_quiz.sort(
    (a, b) => a.card_state - b.card_state
  )[topic?.languages_quiz.length - 1];

  const hasAttemptedAllStates = topic?.languages_quiz.length === 4;
  const hasCompletedAllStates =
    getNumCorrectSubmissions(topic.languages_quiz) === 20;

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
    if (!state || !hasAttemptedAllStates) return "";
    return `Level ${Math.ceil(parseInt(state.split("-")[0]) / 5)}`;
  };

  const getLevelNumber = (index: number) => {
    return `Level ${index + 1}`;
  };

  const getStatePoints = (stateNumber: number) => {
    const quiz = topic?.languages_quiz.find(
      (q) => q.card_state === stateNumber
    );
    return quiz?.points || 0;
  };

  const getStateWithLowestPoints = () => {
    if (!hasAttemptedAllStates) return nextState;

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
      label: userId ? "Student" : "Guest",
      label1: userId?.toString() || null,
      label2: lang,
      label3: topic.name || null,
      label4: null,
    });
    router.push(
      `/languages/learn?lang=${lang}&topic=${topic.id}&level=${levelId}&cards=${
        hasAttemptedAllStates
          ? selectedState || getStateWithLowestPoints()
          : nextState
      }&topicName=${topic.name}`
    );
  };
  const handleClickForQuiz = () => {
    saveGTMEvents({
      eventAction: "test_language_opened",
      label: userId ? "Student" : "Guest",
      label1: userId?.toString() || null,
      label2: lang,
      label3: topic.name || null,
      label4: null,
    });
    router.push(
      `/languages/quiz?lang=${lang}&topic=${topic.id}&level=${levelId}&cards=${
        hasAttemptedAllStates
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
          {lock ? (
            <div className="flex flex-row items-center">
              <Image
                src={star}
                alt="new-icon"
                width={16}
                height={16}
                className="w-5 h-5 mr-1"
              />
              <p className="text-sm text-[#569090] font-medium">
                <span className="font-bold">{cards}</span> flash cards available
              </p>
            </div>
          ) : hasCompletedAllStates ? (
            <div className="text-sm text-[#49AB9E] font-medium flex flex-row items-center">
              <Image
                src={tickIcon}
                alt="new-icon"
                width={14}
                height={14}
                className="w-5 h-5 mr-1"
              />
              Completed {correctAnswer}/20
            </div>
          ) : (
            <div className="text-sm text-[#569090] font-medium flex flex-row items-center">
              <Image
                src={star}
                alt="new-icon"
                width={16}
                height={16}
                className="w-5 h-5 mr-1"
              />
              {correctAnswer}/20 done
            </div>
          )}
          <div className="flex flex-col gap-2 pt-4">
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.ceil(cards / 5) }).map((_, index) => (
                <div className="flex flex-col items-center w-full" key={index}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          onClick={() =>
                            hasAttemptedAllStates &&
                            setSelectedState(stateToRange(index + 1))
                          }
                          className={cn(
                            "w-full h-1.5 rounded-full transition-all duration-200",
                            getNumCorrectSubmissionsLevelWise(
                              topic?.languages_quiz[index]
                            ) > 0 &&
                              getNumCorrectSubmissionsLevelWise(
                                topic?.languages_quiz[index]
                              ) < 5 &&
                              !hasCompletedAllStates
                              ? "bg-[#E98451]"
                              : getNumCorrectSubmissionsLevelWise(
                                  topic?.languages_quiz[index]
                                ) == 5 || hasCompletedAllStates
                              ? "bg-[#49AB9E]"
                              : "bg-[#E2D4C1]",
                            hasAttemptedAllStates
                              ? "cursor-pointer hover:opacity-80"
                              : "cursor-default",
                            selectedState === stateToRange(index + 1) &&
                              hasAttemptedAllStates &&
                              "bg-[#F0A919]",
                            index < topic?.languages_quiz.length
                              ? "opacity-100"
                              : "opacity-30"
                          )}
                        />
                      </TooltipTrigger>
                      {index < topic?.languages_quiz.length && (
                        <TooltipContent className="bg-[#517B7B] text-white px-2 py-1 rounded text-xs">
                          {getNumCorrectSubmissionsLevelWise(
                            topic?.languages_quiz[index]
                          )}
                          /5
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                  <p
                    onClick={() =>
                      hasAttemptedAllStates &&
                      setSelectedState(stateToRange(index + 1))
                    }
                    className={cn(
                      "text-sm text-[#517B7B] mt-1 font-medium",
                      getNumCorrectSubmissionsLevelWise(
                        topic?.languages_quiz[index]
                      ) > 0 &&
                        getNumCorrectSubmissionsLevelWise(
                          topic?.languages_quiz[index]
                        ) < 5 &&
                        !hasCompletedAllStates
                        ? "text-[#E98451]"
                        : getNumCorrectSubmissionsLevelWise(
                            topic?.languages_quiz[index]
                          ) == 5 || hasCompletedAllStates
                        ? "text-[#49AB9E]"
                        : "text-[#E2D4C1]",
                      hasAttemptedAllStates
                        ? "cursor-pointer hover:opacity-80"
                        : "cursor-default",
                      selectedState === stateToRange(index + 1) &&
                        hasAttemptedAllStates &&
                        "text-[#F0A919]"
                    )}
                  >
                    {getLevelNumber(index)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        {lock ? (
          <CardFooter className="flex justify-between px-6 gap-6 mt-auto">
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
        ) : hasAttemptedAllStates ? (
          <CardFooter className="flex flex-col px-6 gap-3 mt-auto">
            <div className="flex justify-between w-full gap-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleLearnButtonClick}
                      className="bg-[#F0A919] hover:bg-yellow-500 text-white w-full"
                    >
                      Learn{" "}
                      {hasAttemptedAllStates &&
                        selectedState &&
                        `(${getLevelText(selectedState)})`}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#517B7B] text-white px-2 py-1 rounded text-xs">
                    Click on any level bar to continue
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleClickForQuiz}
                      className="bg-[#E98451] hover:bg-orange-500 text-white w-full disabled:opacity-50"
                    >
                      Practice{" "}
                      {hasAttemptedAllStates &&
                        selectedState &&
                        `(${getLevelText(selectedState)})`}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#517B7B] text-white px-2 py-1 rounded text-xs">
                    Click on any level bar to continue
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardFooter>
        ) : (
          <CardFooter className="flex flex-col px-6 gap-3 mt-auto">
            <div className="flex justify-between w-full gap-6">
              <Button
                onClick={handleLearnButtonClick}
                className="bg-[#F0A919] hover:bg-yellow-500 text-white w-full"
              >
                Learn
              </Button>
              <Button
                onClick={handleClickForQuiz}
                className="bg-[#E98451] hover:bg-orange-500 text-white w-full disabled:opacity-50"
              >
                Practice
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
