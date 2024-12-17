"use server";
import { createClient } from "@/lib/supabase/server";

export const getQuizStats = async (quizId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("quiz")
    .select("*")
    .eq("id", quizId)
    .single();
  if (error) {
    console.error(error);
  }
  return data;
};

export const getNumberOfCompletedQuiz = async (
  userid: string,
  subjectId: number
) => {
  const supabase = createClient();
  const { data: allQuizes, error } = await supabase
    .from("quiz")
    .select("questions, submissions")
    .eq("userid", userid)
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

const quizWiseScore = ({
  quizes,
  quizNumber,
}: {
  quizes: any[];
  quizNumber: number;
}): { quizNumber: number; correctAnswers: number }[] => {
  const reverse = quizes.reverse();
  const score: { quizNumber: number; correctAnswers: number }[] = [];
  reverse.forEach((quizDetails, index) => {
    quizNumber += 1;
    const { submissions } = quizDetails;
    const correctAnswers = submissions.filter(
      ({ isCorrect }: { isCorrect: boolean }) => isCorrect
    );
    score.push({ quizNumber, correctAnswers: correctAnswers.length });
  });
  return score;
};

const getTopicWiseLevelScore = async (allQuizes: any[], grade: number) => {
  const supabase = createClient();
  const subtopics: any = {
    totalQuestion: 0,
    totalCorrectQuestion: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    easyTotal: 0,
    mediumTotal: 0,
    hardTotal: 0,
  };
  await Promise.all(
    allQuizes?.map(async ({ submissions }) => {
      if (submissions.length) {
        await Promise.all(
          submissions.map(
            async ({
              questionId,
              isCorrect,
            }: {
              questionId: string;
              isCorrect: boolean;
            }) => {
              const response = await supabase
                .from(`db_math`)
                .select()
                .eq("uuid", questionId);
              if (response && response.data && !response.data[0]) return;
              const questionData =
                response && response.data && response.data[0];
              const subtopic: any = questionData?.metadata.subtopic;
              const difficultyLevel =
                questionData?.difficulty_level?.toLowerCase();
              if (subtopics[subtopic]) {
                subtopics[subtopic].totalQuestion += 1;
                if (isCorrect) subtopics[subtopic].totalCorrectQuestion += 1;
                switch (difficultyLevel) {
                  case "easy":
                    subtopics[subtopic].easy += isCorrect ? 1 : 0;
                    subtopics[subtopic].easyTotal += 1;
                    break;
                  case "medium":
                    subtopics[subtopic].medium += isCorrect ? 1 : 0;
                    subtopics[subtopic].mediumTotal += 1;
                    break;
                  default:
                    subtopics[subtopic].hard += isCorrect ? 1 : 0;
                    subtopics[subtopic].hardTotal += 1;
                }
              } else {
                subtopics[subtopic] = {
                  totalQuestion: 1,
                  totalCorrectQuestion: isCorrect ? 1 : 0,
                  easy: difficultyLevel == "easy" && isCorrect ? 1 : 0,
                  medium: difficultyLevel == "medium" && isCorrect ? 1 : 0,
                  hard: difficultyLevel == "hard" && isCorrect ? 1 : 0,
                  easyTotal: difficultyLevel == "easy" ? 1 : 0,
                  mediumTotal: difficultyLevel == "medium" ? 1 : 0,
                  hardTotal: difficultyLevel == "hard" ? 1 : 0,
                };
              }
            }
          )
        );
      }
    })
  );
  return subtopics;
};

const pushFinalScore = (subtopics: any) => {
  Object.keys(subtopics).map((subTopic) => {
    const { easy, medium, hard, easyTotal, mediumTotal, hardTotal } =
      subtopics[subTopic];
    // Should Answer in all category
    if (!(easy && medium && hard)) delete subtopics[subTopic];
    else {
      const score =
        (easy / easyTotal) * 1 +
        (medium / mediumTotal) * 2 +
        (hard / hardTotal) * 4;
      subtopics[subTopic].totalScore = Math.round((score / 7) * 10);
    }
  });
};

export const getInsight = async (
  userid: string,
  grade: number,
  subjectId: number
) => {
  const supabase = createClient();
  const { data: allQuizes, error } = await supabase
    .from("quiz")
    .select()
    .eq("userid", userid)
    .eq("complete", true)
    .eq("subject_id", subjectId);
  if (error) {
    console.error(error);
  }
  const quiredQuestion = {};
  if (!allQuizes?.length) return [];
  const subtopics = await getTopicWiseLevelScore(allQuizes, grade);
  pushFinalScore(subtopics);
  const scoreGreaterThanOrEqualTo4 = [];
  const scoreLessThanOrEqualTo3 = [];

  // Function to compare ages in descending order
  // Categorize students into arrays
  for (const topic in subtopics) {
    if (subtopics.hasOwnProperty(topic)) {
      const score = subtopics[topic].totalScore;
      if (score >= 4) {
        scoreGreaterThanOrEqualTo4.push({
          topic,
          totalScore: subtopics[topic].totalScore,
        });
      } else {
        scoreLessThanOrEqualTo3.push({
          topic,
          totalScore: subtopics[topic].totalScore,
        });
      }
    }
  }

  const compareScoreDescending = (a: any, b: any) =>
    b.totalScore - a.totalScore;
  // Sort arrays by age in descending order
  scoreGreaterThanOrEqualTo4.sort(compareScoreDescending);
  scoreLessThanOrEqualTo3.sort(compareScoreDescending);
  return {
    scoreGreaterThanOrEqualTo4: scoreGreaterThanOrEqualTo4.slice(0, 6),
    scoreLessThanOrEqualTo3: scoreLessThanOrEqualTo3.slice(0, 6),
  };
};

const getLast10Quizes = async ({
  limit,
  userid,
  subjectId,
}: {
  limit: any;
  userid: string;
  subjectId: number;
}) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("quiz")
    .select("*")
    .eq("complete", "true")
    .eq("userid", userid)
    .eq("subject_id", subjectId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data || [];
};

const getCorrectAns = (submissions: any) => {
  let correctAnswers = 0;
  submissions.map(({ isCorrect }: any) => {
    if (isCorrect) correctAnswers += 1;
  });
  return correctAnswers;
};

const getAccuracy = (completedQuizes: any[]) => {
  let totalQuestion = 0;
  let totalQuiz = completedQuizes.length;
  let totalCorrectQuestion = 0;
  completedQuizes.map(({ questions, submissions }) => {
    totalQuestion += questions.length;
    totalCorrectQuestion += getCorrectAns(submissions);
  });
  if (totalQuestion && totalCorrectQuestion) {
    const accuracy = Math.floor((totalCorrectQuestion / totalQuestion) * 100);
    return {
      accuracy,
      totalQuiz,
    };
  }
  return {
    accuracy: 0,
    totalQuiz,
  };
};

export const getDashboard = async (userid: string, subjectId: number) => {
  const supabase = createClient();
  // const { data: allQuizes, error } = await supabase
  //   .from("quiz")
  //   .select("questions", "submissions")
  //   .eq("userid", userid)
  //   .eq("complete", "true")

  const quizCurrentStatus = await getNumberOfCompletedQuiz(userid, subjectId);
  const last10Quizes = await getLast10Quizes({
    limit: 10,
    userid,
    subjectId,
  });

  const quizNumber =
    quizCurrentStatus.numberOfCompletedQuiz <= 10
      ? 0
      : quizCurrentStatus.numberOfCompletedQuiz - 10;
  const quizWise = quizWiseScore({ quizes: last10Quizes, quizNumber });
  // if (error) {
  //   console.error(error);
  // }
  // return numberOfCompletedExercise;
  return {
    quizNumber,
    quizWise,
    quizCurrentStatus,
  };
};

export async function getInCompletedQuiz(userId: string) {
  const supabase = createClient();
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000); // Calculate the timestamp for 2 hours ago
  const { data, error } = await supabase
    .from("quiz")
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

export async function gkQuiz(userId: string) {
  const supabase = createClient();
  const { data: completedQuizes, error } = await supabase
    .from("quiz_gk")
    .select("*")
    .eq("userid", userId)
    .eq("start", true)
    .eq("complete", true);
  if (!completedQuizes?.length) return { accuracy: 0, totalQuiz: 0 };
  const { accuracy, totalQuiz } = getAccuracy(completedQuizes);
  return {
    accuracy,
    totalQuiz,
  };
}

export async function doubtSolveDashboard(userId: string) {
  const supabase = createClient();
  if (!userId) return 0;
  const { data: chats, error } = await supabase
    .from("chats_doubt_solve")
    .select("*")
    .eq("user_id", userId);
  return chats?.length || 0;
}

export async function recentChat(userId: string) {
  const supabase = createClient();
  const { data: chats, error } = await supabase
    .from("chats_doubt_solve")
    .select("*")
    .eq("user_id", userId)
    .order("createdAt", { ascending: false })
    .limit(5);

  return chats;
}

export const getNumberOfSubmittedAnswers = async (userid: string) => {
  const supabase = createClient();
  const { data: allQuizes, error } = await supabase
    .from("quiz")
    .select("questions, submissions")
    .eq("userid", userid);

  if (error) {
    console.error(error);
    return 0;
  }
  let numberOfCompletedQuiz = 0;
  allQuizes?.forEach((quiz: any) => {
    if (quiz.submissions?.length > 0) {
      numberOfCompletedQuiz += quiz.submissions.length;
    }
  });
  return numberOfCompletedQuiz;
};
