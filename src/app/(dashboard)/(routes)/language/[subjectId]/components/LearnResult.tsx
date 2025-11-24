"use client";
import { Button } from "@/components/newFlow/ui/buttons";
import { Check, X, Loader2 } from "lucide-react";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ExitModel from "../../../practice/_components/ExitModel";
import { useState } from "react";
import { HandleQuite } from "@/utils/HandleQuite";

interface LearnResultProps {
  correct: number;
  total: number;
  onTakeQuiz: () => void;
}

export const LearnResult = ({
  correct,
  total,
  onTakeQuiz,
}: LearnResultProps) => {
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isTakeQuizClicked, setIsTakeQuizClicked] = useState(false);

  const handleExit = () => {
    HandleQuite();
    setIsExitModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-between h-full p-6 max-w-[600px] mx-auto">
      <div className="w-full">
        <div className="w-full flex justify-end mb-4">
          <Button variant="secondary" onClick={() => setIsExitModalOpen(true)}>
            Exit <X />
          </Button>
        </div>

        <div className="w-full flex flex-col md:items-center mt-8">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-5 h-5 rounded-full bg-[#0055FF] flex items-center justify-center">
              <Check className="h-3 w-3 text-white" />
            </div>
            <span className="text-lg font-semibold text-app-text-black">
              Learning complete!
            </span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            {Array.from({ length: total }).map((_, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index < correct ? "bg-[#008000]" : "bg-gray-300"
                }`}
              >
                {index < correct ? (
                  <Check className="h-5 w-5 text-white" />
                ) : (
                  <X className="h-5 w-5 text-white" />
                )}
              </div>
            ))}
          </div>

          {/* Based on current implementation the total is always equal to the correct */}
          {/* Reason: user can not go to next question if the answer is incorrect */}
          <h2 className="text-2xl font-bold text-app-text-black mb-4">
            You got {total} out of {total} correct.
          </h2>

          <p className="text-base text-app-text-grey md:text-center">
            Next, take a quiz to reinforce what you've just learned!
          </p>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4 mb-6">
        <Button
          variant="primary"
          size="full"
          onClick={() => {
            setIsTakeQuizClicked(true);
            onTakeQuiz();
          }}
          className="flex justify-between items-center"
        >
          <span>{isTakeQuizClicked ? "Loading..." : "Take the quiz"}</span>
          {isTakeQuizClicked ? <Loader2 className="animate-spin" /> : <ArrowCircleRightIcon />}
        </Button>
      </div>

      <ExitModel
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onConfirm={handleExit}
      />
    </div>
  );
};
