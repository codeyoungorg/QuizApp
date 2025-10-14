import { ExerciseData } from "@/app/(dashboard)/(routes)/language/[subjectId]/types";
import axios from "axios";

type QuizSubmission = {
  questionId: number;
  answer: string;
  isCorrect: boolean;
};
export const LanguageLearningGetTopicContent = async ({
  language,
  topic,
  from,
  to,
}: {
  topic: number;
  language: string;
  from: number;
  to: number;
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_QUIZ_API;
  if (!baseUrl) {
    return null;
  }

  const url = `${baseUrl}/funzone/languages/serve/learn-section`;

  try {
    const { data: json } = await axios.post(url, {
      language,
      topic: Number(topic),
      from: Number(from),
      to: Number(to),
    });

    const payload = Array.isArray(json)
      ? json
      : Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json?.learn)
      ? json.learn
      : null;

    if (!payload) {
      return null;
    }

    return payload as ExerciseData;
  } catch (err: any) {
    console.error("[LanguageLearningGetTopicContent] Error:", {
      error: err.message,
      language,
      topic,
      from,
      to,
    });
    return null;
  }
};

export const updateLanguageLearningPractice = async ({
  userId,
  total,
  correct,
  submission,
  language,
  topicId,
  levelId,
  quizId,
  state,
}: {
  userId: string;
  total: number;
  correct: number;
  submission: QuizSubmission[];
  language: string;
  topicId: number;
  levelId: number;
  quizId: number;
  state: number;
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_QUIZ_API;
  if (!baseUrl) {
    return null;
  }

  const url = `${baseUrl}/funzone/languages/submit/practice/update`;

  try {
    const { data } = await axios.post(url, {
      userId,
      total,
      correct,
      submission,
      language,
      topicId,
      levelId,
      quizId,
      state,
    });

    return data;
  } catch (error: any) {
    console.error("[updateLanguageLearningPractice] Error:", {
      error: error.message,
      userId,
      topicId,
      levelId,
      quizId,
    });
    return null;
  }
};

export const saveLanguageLearningPractice = async ({
  userId,
  total,
  correct,
  submission,
  language,
  topicId,
  levelId,
  state,
}: {
  userId: string;
  total: number;
  correct: number;
  submission: QuizSubmission[];
  language: string;
  topicId: number;
  levelId: number;
  state: number;
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_QUIZ_API;
  if (!baseUrl) {
    return null;
  }

  const url = `${baseUrl}/funzone/languages/submit/practice`;

  try {
    const { data } = await axios.post(url, {
      userId,
      total,
      correct,
      submission,
      language,
      topicId,
      levelId,
      state,
    });

    return data;
  } catch (error: any) {
    console.error("[saveLanguageLearningPractice] Error:", {
      error: error.message,
      userId,
      topicId,
      levelId,
    });
    return null;
  }
};

export const LanguageLearningGetUserCardState = async ({
  userId,
  topicId,
  levelId,
  state,
  lang,
}: {
  userId: string;
  topicId: number;
  levelId: number;
  state: number;
  lang: string;
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_QUIZ_API;
  if (!baseUrl) {
    return null;
  }

  const url = `${baseUrl}/funzone/languages/misc/user-card-state`;

  try {
    const { data } = await axios.get(url, {
      params: {
        userId,
        topicId,
        levelId,
        state,
        lang,
      },
    });

    if(data.result === null){
      return null;
    }

    return data;
  } catch (error: any) {
    console.error("[LanguageLearningGetUserCardState] Error:", {
      error: error.message,
      userId,
      topicId,
      levelId,
      state,
      lang,
    });
    return null;
  }
};

export const LanguageLearningFetchQuizResult = async (quizId: string, userId?: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_QUIZ_API;
  if (!baseUrl) {
    return null;
  }

  const url = `${baseUrl}/funzone/languages/serve/result`;

  try {
    const { data } = await axios.get(url, {
      params: {
        quizId,
        userId,
      },
    });

    if(data){
      return data;
    }

    return null;
  } catch (error: any) {
    console.error("[LanguageLearningFetchQuizResult] Error:", {
      error: error.message,
      quizId,
      userId,
    });
    return null;
  }
};

type LearningSubmission = {
  questionId: number;
  answer: string;
  isCorrect: boolean;
};

export const saveLanguageLearningData = async ({
  userId,
  total,
  correct,
  submission,
  language,
  topicId,
  levelId,
}: {
  userId: string;
  total: number;
  correct: number;
  submission: LearningSubmission[];
  language: string;
  topicId: number;
  levelId: number;
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_QUIZ_API;
  if (!baseUrl) {
    return null;
  }

  const url = `${baseUrl}/funzone/languages/submit/learn`;

  try {
    const { data } = await axios.post(url, {
      userId,
      total,
      correct,
      submission,
      language,
      topicId,
      levelId,
    });

    return data;
  } catch (error: any) {
    console.error("[saveLanguageLearningData] Error:", {
      error: error.message,
      userId,
      topicId,
      levelId,
      language,
    });
    return null;
  }
};
