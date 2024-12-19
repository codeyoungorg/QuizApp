"use client";

import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ExplainationPopover from "./explaination-popover";

export default function OptionsBox({
  options,
  handleNext,
  completedQuestion,
  question,
  answer,
  hasEnded,
  user,
  subjectName,
  topic,
}: {
  options: any;
  handleNext: any;
  completedQuestion: any;
  question: string;
  answer: string;
  hasEnded: boolean;
  user: {
    name: string;
    grade: number;
    id: string;
  };
  subjectName: string;
  topic: string | null;
}) {
  const handleOptionClick = (index: number) => {
    if (completedQuestion) {
      return;
    }
    handleNext(index);
  };

  const alphabet = ["A", "B", "C", "D"];

  return (
    <div className="space-y-2 mt-2">
      <div className="grid grid-cols-2 gap-2">
        {options.map((option: any, i: number) => {
          const isSelected = completedQuestion?.selected.text === option.text;
          const showCorrect =
            hasEnded && isSelected && option.correct === "true";
          const showIncorrect =
            hasEnded && isSelected && option.correct === "false";
          return (
            <button
              type="button"
              key={i}
              onClick={() => handleOptionClick(i)}
              className={cn(
                "flex relative items-center gap-2 p-2 rounded-lg border-2 font-medium text-sm leading-5 border-[#DAE7E7] text-[#5B8989] bg-[#F9FBFB] cursor-pointer transition-all",
                showCorrect
                  ? "bg-[#70C29C] text-[#FFF]"
                  : showIncorrect
                  ? "bg-[#E88272] text-[#FFF]"
                  : isSelected
                  ? "bg-gray-200"
                  : ""
              )}
            >
              <div
                className={cn(
                  "rounded-full shrink-0 bg-[#E6EFEF] w-6 h-6 flex items-center justify-center text-sm font-semibold",
                  showCorrect
                    ? "bg-[#9BD4B6] text-[#FFF]"
                    : showIncorrect
                    ? "bg-[#F1B1A7] text-[#FFF]"
                    : ""
                )}
              >
                {showCorrect ? (
                  <DoneOutlinedIcon fontSize="small" />
                ) : showIncorrect ? (
                  <CloseOutlinedIcon fontSize="small" />
                ) : (
                  alphabet[i]
                )}
              </div>
              <p className="text-sm">{option.text}</p>
              {showIncorrect && (
                <ExplainationPopover
                  question={question}
                  answer={answer}
                  user={user}
                  subjectName={subjectName}
                  topic={topic}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
