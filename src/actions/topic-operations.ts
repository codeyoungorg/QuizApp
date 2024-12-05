"use server";

import { createClient } from "@/lib/supabase/server";

export async function getTopicById(topicId: number) {
  const supabase = createClient();
  const { data } = await supabase
    .from("new_topic_list")
    .select("*")
    .eq("topic_id", topicId)
    .single();
  return data;
}
