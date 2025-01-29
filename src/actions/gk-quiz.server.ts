"use server";
import { createClient } from "@/lib/supabase/server";

export const getNumberOfCompletedGKQuiz = async (userid: string) => {
  const supabase = createClient();

  if (!userid) {
    return {
      numberOfCompletedQuiz: 0,
      level: 1,
      totalQuiz: 0,
    };
  }
  const { data: allQuizes, error } = await supabase
    .from("quiz_gk")
    .select("questions, submissions, userid, complete")
    .eq("userid", userid)
    .eq("complete", true);

  if (error) {
    console.error(error);
  }
  let numberOfCompletedQuiz = 0;
  allQuizes?.forEach((quiz: any) => {
    numberOfCompletedQuiz += quiz.submissions?.length || 0;
  });

  const numberOfPointsEarned = allQuizes
      ? allQuizes.reduce(
          (count: number, quiz: { submissions?: { isCorrect: boolean }[] }) => {
            if (quiz.submissions && quiz.submissions.length > 0) {
              const correctCount = quiz.submissions.filter(
                (submission: { isCorrect: boolean }) => submission.isCorrect
              ).length;
              return count + correctCount;
            }
            return count;
          },
          0
        )
      : 0;
  const totalQuiz =
    numberOfCompletedQuiz <= 10
      ? 10
      : numberOfCompletedQuiz - (numberOfCompletedQuiz % 10) + 10;
  const level = totalQuiz / 10;
  return {
    numberOfCompletedQuiz,
    level,
    totalQuiz,
    numberOfPointsEarned
  };
};

// Get the incompleted quiz to continue it
export async function getInCompletedGKQuiz(userId: string) {
  const supabase = createClient();
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000); // Calculate the timestamp for 2 hours ago
  const { data, error } = await supabase
    .from("quiz_gk")
    .select("*")
    .eq("userid", userId)
    .eq("start", true)
    .eq("complete", false)
    .gte("created_at", twoHoursAgo.toISOString()); // Filter quizzes created within the last 2 hours

  if (error) {
    console.error("incomplete quiz error", error);
  }
  return data;
}

export const getGKQuizById = async (id: any) => {
  const supabase = createClient();
  try {
    let { data, error } = await supabase
      .from("quiz_gk")
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
