"use client";

import { generateQuiz } from "@/actions/quiz.client";
import { getTopicById } from "@/actions/topic-operations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { Label } from "@/components/ui/label";

export default function NewQuizPage() {
  const user_id = getCookie("userId");
  const [loading, setLoading] = useState(false);
  const [topicId, setTopicId] = useState<number | null>(null);
  const [userId, setUserId] = useState(user_id || "");
  const router = useRouter();

  const createQuizByTopic = async () => {
    setLoading(true);
    if (!topicId) return;
    try {
      const topic = await getTopicById(topicId);
      const data = await generateQuiz({
        topicId: topicId,
        grade: topic?.grade,
        subjectId: topic?.subject_id,
        userId: userId,
        start: true,
      });

      if (topic?.subject_id == 1) {
        router.push(`/quiz/math/${data.id}?topic=${topicId}`);
      } else if (topic?.subject_id == 2) {
        router.push(`/quiz/science/${data.id}?topic=${topicId}`);
      } else if (topic?.subject_id == 3) {
        router.push(`/quiz/english/${data.id}?topic=${topicId}`);
      } else {
        console.log("Invalid subjectId");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="flex flex-col gap-4">
        <h1>New Quiz</h1>
        <div className="flex flex-col gap-2">
          <Label>User Id</Label>
          <Input
            type="text"
            placeholder="Enter user id"
            value={userId || ""}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Topic Id</Label>
          <Input
            type="number"
            placeholder="Enter topic id"
            value={topicId || ""}
            onChange={(e) => setTopicId(parseInt(e.target.value))}
          />
        </div>
        <Button onClick={createQuizByTopic} disabled={loading}>
          {loading ? "Generating..." : "Generate a Quiz"}
        </Button>
      </div>
    </div>
  );
}
