import apiService from "../apiService";
import { getCookie } from "cookies-next";

type QuizEventData = {
  type:string;
  subject:string;
  topic?:string | null;
  topicId?: number | string | null;
  difficulty: [string | number] | number[] | [];
  questionId:[string | number] | number[] | [];
  quizId: number;
};

export const captureEvent = async ({ data }:{ data:QuizEventData}) => {
  const userId = getCookie("userId");
  const userRole = getCookie("userRole");
  try {
    const inclusion = [ "gk","coding", "language-practice"]; // "language-learn",
    // Only the above specific events
    if(inclusion.includes(data.type)){
      console.log("Capture Event", userId, userRole, data)
      await apiService.post(`quiz/submit`, {
        userId,
        userRole,
        ...data
      });
    }
  } catch (error) {
    // throw error;
  }
};
