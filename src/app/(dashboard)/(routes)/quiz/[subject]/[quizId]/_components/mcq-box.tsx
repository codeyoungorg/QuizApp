"use client";

import OptionsBox from "./options-box";
import QuestionBox from "./question-box";
import Image from "next/image";
import botIcon from "@/assets/Images/noah_dp.svg";
import FeedBackForm from "./feedback-form";
export default function MCQBox({
  currentQuestion,
  handleNext,
  submissions,
  questionIndex,
  user,
  hasEnded,
  subjectName,
  topic,
}: {
  currentQuestion: any;
  handleNext: any;
  submissions: any;
  questionIndex: number;
  user: {
    name: string;
    grade: number;
    id: string;
  };
  hasEnded: boolean;
  explanation: string;
  subjectName: string;
  topic: string | null;
}) {
  const correctAnswer = currentQuestion?.options.find(
    (option: any) => option.correct == "true"
  )?.text;

  const completedQuestion = submissions.find(
    (option: any) =>
      option.questionId === currentQuestion?.uuid &&
      submissions.length !== questionIndex - 1
  );
  return (
    <div className="max-w-3xl my-2 flex items-start w-full gap-x-2">
      <div className=" w-10 h-10 rounded-full grid place-items-center">
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
          hasEnded={hasEnded}
          user={user}
          subjectName={subjectName}
          topic={topic}
        />
        <FeedBackForm
          questionId={currentQuestion?.uuid}
          user={user}
          subjectName={subjectName}
          topic={topic}
        />
      </div>
    </div>
  );
}
