import axios from "axios";
import type {
  ServeVocabularyResponse,
  SubmitVocabularyResponse,
  VocabularyApiLevelId,
  VocabularyStats,
} from "@/app/(dashboard)/(routes)/vocabulary-building/_types";

const baseUrl = () => process.env.NEXT_PUBLIC_QUIZ_API ?? "";

type GetStatsResponse = {
  err: boolean;
  msg: string;
  stats: VocabularyStats;
};

export const getVocabularyStats = async ({
  userId,
  timeZone,
}: {
  userId: string;
  timeZone?: string;
}): Promise<VocabularyStats | null> => {
  const url = `${baseUrl()}/vocabulary/stats`;
  try {
    const { data } = await axios.get<GetStatsResponse>(url, {
      params: { userId, ...(timeZone ? { timeZone } : {}) },
    });
    console.log("getVocabularyStats response", { data });
    if (data?.err) return null;
    return data?.stats ?? null;
  } catch (error: any) {
    console.error("[getVocabularyStats] Error:", { error: error?.message, userId });
    return null;
  }
};

export const serveVocabularyQuiz = async ({
  userId,
  levelId,
}: {
  userId: string;
  levelId: VocabularyApiLevelId;
}): Promise<ServeVocabularyResponse | null> => {
  const url = `${baseUrl()}/vocabulary/serve`;
  try {
    const { data } = await axios.post<ServeVocabularyResponse>(url, {
      userId,
      levelId,
    });
    if (data?.err) return null;
    return data;
  } catch (error: any) {
    console.error("[serveVocabularyQuiz] Error:", {
      error: error?.message,
      userId,
      levelId,
    });
    return null;
  }
};

export const submitVocabularyAnswer = async ({
  sessionId,
  userId,
  wordId,
  selectedOption,
}: {
  sessionId: number;
  userId: string;
  wordId: number;
  selectedOption: number;
}): Promise<SubmitVocabularyResponse | null> => {
  const url = `${baseUrl()}/vocabulary/submit`;
  try {
    const { data } = await axios.post<SubmitVocabularyResponse>(url, {
      sessionId,
      userId,
      wordId,
      selectedOption,
    });
    if (data?.err) return null;
    return data;
  } catch (error: any) {
    console.error("[submitVocabularyAnswer] Error:", {
      error: error?.message,
      sessionId,
      wordId,
    });
    return null;
  }
};
