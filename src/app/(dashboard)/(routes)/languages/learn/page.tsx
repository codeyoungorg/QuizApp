import { getTopicContent } from "@/actions/language.actions";
import LearnBox from "./_components/learn-box";
import MultiSelectBox from "./_components/multi-select/box";

export default async function LearnPage({
  searchParams,
}: {
  searchParams: { lang: string; topic: number };
}) {
  const content = await getTopicContent({
    topic: searchParams.topic,
    language: searchParams.lang,
  });
  return (
    <div className="">
      <LearnBox
        content={content!}
        levelId={1}
        topicId={1}
        lang={searchParams.lang}
      />
      {/* Sentence Creation Card */}
      {/* <MultiSelectBox content={content} levelId={1} topicId={1} /> */}
    </div>
  );
}

const content = [
  {
    id: 1,
    uuid: "uuid-1",
    question: "What is the capital of France?",
    options: [
      { text: "Paris", correct: "true" },
      { text: "London", correct: "false" },
      { text: "Berlin", correct: "false" },
      { text: "Rome", correct: "false" },
    ],
    explanation: "Paris is the capital of France.",
    level_id: 1,
    topic_id: 1,
    language_id: 1,
    difficulty_level: "easy",
    created_at: new Date(),
    modified_at: new Date(),
  },
  {
    id: 2,
    uuid: "uuid-2",
    question: "What is the largest planet in our solar system?",
    options: [
      { text: "Jupiter", correct: "true" },
      { text: "Mars", correct: "false" },
      { text: "Saturn", correct: "false" },
      { text: "Earth", correct: "false" },
    ],
    explanation: "Jupiter is the largest planet in our solar system.",
    level_id: 1,
    topic_id: 1,
    language_id: 1,
    difficulty_level: "medium",
    created_at: new Date(),
    modified_at: new Date(),
  },
  {
    id: 3,
    uuid: "uuid-3",
    question: "What is the chemical symbol for gold?",
    options: [
      { text: "Au", correct: "true" },
      { text: "Ag", correct: "false" },
      { text: "Fe", correct: "false" },
      { text: "Cu", correct: "false" },
    ],
    explanation: "The chemical symbol for gold is Au.",
    level_id: 1,
    topic_id: 1,
    language_id: 1,
    difficulty_level: "hard",
    created_at: new Date(),
    modified_at: new Date(),
  },
];
