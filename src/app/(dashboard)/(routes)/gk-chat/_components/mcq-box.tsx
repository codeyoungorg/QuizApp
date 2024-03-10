"use client";

import { Bot } from "lucide-react";
import OptionsBox from "./options-box";
import QuestionBox from "./question-box";
import Image from "next/image";
import botIcon from "@/assets/Images/botIcon.svg";
import ExplainationPopover from "./explaination-popover";
import FeedBackForm from "./feedback-form";
export default function MCQBox({
  currentQuestion,
  handleNext,
  submissions,
  questionIndex,
}: {
  currentQuestion: any;
  handleNext: any;
  submissions: any;
  questionIndex: number;
}) {
  const correctAnswer = JSON.parse(currentQuestion?.options).find(
    (option: any) => option.correct == "true"
  )?.text;

  const completedQuestion = submissions.find(
    (option: any) => option.questionId === currentQuestion?.uuid
  );
  return (
    <div className="max-w-3xl my-2 flex items-start w-full gap-x-2">
      <div className="bg-orange-300 w-10 h-10 rounded-full grid place-items-center">
        <Image src={botIcon} alt="bot" className="stroke-white" />
      </div>
      <div className="flex-1 relative">
        <QuestionBox
          question={currentQuestion?.question}
          questionIndex={questionIndex}
        />
        <OptionsBox
          options={currentQuestion?.options}
          handleNext={handleNext}
          completedQuestion={completedQuestion}
          question={currentQuestion?.question}
          answer={correctAnswer}
        />
        {!completedQuestion && (
          <FeedBackForm questionId={currentQuestion?.uuid} />
        )}
      </div>
    </div>
  );
}
