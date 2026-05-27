import { LEVELS } from "../_data/levels";
import LevelCard from "./level-card";

export default function LevelsGrid() {
  return (
    <div className="px-4 md:px-0 mt-8">
      <h2 className="text-lg font-semibold text-[#446C6C] mb-3">
        Pick a level:
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {LEVELS.map((level) => (
          <LevelCard key={level.id} level={level} />
        ))}
      </div>
    </div>
  );
}
