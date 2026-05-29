import { LEVEL_THEMES } from "../_data/levels";
import LevelCard from "./level-card";
import type { VocabularyStatsLevel } from "../_types";

type LevelsGridProps = {
  levels: VocabularyStatsLevel[];
};

export default function LevelsGrid({ levels }: LevelsGridProps) {
  const ordered = LEVEL_THEMES.map((theme) => {
    const apiLevel = levels.find((l) => l.levelId === theme.apiLevelId);
    return {
      theme,
      name: apiLevel?.name ?? "",
      grades: apiLevel?.grades ?? "",
      learned: apiLevel?.learned ?? 0,
      total: apiLevel?.total ?? 0,
    };
  });

  return (
    <div className="px-4 md:px-0 mt-8">
      <h2 className="text-lg font-semibold text-[#404040] mb-3">
        Pick a level:
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {ordered.map((item) => (
          <LevelCard
            key={item.theme.apiLevelId}
            theme={item.theme}
            name={item.name}
            grades={item.grades}
            learned={item.learned}
            total={item.total}
          />
        ))}
      </div>
    </div>
  );
}
