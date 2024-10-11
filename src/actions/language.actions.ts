"use server";

import { createServerSupabaseClient } from "@/app/supabase-server";

export const getLanguageLevels = async () => {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase.from("languages_levels").select("*");

  if (error) {
    console.log(error);
  }

  return data;
};

export const getLanguageTopics = async () => {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase.from("languages_topics").select("*");

  if (error) {
    console.log(error);
  }

  return data;
};

export const getLanguageIdByName = async (name: string) => {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("subject")
    .select("id")
    .eq("subject_name", name.toLowerCase())
    .single();

  if (error) {
    console.log(error);
  }

  return data;
};

export const getTopicContent = async ({
  language,
  topic,
}: {
  topic: number;
  language: string;
}) => {
  const supabase = createServerSupabaseClient();
  const languageId = await getLanguageIdByName(language);

  const { data, error } = await supabase
    .from("languages_db")
    .select("*")
    .eq("topic_id", topic)
    .eq("language_id", languageId?.id);

  if (error) {
    console.log(error);
  }

  return data;
};

type QuizSubmission = {
  questionId: number;
  answer: string;
  isCorrect: boolean;
};

export const saveQuizData = async ({
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
  submission: QuizSubmission[];
  language: string;
  topicId: number;
  levelId: number;
}) => {
  const supabase = createServerSupabaseClient();

  const languageData = await fetchLanguageIdfromSlug(language);
  const { data, error } = await supabase
    .from("languages_quiz")
    .insert({
      user_id: userId,
      total,
      correct,
      submission,
      language_id: languageData?.id,
      topic_id: topicId,
      level_id: levelId,
    })
    .select("*")
    .single();

  if (error) {
    console.log(error);
  }
  return data;
};

export const fetchLanguageIdfromSlug = async (slug: string) => {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("subject")
    .select("id,subject_name")
    .eq("subject_name", slug.toLowerCase())
    .single();
  return data;
};

export const fetchQuizResult = async (quizId: number) => {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("languages_quiz")
    .select("*")
    .eq("id", quizId)
    .single();

  if (error) {
    console.log(error);
  }

  return data;
};

type LearningSubmission = {
  questionId: number;
  answer: string;
  isCorrect: boolean;
};

export const saveLearningData = async ({
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
  const supabase = createServerSupabaseClient();

  const languageData = await fetchLanguageIdfromSlug(language);
  const { data, error } = await supabase
    .from("languages_learning")
    .insert({
      user_id: userId,
      total,
      correct,
      submission,
      language_id: languageData?.id,
      topic_id: topicId,
      level_id: levelId,
    })
    .select("*")
    .single();

  if (error) {
    console.log(error);
  }
  return data;
};
