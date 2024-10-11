import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// create quiz
export async function createQuizBySubject({
  grade,
  subjectId,
  userId,
}: {
  userId: string;
  grade: number;
  subjectId: number;
}) {
  const supabase = createClientComponentClient();

  const metadata = {
    grade: grade,
  };

  const { data: previousQuiz, error: previousQuizError } = await supabase
    .from("quiz")
    .select("id, userid, subject_id, complete")
    .eq("userid", userId)
    .eq("subject_id", subjectId)
    .eq("complete", false)
    .order("created_at", { ascending: false });

  if (previousQuiz && previousQuiz.length > 0) {
    return { quiz: previousQuiz, previous: true };
  }

  const { data, error } = await supabase
    .from("quiz")
    .insert({
      userid: userId,
      metadata: metadata,
      subject_id: subjectId,
    })
    .select();

  if (error) {
    console.error(error);
    return { quiz: null, previous: false };
  }

  return { quiz: data, previous: false };
}

// create quiz
export async function generateQuiz({
  grade,
  subjectId,
  userId,
  topicId,
  start,
}: {
  userId: string;
  grade: number;
  subjectId: number;
  topicId: number;
  start: boolean;
}) {
  const supabase = createClientComponentClient();

  const metadata = {
    grade: grade,
    topic: topicId,
  };

  const { questions } = await getQuestionsByTopicId({
    grade,
    userId,
    subjectId,
    topicId,
  });

  if (questions.length === 0) return { data: null };

  const { data, error } = await supabase
    .from("quiz")
    .insert({
      userid: userId,
      metadata: metadata,
      subject_id: subjectId,
      topic_id: topicId,
      questions,
      start,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function updateQuiz({
  userId,
  questions,
  topicId,
  quizId,
  grade,
  assignedData,
}: {
  userId: string;
  questions: Array<any>;
  topicId: number;
  quizId: string;
  grade: number;
  assignedData?: any;
}) {
  const supabase = createClientComponentClient();

  let metadata;
  let isAssigned = !!assignedData?.topic;

  if (assignedData) {
    metadata = {
      grade: assignedData?.currentGrade || grade,
      topic: topicId,
      assignedGrade: assignedData?.topic?.grade,
    };
  } else {
    metadata = {
      grade: grade,
      topic: topicId,
    };
  }

  const { data, error } = await supabase
    .from("quiz")
    .update({
      questions,
      start: true,
      topic_id: topicId,
      metadata,
      assigned: isAssigned,
    })
    .eq("id", quizId)
    .eq("userid", userId)
    .select();

  if (error) {
    console.error(error);
    return;
  }

  return data;
}

export const getQuestionsByTopicId = async ({
  subjectId,
  userId,
  grade,
  topicId,
}: {
  grade: number;
  userId: string;
  subjectId: number;
  topicId: number;
}) => {
  const questionIds = await fetchCorrectSubmissions({
    userId,
    topicId: topicId,
    subjectId,
  });

  const level1 = await fetchQuestionsByLevel(
    "easy",
    2,
    topicId,
    questionIds,
    grade,
    subjectId
  );
  const level2 = await fetchQuestionsByLevel(
    "medium",
    2,
    topicId,
    questionIds,
    grade,
    subjectId
  );
  const level3 = await fetchQuestionsByLevel(
    "hard",
    1,
    topicId,
    questionIds,
    grade,
    subjectId
  );

  const questions = [...level1, ...level2, ...level3];
  return { questions };
};

export const getQuestions = async ({
  subjectId,
  userId,
  user_grade,
  selectedTopic,
}: {
  user_grade: number;
  userId: string;
  subjectId: number;
  selectedTopic?: any;
}) => {
  let grade;
  let topicData;

  if (!!selectedTopic?.topic) {
    grade = selectedTopic.topic?.grade;
    topicData = await getIdFromTopic(
      selectedTopic.topic?.topic,
      grade,
      subjectId
    );
  } else {
    grade = user_grade;
    if (grade > 8) grade = 8;
    if (subjectId === 2 && grade < 3) grade = 3;
    topicData = await generateRandomTopic({ grade, subjectId });
  }

  const questionIds = await fetchCorrectSubmissions({
    userId,
    topicId: topicData?.id,
    subjectId,
  });

  const level1 = await fetchQuestionsByLevel(
    "easy",
    2,
    topicData?.id,
    questionIds,
    grade,
    subjectId
  );
  const level2 = await fetchQuestionsByLevel(
    "medium",
    2,
    topicData?.id,
    questionIds,
    grade,
    subjectId
  );
  const level3 = await fetchQuestionsByLevel(
    "hard",
    1,
    topicData?.id,
    questionIds,
    grade,
    subjectId
  );

  const questions = [...level1, ...level2, ...level3];
  return { questions, topicName: topicData?.topic, topicId: topicData?.id };
};

// fetching question function
const fetchQuestionsByLevel = async (
  level: "easy" | "medium" | "hard",
  limit: number,
  topicId: number,
  questionIds: string[],
  grade: number,
  subjectId: number
) => {
  const supabase = createClientComponentClient();

  let rpc_function;
  if (subjectId === 1) {
    rpc_function = "db_math_rpc_topicid";
  } else if (subjectId === 2) {
    rpc_function = "db_science_rpc_topicid";
  } else if (subjectId === 3) {
    rpc_function = "db_english_rpc_topicid";
  } else if (subjectId === 4) {
    rpc_function = "db_coding_rpc_topicid";
  }

  if (!rpc_function) return console.log("Invalid subjectId");

  const { data, error } = await supabase.rpc(rpc_function, {
    level: level,
    rows_limit: limit,
    selected_topic_id: topicId,
    uuids: questionIds,
    selected_grade: grade,
  });

  if (data.length === 0) {
    const { data, error } = await supabase.rpc(
      rpc_function.replace("topicid", "any"),
      {
        rows_limit: limit,
        selected_topic_id: topicId,
        uuids: questionIds,
        selected_grade: grade,
      }
    );
    return data;
  }

  if (error) {
    console.log(error);
  }

  return data;
};

const getIdFromTopic = async (
  topic: string,
  grade: number,
  subjectId: number
) => {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from("topic")
    .select("id, topic_name")
    .eq("topic_name", topic)
    .eq("grade", grade)
    .eq("subject_id", subjectId)
    .limit(1)
    .single();

  if (error) {
    console.log(error);
  }

  if (!data) return null;
  return {
    id: data.id,
    topic: data.topic_name,
  };
};

//   generating random topics
const generateRandomTopic = async ({
  grade,
  subjectId,
}: {
  grade: number;
  subjectId: number;
}) => {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from(`topic`)
    .select("id, topic_name")
    .eq("grade", grade)
    .eq("subject_id", subjectId);

  if (error) {
    console.log(error);
  }

  const allTopics = Array.from(
    new Set(
      data?.map((topic) => {
        return { id: topic.id, topic: topic.topic_name };
      })
    )
  );

  const randomTopic = allTopics[Math.floor(Math.random() * allTopics.length)];

  return randomTopic;
};

// update quiz stats to complete
export const updateQuizToComplete = async ({
  quizId,
  userId,
}: {
  quizId: string;
  userId: string;
}) => {
  const supabase = createClientComponentClient();
  const { error } = await supabase
    .from("quiz")
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

// ---------- submissions actions ------------
// fetching correct submissions
export const fetchCorrectSubmissions = async ({
  subjectId,
  topicId,
  userId,
}: {
  userId: string;
  topicId: number;
  subjectId: number;
}) => {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from("correct_submissions")
    .select("questionid")
    .eq("userid", userId)
    .eq("topic_id", topicId)
    .eq("subject_id", subjectId);

  if (error) console.log(error);
  if (!data) {
    return [];
  }

  const formattedData = data.map((quiz) => {
    return quiz.questionid;
  });

  return formattedData;
};

// storing correct submission
export async function storeCorrectSubmission({
  grade,
  questionId,
  quizId,
  topicId,
  userId,
  subjectId,
}: {
  userId: string;
  questionId: string;
  quizId: number;
  topicId: number;
  grade: number;
  subjectId: number;
}) {
  const supabase = createClientComponentClient();

  const { error } = await supabase.from("correct_submissions").insert({
    userid: userId,
    questionid: questionId,
    quiz_id: quizId,
    topic_id: topicId,
    grade,
    subject_id: subjectId,
  });

  if (error) {
    console.error("store Correct Submission error", error);
    return { success: false };
  }

  return { success: true };
}

// store user submission
export async function storeUserSubmission({
  quizId,
  submissions,
  userId,
}: {
  quizId: string;
  userId: string;
  submissions: any;
}) {
  const supabase = createClientComponentClient();

  const { data } = await supabase
    .from("quiz")
    .update({
      submissions: submissions,
    })
    .eq("id", quizId)
    .eq("userid", userId)
    .select();

  return { success: true, data };
}

// store user submission to submissions table
export async function storeUserSubmissionToSubmissions({
  quizId,
  questionId,
  isCorrect,
  optionSelected,
  correctOption,
}: {
  quizId: number;
  questionId: number;
  isCorrect: boolean;
  optionSelected: string;
  correctOption: string;
}) {
  const supabase = createClientComponentClient();

  const { error } = await supabase
    .from("submissions")
    .insert([
      {
        quiz_id: quizId,
        question_id: questionId,
        is_correct: isCorrect,
        option_selected: optionSelected,
        correct_option: correctOption,
      },
    ])
    .select();

  if (error) {
    console.error("store user submission to submissions error", error);
    return { success: false };
  }
}

// feedback quiz
export const feedbackQuiz = async ({
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
  const supabase = createClientComponentClient();
  const { error } = await supabase
    .from("quiz_feedback")
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

export const getNumberOfCompletedQuiz = async ({
  subjectId,
  userId,
}: {
  userId: string;
  subjectId: number;
}) => {
  const supabase = createClientComponentClient();
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

export async function getInCompletedQuiz({
  userId,
  subjectId,
}: {
  userId: string;
  subjectId: number;
}) {
  const supabase = createClientComponentClient();
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000); // Calculate the timestamp for 2 hours ago
  const { data, error } = await supabase
    .from("quiz")
    .select("*")
    .eq("userid", userId)
    .eq("start", true)
    .eq("complete", false)
    .eq("subject_id", subjectId)
    .gte("created_at", twoHoursAgo.toISOString()); // Filter quizzes created within the last 2 hours

  if (error) {
    console.error("incomplete quiz error", error);
  }
  return data;
}

export async function getTopicNameFromDB({
  subjectId,
  topicId,
}: {
  topicId: number;
  subjectId: number;
}) {
  const supabase = createClientComponentClient();
  const { data, error } = await supabase
    .from("topic")
    .select("topic_name")
    .eq("id", topicId)
    .eq("subject_id", subjectId)
    .single();
  if (error) {
    console.error("get topic name error", error);
  }

  return data?.topic_name;
}

// Add this function to the existing file

export async function getUserQuizHistory(userId: string, subjectId: number) {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from("quiz")
    .select("complete, created_at, questions, submissions")
    .eq("userid", userId)
    .eq("subject_id", subjectId)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching user quiz history:", error);
    return null;
  }

  return data;
}
