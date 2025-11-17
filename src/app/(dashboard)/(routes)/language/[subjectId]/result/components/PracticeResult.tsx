"use client";

import React, { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import useQuizStore from "@/store/quiz-store";
import Image from "next/image";
import { getCardIcon } from "../../../_utils";
import { Button } from "@/components/newFlow/ui/buttons";
import { ProgressSteps } from "@/components/newFlow/ui/progressStepper";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { getCookie } from "cookies-next";
import saveGTMEvents from "@/lib/gtm";
import ExitModel from "../../../../practice/_components/ExitModel";

import cardIcon from "@/public/images/icons/cards_icons_result_page.png";
import topicIcon from "@/public/images/icons/topics_icons_result_page.png";
import { HandleQuite } from "@/utils/HandleQuite";
import { stopLoader } from "@/utils/loaderUtils";
import { handleEvent } from "@/utils/handleEvent";

interface QuizResultData {
  id: string;
  user_id: string;
  language_id: string;
  level_id: string;
  topic_id: string;
  submission: Array<{
    answer: string;
    isCorrect: boolean;
    questionId: string;
  }>;
  created_at: string;
  updated_at: string;
  total: number;
  correct: number;
  card_state: number;
  points: string;
  topic: {
    id: string;
    name: string;
    levedId?: string;
    level_id: string;
  };
  totalQuestions: number;
  completedQuestions: number;
  levelTotalQuestions: number;
  levelCompletedQuestions: number;
  levelPoints: number;
  topicPoints: number;
  upcomingTopics?: Array<{
    id: string;
    name: string;
    level_id?: string;
    totalQuestions?: number;
  }>;
}

interface PracticeResultProps {
  quizResult: QuizResultData;
  lang: string;
}

export const PracticeResult: React.FC<PracticeResultProps> = ({
  quizResult,
  lang,
}) => {
  const router = useRouter();
  const [currentScore, setCurrentScore] = useState({ correct: 0, total: 0 });
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isContinueLearningClicked, setIsContinueLearningClicked] =
    useState(false);
  const { currentQuizScore } = useQuizStore();
  const userId = getCookie("userId");

  useEffect(() => {
    stopLoader();
  }, []);

  useEffect(() => {
    if (currentQuizScore) {
      setCurrentScore(currentQuizScore);
    } else {
      setCurrentScore({
        correct: quizResult?.correct || 0,
        total: quizResult?.total || 0,
      });
    }

    saveGTMEvents({
      eventAction: "test_completed",
      label: userId ? "student" : "guest",
      label1: userId?.toString() || null,
      label2: lang,
      label3: quizResult?.topic?.name || null,
      label4: null,
    });
  }, [currentQuizScore, quizResult, lang, userId]);

  const handleExitConfirm = () => {
    setIsExitModalOpen(false);
    HandleQuite(false, `/languages?lang=${lang}`, {
      returnUrl: `LanguageLearning`,
      params: {
        language: lang,
        studentId: userId,
      },
    });
  };

  const handleContinueLearning = () => {
    setIsContinueLearningClicked(true);
    HandleQuite(false, `/languages?lang=${lang}`, {
      returnUrl: `LanguageLearning`,
      params: {
        language: lang,
        studentId: userId,
      },
    });
  };

  const isLevelComplete =
    quizResult?.levelPoints ===
    quizResult?.levelTotalQuestions * parseInt(quizResult?.level_id);

  const levelPercentage =
    (quizResult?.levelPoints / quizResult?.levelTotalQuestions) * 100 || 0;
  const isLevelUnlocked = levelPercentage >= 85;

  const isAllLevelsCompleted =
    parseInt(quizResult?.level_id) == 3 && isLevelComplete;

  const getButtonText = () => {
    if (isContinueLearningClicked) {
      return "Loading...";
    }
    if (isAllLevelsCompleted) {
      return "Start Practice";
    }
    return "Continue Learning";
  };

  return (
    <div className="min-h-screen bg-white w-full">
      <div className="w-full max-w-[800px] mx-auto px-4 sm:px-6 py-8 sm:py-12 relative pb-24 md:pb-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-app-secondary flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="font-semibold text-app-text-black">
              {isAllLevelsCompleted
                ? "All levels completed!"
                : isLevelUnlocked
                ? `Level ${parseInt(quizResult?.level_id) + 1} unlocked!`
                : "Quiz completed!"}
            </h2>
          </div>

          <Button variant="secondary" onClick={() => setIsExitModalOpen(true)}>
            Exit <X />
          </Button>
        </div>

        <h1 className="text-[28px] font-bold text-app-text-black mb-8">
          You got {currentScore.correct} out of {currentScore.total} correct.
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-base font-semibold text-app-text-black mb-4">
              Current topic
            </p>
            <div className="bg-white rounded-3xl p-4 border-2 border-[#E6E6E6] shadow-sm h-[158px]">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-[20px]">
                  {getCardIcon(quizResult?.topic?.name)}
                </span>
                <h3 className="text-base font-bold text-app-text-black leading-tight">
                  {quizResult?.topic?.name}
                </h3>
              </div>

              <div className="bg-[#F8F8F8] rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-blue-600">
                  <Image src={cardIcon} alt="Topic" className="w-5 h-5" />
                  <span className="text-sm">
                    <span className="font-bold">{quizResult?.topicPoints}</span>
                    <span className="font-normal text-gray-400">
                      {" "}
                      / {quizResult?.totalQuestions} cards
                    </span>
                  </span>
                </div>

                <ProgressSteps
                  current={quizResult?.topicPoints || 0}
                  total={quizResult?.totalQuestions || 0}
                  className="w-full"
                  showSteps={false}
                  showBorder={true}
                />
              </div>
            </div>
          </div>

          <div>
            <p className="text-base font-semibold text-black mb-3">
              Current stage
            </p>
            <div className="bg-white rounded-3xl p-4 border-2 border-[#E6E6E6] shadow-sm h-[158px]">
              <div className="mb-6 flex justify-between">
                <p className="text-base font-bold text-black">Word Wizards</p>
                <h3 className="text-sm font-medium text-gray-400">
                  Stage {quizResult?.level_id}
                </h3>
              </div>

              <div className="bg-[#F8F8F8] rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-blue-600">
                  <Image src={topicIcon} alt="Topic" className="w-5 h-5" />
                  <span className="text-sm">
                    <span className="font-bold">{quizResult?.levelPoints}</span>
                    <span className="font-normal text-gray-400">
                      {" "}
                      / {quizResult?.levelTotalQuestions} cards
                    </span>
                  </span>
                </div>

                <ProgressSteps
                  current={quizResult?.levelPoints || 0}
                  total={quizResult?.levelTotalQuestions || 0}
                  className="w-full"
                  showSteps={false}
                />
              </div>
            </div>
          </div>
        </div>

        {quizResult?.upcomingTopics && quizResult.upcomingTopics.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-bold text-black mb-5">
              Upcoming topics for you
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quizResult?.upcomingTopics?.map((topic: any) => (
                <div
                  key={topic.id}
                  className="bg-white rounded-2xl p-5 border-2 border-[#E6E6E6] cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    handleEvent(
                      "lang_practice_started",
                      "When languge learning practice is started"
                    );
                    router.push(
                      `/language/${lang}/practice?topic=${
                        topic.id
                      }&from=1&to=5&level=${
                        topic.level_id || quizResult?.level_id
                      }`
                    );
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-5 h-5 flex items-center justify-center">
                      {getCardIcon(topic.name)}
                    </span>
                    <h4 className="text-base font-bold text-black">
                      {topic.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <Image src={cardIcon} alt="Topic" className="w-5 h-5" />
                    <span className="text-sm font-semibold">
                      <span className="font-bold text-app-text-black">
                        {topic.totalQuestions || 0}
                      </span>{" "}
                      <span className="font-semibold text-app-text-grey">
                        cards
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="fixed md:relative bottom-0 left-0 right-0 md:left-auto md:right-auto bg-white border-t md:border-t-0 border-gray-200 p-4 md:p-0 md:mt-8 z-10">
          <div className="w-full max-w-[800px] mx-auto">
            <Button
              variant="primary"
              className="flex justify-between w-full"
              disabled={false}
              onClick={handleContinueLearning}
            >
              <span>{getButtonText()}</span>
              {isContinueLearningClicked ? (
                <Loader2 className="w-5 h-5" />
              ) : (
                <ArrowCircleRightIcon />
              )}
            </Button>
          </div>
        </div>

        <ExitModel
          isOpen={isExitModalOpen}
          onClose={() => setIsExitModalOpen(false)}
          onConfirm={handleExitConfirm}
        />
      </div>
    </div>
  );
};
