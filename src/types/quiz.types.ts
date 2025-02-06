export type QuizDataType = {
  id: number;
  userid: string;
  topic_id: number;
  subject_id: number;
  questions: {
    uuid: string;
    grade: string;
    topic: string;
    options: Option[];
    subject: string;
    metadata: {
      grade: string;
      topic: string;
      subject: string;
      subtopic: string;
      learning_objective: string;
    };
    difficulty_level: string | number | null;
    question: string;
    explanation: string;
  }[];
  submissions: {
    selected: {
      text: string;
      correct: string;
    };
    isCorrect: boolean;
    questionId: string;
    questionIntId?: number;
    correctOption?: string;
  }[];
  created_at: Date;
  start: boolean;
  complete: boolean;
  multiple_topics?: any;
};

type Option = {
  text: string;
  correct: string;
};

export type SubmissionType = {
  selected: {
    text: string;
    correct: string;
  };
  isCorrect: boolean;
  questionId: string;
  questionIntId?: number;
  correctOption?: string;
};

export type QuestionType = {
  id: number;
  uuid: string;
  grade: string;
  topic: string;
  options: Option[];
  subject: string;
  metadata: {
    grade: string;
    topic: string;
    subject: string;
    subtopic: string;
    learning_objective: string;
  };
  question: string;
  created_at: string;
  explanation: string;
  modified_at: string;
  blooms_level: string;
  difficulty_level: string;
  difficulty_rating: number;
};
