export type VocabularyApiLevelId = 1 | 2 | 3;

export type VocabularyStatsLevel = {
  levelId: VocabularyApiLevelId;
  name: string;
  grades: string;
  learned: number;
  total: number;
};

export type VocabularyStats = {
  dailyProgress: {
    totalLearnedToday: number;
    target: number;
    indicators: boolean[];
  };
  streak: number;
  totalLearned: number;
  totalAvailable: number;
  levels: VocabularyStatsLevel[];
};

export type VocabularyOption = {
  id: number;
  text: string;
};

export type VocabularyQuestion = {
  id: number;
  word: string;
  question: string;
  explanation: string;
  options: VocabularyOption[];
  levelId: VocabularyApiLevelId;
};

export type VocabularyPreviousAnswer = {
  wordId: number;
  isCorrect: boolean;
  answer: number;
};

export type ServeVocabularyResponse = {
  err: boolean;
  msg: string;
  resumed: boolean;
  sessionId: number | null;
  levelId: VocabularyApiLevelId;
  levelName: string;
  answeredCount: number;
  previousAnswers: VocabularyPreviousAnswer[];
  remainingQuestions: VocabularyQuestion[];
};

export type VocabularySessionSummary = {
  wordsLearned: number;
  totalLearned: number;
  totalForLevel: number;
  levelName: string;
};

export type SubmitVocabularyResponse = {
  err: boolean;
  msg: string;
  sessionId: number;
  isCorrect: boolean;
  correctOption: number;
  explanation: string;
  questionNumber: number;
  sessionComplete: boolean;
  summary: VocabularySessionSummary | null;
};
