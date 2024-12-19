"use client";

import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import botIcon from "@/assets/Images/noah_dp.svg";
import Image from "next/image";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { BadgeInfo } from "lucide-react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { generateQuiz, getQuestions, updateQuiz } from "@/actions/quiz.client";

if (typeof window !== "undefined") {
}

export function InitialChatMessage({
  setStart,
  started,
  user,
  setQuestionList,
  quizId,
  setQuizTopic,
  assignStatus,
  setTopicId,
  subjectId,
}: {
  setStart: Dispatch<SetStateAction<boolean>>;
  started: boolean;
  user: { name: string; grade: number; id: string };
  setQuestionList: Dispatch<SetStateAction<any[]>>;
  quizId: string;
  setQuizTopic: Dispatch<SetStateAction<string | null>>;
  assignStatus: boolean;
  setTopicId: Dispatch<SetStateAction<number | null>>;
  subjectId: number;
}) {
  const [loading, setLoading] = useState(false);

  const getTopicByMentor = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SANDBOX_API}/noah/topic/assigned?studentId=${user.id}}&subjectId=${subjectId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (!!data.topic) return data;
      return null;
    } catch (error) {
      console.log(error);
    }
  };

  const quizOnRandomTopic = async () => {
    try {
      setLoading(true);
      const { questions, topicName, topicId } = await getQuestions({
        user_grade: user.grade!,
        userId: user.id,
        subjectId,
      });
      setQuestionList(questions);
      setQuizTopic(topicName);
      setTopicId(topicId);
      setStart(true);
      await updateQuiz({
        userId: user.id,
        questions,
        topicId,
        quizId,
        grade: user.grade!,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const quizOnMentorTopic = async () => {
    try {
      setLoading(true);
      const assignedData = await getTopicByMentor();

      const { questions, topicName, topicId } = await getQuestions({
        user_grade: user.grade!,
        userId: user.id,
        selectedTopic: assignedData,
        subjectId,
      });
      setQuestionList(questions);
      setQuizTopic(topicName);
      setTopicId(topicId);
      setStart(true);
      await updateQuiz({
        userId: user.id,
        questions,
        topicId: topicId,
        quizId: quizId,
        grade: user.grade!,
        assignedData,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-3xl w-full space-y-3">
      <div className="flex items-start gap-x-2">
        <div className=" w-10 h-10 rounded-full grid place-items-center">
          <Image src={botIcon} alt="bot" className="stroke-white" />
        </div>
        <div className="flex-1 ">
          <div className="border-2 font-medium text-sm leading-5 border-[#DAE7E7] text-[#5B8989] bg-[#F9FBFB] p-4 rounded-lg rounded-ss-none">
            <div>
              <p className="text-sm py-0.5">{user && `Hello ${user.name}!`}</p>
              <p className="mt-2">
                Hope you are having a great day! Lets start the quiz with by
                going ahead with one of the available options.
              </p>
            </div>
          </div>
        </div>
      </div>
      {started ? null : (
        <div className="pl-12 grid gap-3">
          {assignStatus && (
            <Button
              onClick={quizOnMentorTopic}
              disabled={loading}
              className="justify-start max-w-sm border-2 border-[#fde8d8] text-[#e9834e] bg-[#fef3ec] hover:bg-[#fef3ec] p-4 rounded-sm"
            >
              <span>Start with topic chosen by your teacher</span>
            </Button>
          )}

          <Button
            className="justify-start max-w-sm border-2 border-[#fde8d8] text-[#e9834e] bg-[#fef3ec] hover:bg-[#fef3ec] p-4 rounded-sm"
            onClick={quizOnRandomTopic}
            disabled={loading}
          >
            <span>Start a random topic quiz based on your skill</span>
          </Button>
        </div>
      )}
    </div>
  );
}

export function EndChatMessage({
  user,
  startNewQuiz,
  endQuiz,
  loader,
  score,
  questionsLength,
  subjectId,
  topicId,
}: {
  user: { name: string; grade: number; id: string };
  startNewQuiz: any;
  endQuiz: any;
  loader: boolean;
  score: number;
  questionsLength: number;
  subjectId: number;
  topicId: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const subjectName = pathname.split("/")[2];
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  const redirectPathParam = pathname.includes("science")
    ? "science"
    : pathname.includes("english")
    ? "english"
    : "mathematics";

  const startQuizWithSameTopic = async () => {
    try {
      setGeneratingQuiz(true);
      let grade = user.grade;

      if (subjectName === "science" && user.grade < 3) {
        grade = 3;
      }

      const data = await generateQuiz({
        grade: grade,
        start: true,
        subjectId,
        topicId,
        userId: user.id,
      });

      if (!data) {
        console.log("Error in generating quiz");
        return;
      }

      router.push(`/quiz/${subjectName}/${data.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setGeneratingQuiz(false);
    }
  };

  return (
    <div className="max-w-3xl my-2 flex items-start w-full gap-x-2">
      <div className=" w-10 h-10 rounded-full grid place-items-center">
        <Image src={botIcon} alt="bot" className="stroke-white" />
      </div>
      <div className="w-full">
        <div className="flex flex-col gap-y-4 justify-between border-2 font-medium text-sm leading-5 border-[#DAE7E7] text-[#5B8989] bg-[#F9FBFB] p-4 rounded-lg rounded-ss-none">
          <p className="text-sm py-0.5">Great work {user.name}!</p>
          <p>
            Your have scored '{score}' from out of {questionsLength}
          </p>
          <p>
            The correct and wrong answers are highlighted above. You can click
            on the{" "}
            <div className="inline-block p-0.5 -mb-1 mr-1 rounded-full place-items-center bg-orange-300">
              <BadgeInfo className="text-white" size={16} />
            </div>
            icon for the wrong answers to see the explanation.
          </p>
          <div className="flex flex-col md:flex-row gap-2">
            <Button
              className="min-w-[164px] border-2 border-[#E98451] bg-transparent text-[#E98451] hover:bg-transparent"
              onClick={() => startNewQuiz()}
            >
              Start New Quiz{" "}
              {loader ? (
                <CircularProgress color="inherit" size={25} className="ml-2" />
              ) : (
                <EastOutlinedIcon className="ml-[0.5rem]" fontSize="small" />
              )}
            </Button>
            <Button
              className="min-w-[164px] border-2 border-[#E98451] bg-transparent text-[#E98451] hover:bg-transparent"
              onClick={() => startQuizWithSameTopic()}
            >
              Start Quiz with Same Topic
              {generatingQuiz ? (
                <CircularProgress color="inherit" size={25} className="ml-2" />
              ) : (
                <EastOutlinedIcon className="ml-[0.5rem]" fontSize="small" />
              )}
            </Button>
            <Button
              className="min-w-[164px] border-2 border-[#E98451] bg-transparent text-[#E98451] hover:bg-transparent"
              onClick={() => endQuiz(redirectPathParam)}
            >
              End Quiz & Exit{" "}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TopicMessage({
  topic,
  questionsLength,
}: {
  topic: string;
  questionsLength: number;
}) {
  const params = useSearchParams();
  return (
    <div className="max-w-3xl w-full space-y-3 my-2">
      <div className="flex items-start gap-x-2">
        <div className=" w-10 h-10 rounded-full grid place-items-center">
          <Image src={botIcon} alt="bot" className="stroke-white" />
        </div>
        <div className="flex-1 ">
          <div className="border-2 font-medium text-sm leading-5 border-[#DAE7E7] text-[#5B8989] bg-[#F9FBFB] p-4 rounded-lg rounded-ss-none">
            <div>
              {params.get("previous") ? (
                <p className="text-sm py-0.5">
                  Let's continue with your previous quiz on {topic}
                </p>
              ) : (
                <p className="text-sm py-0.5">
                  The topic in this quiz will be {topic}
                </p>
              )}
              <p className="mt-2">
                This quiz has {questionsLength} questions and your score will be
                shown in the end of the quiz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
