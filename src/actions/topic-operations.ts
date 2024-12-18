"use server";

import { createClient } from "@/lib/supabase/server";

export async function getTopicById(topicId: number) {
  const supabase = createClient();
  const { data } = await supabase
    .from("topic_union")
    .select("*")
    .eq("id", topicId)
    .single();
  return data;
}
