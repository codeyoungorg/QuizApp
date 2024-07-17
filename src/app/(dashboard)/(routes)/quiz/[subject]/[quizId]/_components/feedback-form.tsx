"use client";

import { feedbackQuiz } from "@/actions/quiz.client";
import { cn } from "@/lib/utils";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import FeedBackPopup from "./feedback-popup";
import saveGTMEvents from "@/lib/gtm";

export default function FeedBackForm({
  questionId,
  user,
  subjectName,
  topic,
}: {
  questionId: string;
  user: {
    name: string;
    grade: number;
    id: string;
  };
  subjectName: string;
  topic: string | null;
}) {
  const [response, setResponse] = useState<string | null>(null);
  const [feedbackDone, setFeedbackDone] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);

  const handleClickOpen = () => {
    saveGTMEvents({
      eventAction: "feedback_selected",
      label: "student",
      label1: user?.id,
      label2: subjectName,
      label3: topic ? "Topic" : "Noah",
      label4: null,
    });
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleResponse = async (res: string) => {
    setResponse(res);
    // if (res === "good") {
    //   submitFeedback(res, null);
    // }
  };

  const reasons = [
    {
      id: 1,
      text:
        response === "good"
          ? "This question was challenging"
          : "This question is difficult",
    },
    {
      id: 2,
      text:
        response === "good"
          ? "This question was easy"
          : "This question is too easy",
    },
    {
      id: 3,
      text:
        response === "good"
          ? "The question was relevant"
          : "The answers are incorrect",
    },
    {
      id: 4,
      text: response === "good" ? "" : "The answers does not make sense",
    },
    {
      id: 5,
      text: response === "good" ? "" : "This question is not relevant for me",
    },
  ];
  const handleReason = (reasonId: number) => {
    const reason = reasons[reasonId - 1].text;
    submitFeedback(response, reason);
  };

  const submitFeedback = async (res: string | null, reason: string | null) => {
    const userId = user.id;
    if (!userId) return;
    saveGTMEvents({
      eventAction: "feedback_submitted",
      label: "student",
      label1: user?.id,
      label2: subjectName,
      label3: topic ? "Topic" : "Noah",
      label4: null,
    });
    setLoader(true);
    await feedbackQuiz({
      questionId: questionId,
      userId: userId,
      reason: reason,
      response: res as string,
    });
    setFeedbackDone(true);
    setLoader(false);
  };

  const showOptions = response === "bad" || response === "good";

  if (feedbackDone) return;
  return (
    <div className="py-2 space-y-2">
      <div className="flex gap-x-2 items-center">
        <ThumbsUp
          onClick={() => {
            handleClickOpen();
            handleResponse("good");
          }}
          className={cn(
            "stroke-slate-500 w-4 h-4 hover:fill-slate-300 cursor-pointer",
            response === "good" && "fill-slate-300"
          )}
        />
        <ThumbsDown
          onClick={() => {
            handleClickOpen();
            handleResponse("bad");
          }}
          className={cn(
            "stroke-slate-500 w-4 h-4 hover:fill-slate-300 cursor-pointer",
            response === "bad" && "fill-slate-300"
          )}
        />
      </div>
      {open && (
        <FeedBackPopup
          open={open}
          handleClickOpen={handleClickOpen}
          handleClose={handleClose}
          showOptions={showOptions}
          reasons={reasons}
          handleReason={handleReason}
          responses={response}
          loader={loader}
        />
      )}
    </div>
  );
}
