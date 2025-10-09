import { feedbackGKQuiz } from "@/actions/gk-quiz";
import { Button } from "@/components/newFlow/ui/buttons";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import saveGTMEvents from "@/lib/gtm";
import { SuccessToast } from "@/utils/getToast";
import classNames from "clsx";
import { useState } from "react";

const reasons = {
  good: [
    "Explanation is Clear and Concise",
    "Question is Clear and Challenging",
    "Correct Difficulty Level",
    "Question is Thought-Provoking",
  ],
  bad: [
    "Incorrect Answer",
    "Multiple Correct Answers",
    "Missing Correct Answer",
    "Question Ambiguity / Incorrect",
  ],
};

export const FeedbackModel = ({
  feedbackType,
  setFeedbackType,
  feedbackData,
}: {
  feedbackType: "good" | "bad" | null;
  setFeedbackType: (type: "good" | "bad" | null) => void;
  feedbackData: {
    questionId: string;
    userId: string;
  };
}) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [loader, setLoader] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (selectedReason) {
      try {
        await submitFeedback(feedbackType, selectedReason);
      } catch (error) {
        console.error("Error submitting feedback:", error);
      }
      SuccessToast("Thanks for sharing your feedback");
      setFeedbackType(null);
    }
  };

  const submitFeedback = async (res: string | null, reason: string | null) => {
    const userId = feedbackData.userId;
    if (!userId) return;
    saveGTMEvents({
      eventAction: "feedback_submitted",
      label: "student",
      label1: userId,
      label2: "general",
      label3: "Noah",
      label4: null,
    });
    setLoader(true);
    await feedbackGKQuiz({
      questionId: feedbackData.questionId,
      userId: userId,
      reason: reason,
      response: res as string,
    });
    setFeedbackType(null);
    setLoader(false);
  };

  return (
    <Dialog open={!!feedbackType} onOpenChange={() => setFeedbackType(null)}>
      <DialogContent className="max-w-[90%] sm:max-w-[400px] px-4 py-6 rounded-[16px]">
        <DialogHeader>
          <DialogTitle className="text-app-text-black text-left md:text-[20px]">
            {feedbackType === "good"
              ? "Why did you like this?"
              : "Tell us what went wrong"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-5 mb-8">
          {reasons[feedbackType || "good"].map((reason) => (
            <Button
              key={reason}
              variant="unstyled"
              className={classNames(
                "w-full font-semibold max-w-[353px] h-[56px] p-4 border-[2px] border-[#E6E6E6] rounded-[16px] text-sm md:text-[16px] text-app-text-black",
                {
                  "border-[2px] border-[#0055FF]": selectedReason === reason,
                }
              )}
              onClick={() =>
                setSelectedReason(selectedReason === reason ? null : reason)
              }
            >
              {reason}
            </Button>
          ))}
        </div>
        <DialogFooter>
          <Button
            variant="primary"
            className="justify-center w-full"
            disabled={!selectedReason || loader}
            onClick={handleSubmit}
          >
            {loader ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
