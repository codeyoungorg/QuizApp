export type DB = {
  id: number;
  uuid: string;
  question: string;
  options: { text: string; correct: string }[];
  explanation: string;
  level_id: number;
  topic_id: number;
  language_id: number;
  difficulty_level: string;
  created_at: Date;
  modified_at: Date;
};

export interface FlashcardData {
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

export type AnswerOption = {
  id: string;
  text: string;
};
