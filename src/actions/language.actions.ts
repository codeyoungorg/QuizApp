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
