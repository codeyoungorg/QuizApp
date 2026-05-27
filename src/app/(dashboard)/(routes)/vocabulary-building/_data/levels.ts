export type LevelId = "beginner" | "adventurer" | "master";

export type Level = {
  id: LevelId;
  badgeLabel: string;
  badgeEmoji: string;
  badgeBg: string;
  badgeText: string;
  gradeText: string;
  description: string;
  wordsLearnt: number;
  totalWords: number;
  cardBg: string;
};

export const LEVELS: Level[] = [
  {
    id: "beginner",
    badgeLabel: "Beginner Explorer",
    badgeEmoji: "🔍",
    badgeBg: "bg-[#EDE7FF]",
    badgeText: "text-[#7C5CFF]",
    gradeText: "Grades 3-6",
    description: "Start building strong word foundations",
    wordsLearnt: 41,
    totalWords: 200,
    cardBg: "bg-[#F1F4FF]",
  },
  {
    id: "adventurer",
    badgeLabel: "Word Adventurer",
    badgeEmoji: "🧭",
    badgeBg: "bg-[#FFF1E7]",
    badgeText: "text-[#E98451]",
    gradeText: "Grades 7-9",
    description: "Expand your thinking with stronger vocabulary",
    wordsLearnt: 41,
    totalWords: 342,
    cardBg: "bg-[#FFF7EC]",
  },
  {
    id: "master",
    badgeLabel: "Word Master",
    badgeEmoji: "🚀",
    badgeBg: "bg-[#FFE7EE]",
    badgeText: "text-[#E5557A]",
    gradeText: "Grades 10-12",
    description: "Master advanced words and powerful expression",
    wordsLearnt: 41,
    totalWords: 416,
    cardBg: "bg-[#FFEDED]",
  },
];

export const getLevel = (id: string | undefined): Level => {
  return LEVELS.find((l) => l.id === id) ?? LEVELS[0];
};

export const getNextLevel = (id: string | undefined): Level | null => {
  const i = LEVELS.findIndex((l) => l.id === id);
  return i >= 0 && i < LEVELS.length - 1 ? LEVELS[i + 1] : null;
};
