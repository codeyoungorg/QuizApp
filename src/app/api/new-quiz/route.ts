import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { generateQuiz } from "@/actions/quiz.client";
import { getTopicById } from "@/actions/topic-operations";

export const maxDuration = 50;

// Add CORS configuration
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}

export async function POST(req: NextRequest) {
  // Add CORS headers to the POST response
  const response = NextResponse;

  const body = await req.json();
  const { topicId, userId } = body;

  try {
    // Get topic details first
    const topic = await getTopicById(parseInt(topicId));
    if (!topic) {
      return response.json(
        { error: "Topic not found" },
        {
          status: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Generate the quiz
    const quizData = await generateQuiz({
      topicId: topicId,
      grade: topic.grade,
      subjectId: topic.subject_id,
      userId: userId,
      start: true,
    });

    let redirectUrl = process.env.NEXT_PUBLIC_NOAH_API;

    // Use the subject_id from the topic
    if (topic.subject_id === 1) {
      redirectUrl += `/quiz/math/${quizData.id}?topic=${topicId}`;
    } else if (topic.subject_id === 2) {
      redirectUrl += `/quiz/science/${quizData.id}?topic=${topicId}`;
    } else if (topic.subject_id === 3) {
      redirectUrl += `/quiz/english/${quizData.id}?topic=${topicId}`;
    } else {
      return response.json(
        { error: "Invalid subjectId" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    return response.json(
      {
        message: "Quiz created successfully",
        redirectUrl,
        quizId: quizData.id,
        topicId,
        subjectId: topic.subject_id,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error(error);
    return response.json(
      { error: "Failed to create quiz" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
