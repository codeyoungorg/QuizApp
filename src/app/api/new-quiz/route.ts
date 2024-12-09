import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { generateQuiz } from "@/actions/quiz.client";
import { getTopicById } from "@/actions/topic-operations";

export const maxDuration = 50;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { topicId, userId } = body;

  try {
    // Get topic details first
    const topic = await getTopicById(parseInt(topicId));
    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Generate the quiz
    const quizData = await generateQuiz({
      topicId: topicId,
      grade: parseInt(topic.grade || "1"),
      subjectId: topic.subject_id,
      userId: userId,
      start: true,
    });

    let redirectUrl = "https://noahai-dev.codeyoung.com";

    // Use the subject_id from the topic
    if (topic.subject_id === 1) {
      redirectUrl += `/quiz/math/${quizData.id}?topic=${topicId}`;
    } else if (topic.subject_id === 2) {
      redirectUrl += `/quiz/science/${quizData.id}?topic=${topicId}`;
    } else if (topic.subject_id === 3) {
      redirectUrl += `/quiz/english/${quizData.id}?topic=${topicId}`;
    } else {
      return NextResponse.json({ error: "Invalid subjectId" }, { status: 400 });
    }

    return NextResponse.json({
      message: "Quiz created successfully",
      redirectUrl,
      quizId: quizData.id,
      topicId,
      subjectId: topic.subject_id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create quiz" },
      { status: 500 }
    );
  }
}
