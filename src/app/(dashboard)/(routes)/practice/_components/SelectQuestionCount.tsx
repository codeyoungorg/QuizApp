import { Button } from "@/components/newFlow/ui/buttons";
import classNames from "clsx";
import { X } from "lucide-react";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import Image from "next/image";
import coinImage from "@/assets/Images/coin.png";
import { useExitBtn } from "../useExitBtn";

type SelectQuestionCountProps = {
  quizTopic: string | null;
  questionCount: number | null;
  setQuestionCount: (count: number | null) => void;
  onStartPractice: () => void;
  quizLoading: boolean;
};

export const SelectQuestionCount = ({
  quizTopic,
  questionCount,
  setQuestionCount,
  onStartPractice,
  quizLoading,
}: SelectQuestionCountProps) => {
  const { handleExit } = useExitBtn();
  return (
    <section className="max-w-[650px] h-full mx-auto flex flex-col">
      <Button
        variant="secondary"
        className="ml-auto mt-4 mb-14 flex self-end"
        onClick={handleExit}
      >
        Exit <X />
      </Button>
      <div className="sm:text-center mb-5">
        <p className="text-[28px] font-bold mb-10">{quizTopic}</p>
        <p className="text-lg font-semibold">
          How many questions you want to practice?
        </p>
      </div>
      <div className="flex sm:justify-center items-center gap-4 flex-wrap">
        {[5, 10].map((count) => (
          <Button
            key={count}
            variant="unstyled"
            className={classNames(
              "w-full max-w-[353px] h-[56px] p-4 border border-[#E6E6E6] rounded-[16px] text-app-text-black",
              {
                "border-[2px] border-[#0055FF]": questionCount === count,
              }
            )}
            onClick={() =>
              setQuestionCount(questionCount === count ? null : count)
            }
          >
            {count}
          </Button>
        ))}
      </div>

      <div className="mt-auto">
        <div className="flex gap-2 items-center my-[26px] w-fit mx-auto font-semibold text-app-text-grey">
          <Image src={coinImage} alt="Coin" className="w-5 h-5" />
          Earn 1 point for each correct answer
        </div>
        <Button
          variant="primary"
          className="flex justify-between w-full sm:max-w-[392px] sm:mx-auto"
          disabled={!questionCount || quizLoading}
          onClick={onStartPractice}
        >
          <span>{quizLoading ? "Loading..." : "Start Practice"}</span>{" "}
          <ArrowCircleRightIcon />
        </Button>
      </div>
    </section>
  );
};
