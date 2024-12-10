"use server";
import { createClient } from "@/lib/supabase/server";

export const getNumberOfCompletedQuiz = async ({
  userId,
  subjectId,
}: {
  userId: string;
  subjectId: number;
}) => {
  const supabase = createClient();
  const { data: allQuizes, error } = await supabase
    .from("quiz")
    .select("questions, submissions")
    .eq("userid", userId)
    .eq("complete", true)
    .eq("subject_id", subjectId);

  if (error) {
    console.error(error);
  }
  let numberOfCompletedQuiz = allQuizes?.length || 0;

  const totalQuiz =
    numberOfCompletedQuiz <= 10
      ? 10
      : numberOfCompletedQuiz - (numberOfCompletedQuiz % 10) + 10;
  const level = totalQuiz / 10;
  return {
    numberOfCompletedQuiz,
    level,
    totalQuiz,
  };
};

export const getQuizById = async (id: any) => {
  const supabase = createClient();
  try {
    let { data, error } = await supabase
      .from("quiz")
      .select("*")
      .eq("id", id)
      .limit(1);

    if ((data?.length ?? 0) > 0) {
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
