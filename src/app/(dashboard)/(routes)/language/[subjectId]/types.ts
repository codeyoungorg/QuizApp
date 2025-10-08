export type Option = {
  text: string;
  correct: 'true' | 'false';
};

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface ExerciseQuestion {
  id: number;
  uuid: string;
  question: string;
  options: Option[];
  explanation: string;
  topic_id: number;
  language_id: number;
  level_id: number;
  difficulty_level: DifficultyLevel;
  created_at: string; // ISO 8601 timestamp
  modified_at: string; // ISO 8601 timestamp
}

export type ExerciseData = ExerciseQuestion[];

