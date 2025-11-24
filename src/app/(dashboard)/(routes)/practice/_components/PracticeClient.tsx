"use client";

import { useEffect, useState } from "react";
import { SelectQuestionCount } from "./SelectQuestionCount";
import { AttemptQuiz } from "./AttemptQuiz";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { ErrorToast } from "@/utils/getToast";
import { ExerciseCompleted } from "./ExerciseCompleted";
import { QuizDataType, SubmissionType } from "@/types/quiz.types";
import { startLoader, stopLoader } from "@/utils/loaderUtils";
import { handleEvent } from "@/utils/handleEvent";
import { checkFalsy } from "@/utils/checkFalsy";


export default function PracticeClient({
  user_id,
  user_grade,
}: {
  user_id: string | null;
  user_grade: string | null;
}) {
  const queryParams = useSearchParams();
  const topicId = queryParams.get("topicId");
  const subjectId = queryParams.get("subjectId");
  const quizTopic = queryParams.get("topic");
  const userId = checkFalsy(user_id) ? user_id : queryParams.get("userId");
  const grade = checkFalsy(user_grade) ? user_grade : queryParams.get("grade");

  const userData = {
    id: userId,
    grade: grade ? parseInt(grade) : null,
    subjectId: subjectId ? parseInt(subjectId) : null,
    topicId: topicId ? parseInt(topicId) : null,
  };

  const [quizData, setQuizData] = useState<QuizDataType | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionType[]>([]);
  const [questionCount, setQuestionCount] = useState<number | null>(null);
  const [isPracticeStarted, setIsPracticeStarted] = useState(false);

  const [isShowScore, setIsShowScore] = useState(false);
  const [isReviewQuiz, setIsReviewQuiz] = useState(false);

  const [quizLoading, setQuizLoading] = useState(false);
  const [quizSummaryData, setQuizSummaryData] = useState<any | null>(null);

  const handleStartPractice = async () => {
    if (topicId && userId && grade && subjectId && questionCount) {
      try {
        setQuizLoading(true);
        startLoader();
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_QUIZ_API}/quiz/serve`,
          {
            grade: parseInt(grade),
            subjectId: parseInt(subjectId),
            userId,
            topicId: parseInt(topicId),
            noOfQuestions: questionCount,
          }
        );
        handleEvent("quiz_started", "When a quiz is started");
        setQuizData(response.data?.quiz);
        setIsPracticeStarted(true);
      } catch (error) {
        console.error(error);
        handleEvent("quiz_failed_start", "When a quiz fails to start");
        ErrorToast("Failed to start quiz.");
      } finally {
        setQuizLoading(false);
        stopLoader();
      }
    } else {
      ErrorToast("Missing required parameters to start the quiz.");
    }
  };

  const handleQuizEnd = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_QUIZ_API}/quiz/submission/summary?quizId=${quizData?.id}&userId=${userId}`
      );
      handleEvent("quiz_completed", "When a quiz is completed");
      setQuizSummaryData(response.data);
    } catch (error) {
      handleEvent("quiz_failed_submit", "When a quiz fails to submit");
      ErrorToast("Failed to submit quiz.");
    }
  };

  useEffect(() => {
    stopLoader();
  }, []);

  const resetQuiz = () => {
    setIsPracticeStarted(false);
    setSubmissions([]);
    setIsReviewQuiz(false);
    setIsShowScore(false);
  };

  return (
    <div className="p-5 h-full">
      {!isPracticeStarted ? (
        <SelectQuestionCount
          quizTopic={quizTopic}
          setQuestionCount={setQuestionCount}
          questionCount={questionCount}
          onStartPractice={handleStartPractice}
          quizLoading={quizLoading}
        />
      ) : isShowScore ? (
        <ExerciseCompleted
          setIsShowScore={setIsShowScore}
          setIsReviewQuiz={setIsReviewQuiz}
          submissions={submissions}
          resetQuiz={resetQuiz}
          quizSummaryData={quizSummaryData}
          topic={quizTopic || ""}
          grade={grade || ""}
        />
      ) : (
        <AttemptQuiz
          setIsShowScore={setIsShowScore}
          isReviewQuiz={isReviewQuiz}
          setIsReviewQuiz={setIsReviewQuiz}
          quizData={quizData}
          userData={userData}
          submissions={submissions}
          setSubmissions={setSubmissions}
          resetQuiz={resetQuiz}
          handleQuizEnd={handleQuizEnd}
        />
      )}
    </div>
  );
}
