import type { VocabularyApiLevelId } from "../_types";

export type LevelSlug = "beginner" | "adventurer" | "master";

export type LevelTheme = {
  apiLevelId: VocabularyApiLevelId;
  slug: LevelSlug;
  description: string;
  difficultyLabel: string;
  badgeEmoji: string;
  badgeBg: string;
  badgeText: string;
  cardBg: string;
  progressAccent: string;
};

export const LEVEL_THEMES: LevelTheme[] = [
  {
    apiLevelId: 1,
    slug: "beginner",
    description: "Start building strong word foundations",
    difficultyLabel: "Beginner",
    badgeEmoji: "🔍",
    badgeBg: "bg-[#EDE7FF]",
    badgeText: "text-[#8080FF]",
    cardBg: "bg-[#F5F5FF]",
    progressAccent: "text-[#7C5CFF]",
  },
  {
    apiLevelId: 2,
    slug: "adventurer",
    description: "Expand your thinking with stronger vocabulary",
    difficultyLabel: "Intermediate",
    badgeEmoji: "🧭",
    badgeBg: "bg-[#FFF1E7]",
    badgeText: "text-[#E98451]",
    cardBg: "bg-[#FFF6E5]",
    progressAccent: "text-[#E98451]",
  },
  {
    apiLevelId: 3,
    slug: "master",
    description: "Master advanced words and powerful expression",
    difficultyLabel: "Advanced",
    badgeEmoji: "🚀",
    badgeBg: "bg-[#FFE7EE]",
    badgeText: "text-[#E5557A]",
    cardBg: "bg-[#FFF0F0]",
    progressAccent: "text-[#E5557A]",
  },
];

const DEFAULT_THEME = LEVEL_THEMES[0];

export const getThemeByApiId = (
  apiLevelId: number | undefined
): LevelTheme => {
  return (
    LEVEL_THEMES.find((t) => t.apiLevelId === apiLevelId) ?? DEFAULT_THEME
  );
};

export const getThemeBySlug = (slug: string | undefined): LevelTheme => {
  return LEVEL_THEMES.find((t) => t.slug === slug) ?? DEFAULT_THEME;
};

export const getNextThemeByApiId = (
  apiLevelId: number | undefined
): LevelTheme | null => {
  const i = LEVEL_THEMES.findIndex((t) => t.apiLevelId === apiLevelId);
  if (i < 0 || i >= LEVEL_THEMES.length - 1) return null;
  return LEVEL_THEMES[i + 1];
};
