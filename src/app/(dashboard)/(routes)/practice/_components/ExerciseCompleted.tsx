import { Button } from "@/components/newFlow/ui/buttons";
import classNames from "clsx";
import { X } from "lucide-react";
import BlueTick from "@/assets/Images/selected_option.svg";
import Image from "next/image";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

import coinImage from "@/assets/Images/coin.png";
import badgeImg from "@/assets/Images/badge.png";
import goldBadgeImg from "@/assets/Images/gold_badge.png";
import silverBadgeImg from "@/assets/Images/silver_badge.png";
import bronzeBadgeImg from "@/assets/Images/bronze_badge.png";

import { ProgressSteps } from "@/components/newFlow/ui/progressStepper";
import SquareArrowLeft from "@/assets/Images/squareArrowLeft.svg";
import { SubmissionType } from "@/types/quiz.types";
import { useExitBtn } from "../useExitBtn";

type ExerciseCompletedProps = {
  setIsReviewQuiz: (review: boolean) => void;
  setIsShowScore: (show: boolean) => void;
  submissions: SubmissionType[];
  resetQuiz: () => void;
  quizSummaryData: any;
  topic: string;
};

export const ExerciseCompleted = ({
  setIsReviewQuiz,
  setIsShowScore,
  submissions,
  resetQuiz,
  quizSummaryData,
  topic,
}: ExerciseCompletedProps) => {
  const totalCorrectCount = submissions.filter(
    (submission) => submission.isCorrect
  ).length;

  const { handleExit } = useExitBtn();

  const badge = quizSummaryData?.summary?.badge;

  return (
    <section className="max-w-[400px] h-full mx-auto flex flex-col items-center">
      <Button
        variant="secondary"
        className="ml-auto mt-4 mb-14 sm:mb-0 flex relative sm:-right-20"
        onClick={handleExit}
      >
        Exit <X />
      </Button>

      <div className="flex flex-col items-center w-full">
        <div className="flex gap-1">
          <Image src={BlueTick} alt="Selected" className="h-5 w-5" /> Practice
          Completed
        </div>

        <div>
          <p className="text-[#FF7F00] font-semibold text-2xl my-5 text-center">
            +{totalCorrectCount} points
          </p>

          <Button variant="secondary" className="text-sm">
            {totalCorrectCount}/{submissions.length} answers were correct
          </Button>
        </div>

        <div className="w-full max-w-[400px] mt-12 border-[2px] border-[#E6E6E6] shadow-[0px_8px_16px_0px_#00000014] p-4 pb-7 rounded-[20px]">
          <div className="flex justify-between">
            <p className="text-app-text-black font-bold">{topic}</p>
            <div className="flex gap-2">
              <Image
                src={bronzeBadgeImg}
                alt="Bronze Badge"
                className={classNames(
                  "w-5 h-5",
                  badge === null && "mix-blend-luminosity"
                )}
              />
              <Image
                src={silverBadgeImg}
                alt="Silver Badge"
                className={classNames(
                  "w-5 h-5",
                  badge < 27 && "mix-blend-luminosity"
                )}
              />
              <Image
                src={goldBadgeImg}
                alt="Gold Badge"
                className={classNames(
                  "w-5 h-5",
                  badge < 28 && "mix-blend-luminosity"
                )}
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex gap-1 text-sm mb-3">
              <Image src={coinImage} alt="Coin" className="w-5 h-5" />
              <span className="font-bold text-app-text-black">
                {quizSummaryData?.summary?.correct || 0}/
                {quizSummaryData?.summary?.available || 0}
              </span>
              <span className="font-semibold text-app-text-grey">
                points scored
              </span>
            </div>
            <ProgressSteps
              total={quizSummaryData?.summary?.available || 0}
              current={quizSummaryData?.summary?.correct || 0}
              showSteps={false}
              className="border border-app-tertiary rounded-full h-[10px]"
            />
          </div>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-5 w-full mb-5 sm:mb-10">
        <Button
          variant="unstyled"
          className="border-[2px] border-[#E6E6E6] shadow-[0px_8px_16px_0px_#00000014] rounded-[14px] p-4 text-app-text-black font-bold active:scale-[0.99]"
          onClick={() => {
            setIsReviewQuiz(true);
            setIsShowScore(false);
          }}
        >
          <Image
            src={SquareArrowLeft}
            alt="Review my answers"
            className="w-5 h-5 inline-block mr-1"
          />
          Review my answers
        </Button>
        <Button
          variant="primary"
          className="flex justify-between w-full max-w-[392px] sm:mx-auto"
          onClick={() => {
            resetQuiz();
          }}
        >
          <span>Practice more</span>
          <ArrowCircleRightIcon />
        </Button>
      </div>
    </section>
  );
};
