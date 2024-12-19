"use client";

import { cn } from "@/lib/utils";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import FeedBackPopup from "./feedback-popup";
import { feedbackGKQuiz } from "@/actions/gk-quiz";
import saveGTMEvents from "@/lib/gtm";

export default function FeedBackForm({
  questionId,
  user,
}: {
  questionId: string;
  user: {
    name: string;
    grade: number;
    id: string;
  };
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
      label2: "general",
      label3: "Noah",
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
          ? "Explanation is Clear and Concise"
          : "Incorrect Answer",
    },
    {
      id: 2,
      text:
        response === "good"
          ? "Question is Clear and Challenging"
          : "Multiple Correct Answers",
    },
    {
      id: 3,
      text:
        response === "good"
          ? "Correct Difficulty Level"
          : "Missing Correct Answer",
    },
    {
      id: 4,
      text:
        response === "good"
          ? "Question is Thought-Provoking"
          : "Question Ambiguity / Incorrect",
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
      label2: "general",
      label3: "Noah",
      label4: null,
    });
    setLoader(true);
    await feedbackGKQuiz({
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
