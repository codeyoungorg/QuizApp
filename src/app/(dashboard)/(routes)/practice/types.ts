import { QuizDataType, SubmissionType } from "@/types/quiz.types";

// Types
export type Option = {
  text: string;
  correct: string;
  index: number;
} | null;

export interface AttemptQuizProps {
  isReviewQuiz: boolean;
  setIsReviewQuiz: (review: boolean) => void;
  setIsShowScore: (completed: boolean) => void;
  quizData: QuizDataType | null;
  userData: {
    id: string | null;
    grade: number | null;
    subjectId: number | null;
    topicId: number | null;
  };
  submissions: SubmissionType[];
  setSubmissions: (submissions: SubmissionType[]) => void;
}

// Constants
export const FEEDBACK_TYPES = {
  GOOD: "good" as const,
  BAD: "bad" as const,
};
