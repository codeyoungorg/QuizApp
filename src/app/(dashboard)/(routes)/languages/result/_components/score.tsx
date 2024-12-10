"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import NoahImage from "@/assets/Images/noah_doubt_solve_dp.svg";
import Link from "next/link";
import { LanguageQuizResult } from "../../learn/_types";
import { getCardIcon } from "../../_utils";
import { useState, useEffect } from "react";
import useQuizStore from "@/store/quiz-store";
import NoahStarImage from "@/public/images/icons/noah-lang-stars.svg";
import NoahStarCompleteImage from "@/public/images/icons/noah-lang-stars-completed.svg";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import { getCookie } from "cookies-next";
import saveGTMEvents from "@/lib/gtm";

export default function ScoreCard({
  quizResult,
  lang,
}: {
  lang: string;
  quizResult: LanguageQuizResult & {
    totalQuestions: number;
    completedQuestions: number;
    levelTotalQuestions: number;
    levelCompletedQuestions: number;
    levelPoints: number;
    topicPoints: number;
  };
}) {
  const [currentScore, setCurrentScore] = useState({ correct: 0, total: 0 });
  const { currentQuizScore } = useQuizStore();
  const userId = getCookie("userId");
  useEffect(() => {
    if (currentQuizScore) {
      setCurrentScore(currentQuizScore);
    } else {
      const currentQuizPoints = quizResult?.correct * quizResult?.level_id;
      setCurrentScore({ correct: currentQuizPoints, total: quizResult?.total });
    }
    saveGTMEvents({
      eventAction: "test_completed",
      label: userId?"student":"guest",
      label1: userId?.toString() || null,
      label2: lang,
      label3:quizResult?.languages_topics?.name as string || null ,
      label4: null,
    });
  }, [currentQuizScore, quizResult]);

  // Calculate if level is unlocked (85% or more)
  const levelPercentage =
    (quizResult?.levelPoints / quizResult?.levelTotalQuestions) * 100;
  const isLevelUnlocked = levelPercentage >= 85;

  const isPointsComplete =
    quizResult?.topicPoints ===
    quizResult?.totalQuestions * quizResult.level_id;

  const isLevelComplete =
    quizResult?.levelPoints ===
    quizResult?.levelTotalQuestions * quizResult.level_id;

  // Add check for level 3 completion
  const isAllLevelsCompleted = quizResult.level_id == 3 && isLevelComplete;
  

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card
        className="mb-6 rounded-2xl"
        style={{
          boxShadow: "0px 0px 8px 0px #0053F429",
          background:
            "linear-gradient(133.16deg, #FCF7ED -0.38%, #FDF2F9 100%)",
        }}
      >
        <CardContent className="flex flex-col-reverse md:flex-row gap-2 items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <Image
              src={
                isAllLevelsCompleted
                  ? NoahStarCompleteImage
                  : isLevelUnlocked
                  ? NoahStarImage
                  : NoahImage
              }
              alt="Robot avatar"
              width={90}
              height={90}
              className="shrink-0"
            />
            <div className="flex flex-col gap-1">
              {isAllLevelsCompleted ? (
                <p className="text-base font-medium mb-2 text-[#6C9D9D]">
                  Awesome! You have{" "}
                  <span
                    className="font-bold"
                    style={{
                      background:
                        "linear-gradient(99.36deg, #E873D1 37.68%, #FDB321 83.96%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    completed all levels.
                  </span>
                  <br /> Let's check how much Hindi do you remember!
                </p>
              ) : isLevelUnlocked ? (
                <p className="text-[#6C9D9D] text-base font-medium mb-2">
                  Awesome! You have unlocked{" "}
                  <span className="font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#E561CB] to-[#FDB321]">
                    "Level {quizResult?.level_id + 1}"
                  </span>
                </p>
              ) : (
                <p className="text-[#6C9D9D] text-base font-medium mb-2">
                  Keep learning and unlock levels
                </p>
              )}
              <Link href={`/languages?lang=${lang}`}>
                <Button className="bg-[#EB9B3A] hover:bg-orange-500 text-white h-12 px-6">
                  {isAllLevelsCompleted
                    ? "Start Practice"
                    : "Continue Learning"}
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="text-[#569090] bg-white/60 p-4 grid place-items-center rounded-lg">
            <p className="mb-1">Your Score</p>
            <p className="text-4xl font-bold">
              {currentScore.correct}
              <span className="text-xl">/{currentScore.total}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card
          className="bg-[#F5F9FF] rounded-2xl"
          style={{
            boxShadow: "0px 0px 8px 0px #0053F429",
          }}
        >
          <CardHeader>
            <h4 className="text-sm font-semibold mb-2 text-[#A3A3A3]">
              CURRENT TOPIC
            </h4>
            <CardTitle className="text-xl font-semibold text-[#517B7B]">
              <span className="mr-2">
                {getCardIcon(quizResult?.languages_topics?.name as string)}
              </span>
              {quizResult?.languages_topics?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress
              value={
                (quizResult?.topicPoints / quizResult?.totalQuestions) * 100
              }
              className={"mb-4 rounded-full h-3"}
              style={{
                background:
                  "linear-gradient(316.81deg, #FFE7D6 -21.21%, #FFECD6 123.06%)",
              }}
              bg={
                isPointsComplete
                  ? "linear-gradient(315.14deg, #7EC8A1 0%, #7EC8A6 100%)"
                  : "linear-gradient(316.81deg, #FF9147 -21.21%, #FFBC70 123.06%)"
              }
              round="100px"
            />
            <p
              className={cn(
                "text-base font-medium",
                isPointsComplete ? "text-[#4EB487]" : "text-[#A3A3A3]"
              )}
            >
              {quizResult?.topicPoints} points out of{" "}
              {quizResult?.totalQuestions} flash cards
            </p>
          </CardContent>
        </Card>

        <Card
          className="bg-[#F5F9FF] rounded-2xl"
          style={{
            boxShadow: "0px 0px 8px 0px #0053F429",
          }}
        >
          <CardHeader>
            <h4 className="text-sm font-semibold mb-2 text-[#A3A3A3]">
              CURRENT LEVEL
            </h4>
            <CardTitle className="text-xl font-semibold text-[#517B7B]">
              <span className="mr-2">🏆</span>
              Level {quizResult?.level_id}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress
              value={
                (quizResult?.levelPoints / quizResult?.levelTotalQuestions) *
                100
              }
              className="mb-4 rounded-full h-3"
              style={{
                background:
                  "linear-gradient(316.81deg, #FFE7D6 -21.21%, #FFECD6 123.06%)",
              }}
              bg={
                isLevelComplete
                  ? "linear-gradient(315.14deg, #7EC8A1 0%, #7EC8A6 100%)"
                  : "linear-gradient(316.81deg, #FF9147 -21.21%, #FFBC70 123.06%)"
              }
              round="100px"
            />
            <p
              className={cn(
                "text-base font-medium",
                isLevelComplete ? "text-[#4EB487]" : "text-[#A3A3A3]"
              )}
            >
              {quizResult?.levelPoints} points out of{" "}
              {quizResult?.levelTotalQuestions} flash cards
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
