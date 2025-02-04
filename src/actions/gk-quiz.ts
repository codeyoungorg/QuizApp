"use server";
import { createClient } from "@/lib/supabase/server";

// // generating questions
export const getGKQuestions = async ({
  userId,
  topicId,
}: {
  userId: string;
  topicId: number;
}) => {
  // fetching stored correct submissions
  const questionIds = await fetchCorrectSubmissions(userId, topicId);

  const questions = await fetchQuestionsForGK({
    limit: 5,
    topicId,
    questionIds,
  });
  return { questions };
};

// fetching question function
const fetchQuestionsForGK = async ({
  limit,
  topicId,
  questionIds,
}: {
  limit: number;
  topicId: number;
  questionIds: string[];
}) => {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("db_gk_rpc", {
    rows_limit: limit,
    selected_topic_id: topicId,
    uuids: questionIds,
  });

  if (error) {
    console.log(error);
  }

  return data;
};

// fetching correct submissions
export const fetchCorrectSubmissions = async (
  userId: string,
  topicId: number
) => {
  const supabase = createClient();

  const { data } = await supabase
    .from("correct_submissions_gk")
    .select("questionid")
    .eq("userid", userId)
    .eq("topic_id", topicId);

  if (!data) {
    return [];
  }

  const formattedData = data.map((quiz: any) => {
    return quiz.questionid;
  });

  return formattedData;
};

// create quiz
export async function createGKQuiz({
  questions,
  topicId,
  userId,
}: {
  userId: string;
  questions: any;
  topicId: number;
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("quiz_gk")
    .insert({
      userid: userId,
      questions: questions,
      start: true,
      topic_id: topicId,
    })
    .select();

  if (error) {
    console.error(error);
  }

  return data;
}

// get quiz stats
export const getGKQuizStats = async (quizId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("quiz_gk")
    .select("*")
    .eq("id", quizId)
    .single();

  if (error) {
    console.error(error);
  }
  return data;
};

// update quiz
export const updateGKQuizStats = async (quizId: string, userId: string) => {
  const supabase = createClient();
  const { error } = await supabase
    .from("quiz_gk")
    .update({
      complete: true,
    })
    .eq("id", quizId)
    .eq("userid", userId)
    .select();
  if (error) {
    console.error(error);
    return { success: false };
  }
  return { success: true };
};

// store user submission
export async function storeUserSubmissionInGKQuiz(
  quizId: string,
  userId: string,
  submission: any
) {
  const supabase = createClient();

  const { data } = await supabase
    .from("quiz_gk")
    .update({
      submissions: submission,
    })
    .eq("id", quizId)
    .eq("userid", userId)
    .select();

  return { success: true, data };
}

// storing correct submission
export async function storeCorrectSubmissionForGK({
  userId,
  questionId,
  quizId,
  topicId,
}: {
  userId: string;
  questionId: string;
  quizId: number;
  topicId: number;
}) {
  const supabase = createClient();

  const { error } = await supabase.from("correct_submissions_gk").insert({
    userid: userId,
    questionid: questionId,
    quizid: quizId,
    topic_id: topicId,
  });

  if (error) {
    console.error("store Correct Submission error", error);
    return { success: false };
  }

  return { success: true };
}

// add feedback in gk quiz
export const feedbackGKQuiz = async ({
  questionId,
  userId,
  response,
  reason,
}: {
  questionId: string;
  userId: string;
  response: string;
  reason: string | null;
}) => {
  const supabase = createClient();
  const { error } = await supabase
    .from("quiz_gk_feedback")
    .insert({
      questionId: questionId,
      userId: userId,
      response: response,
      reason: reason,
    })
    .select();

  if (error) console.log(error);
  return;
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
    .gte("created_at", twoHoursAgo.toISOString())
    .limit(1); // Filter quizzes created within the last 2 hours

  if (error) {
    console.error("incomplete quiz error", error);
  }
  return data;
}

export const getGKCategoriesByGrade = async (grade: number) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("gk_topics")
    .select("category")
    .contains("grade", [grade]);

  if (error) {
    console.error(error);
    return [];
  }

  // Get unique categories
  const uniqueCategories = Array.from(
    new Set(data?.map((item) => item.category))
  );
  return uniqueCategories.map((category) => ({ category }));
};

export const selectRandomTopicOfCategory = async ({
  category,
  grade,
}: {
  category: string;
  grade: number;
}) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("gk_topics")
    .select("topic, id")
    .contains("grade", [grade])
    .eq("category", category);

  if (error) {
    console.error(error);
    return { randomTopic: null, topicId: null };
  }

  const randomIndex = Math.floor(Math.random() * (data?.length || 0));
  const randomTopic = data[randomIndex].topic;
  const topicId = data[randomIndex].id;

  return { randomTopic, topicId };
};

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

// select random category by grade
export const selectRandomCategoryByGrade = async (grade: number) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("gk_topics")
    .select("category")
    .contains("grade", [grade]);

  if (error) {
    console.error(error);
    return null;
  }
  const randomIndex = Math.floor(Math.random() * (data?.length || 0));
  const randomCategory = data[randomIndex].category;
  return randomCategory;
};
