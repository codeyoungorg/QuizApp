"use client";
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import levelCupStraight from "@/assets/Images/levelCupStraight.png";
import "@/components/home-page.css";
import { getGKQuizStats } from "@/actions/gk-quiz";

export default function QuizScore({
  quizId,
  open,
  setOpen,
  numberOfCompletedQuizData,
}: {
  quizId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  numberOfCompletedQuizData: any;
}) {
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    fetchQuizStats();
  }, [open]);

  const fetchQuizStats = async () => {
    const quiz_stats = await getGKQuizStats(quizId);

    let totalCorrect = quiz_stats.submissions?.reduce(
      (acc: any, question: any) => {
        if (question.isCorrect) {
          return acc + 1;
        }
        return acc;
      },
      0
    );
    setTotalCorrect(totalCorrect);

    const questionLength = quiz_stats.questions.length;
    setTotalQuestions(questionLength);
  };
  return (
    <div className="max-w-lg mx-auto w-full">
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogContent className="flex-col justify-center">
          <div className="level-card  flex-column items-center content-center w-full p-4 md:max-w-56">
            <div className="flex justify-center">
              <Image
                src={levelCupStraight}
                alt="level-cup"
                className="-rotate-12 h-5 w-5 mr-2"
              />
              <span className="text-[#2F4F4F] text-lg font-semibold">
                Level {numberOfCompletedQuizData.level}
              </span>
              <Image
                src={levelCupStraight}
                alt="level-cup"
                className="rotate-12 h-5 w-5 ml-2"
              />
            </div>
            <div className="mt-[1rem] flex justify-center text-[#569090] text-[48px] font-[700]">
              {totalCorrect}
            </div>
            <div className="flex justify-center text-[#569090] text-[14px] font-[500]">
              out of {totalQuestions}
            </div>
          </div>
          <Button
            className="w-full mt-2 bg-[#E98451] text-[#FFF] hover:bg-[#E98451]"
            onClick={() => setOpen(false)}
          >
            Back
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
