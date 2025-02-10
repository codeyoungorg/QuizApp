import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const body = await req.json();
  const { question, correctOption } = body;

  const response = await streamText({
    model: openai("gpt-4o-mini"),
    temperature: 0,
    prompt: `Given the question and its right answer, Your work is to explain me it in easy language and in the minimum words. This is the question: ${question}\nand the correct option is: ${correctOption}\n explain it to me.`,
  });

  return response.toAIStreamResponse();
}
