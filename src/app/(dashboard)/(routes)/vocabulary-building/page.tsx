import VocabHeader from "./_components/vocab-header";
import StatsRow from "./_components/stats-row";
import LevelsGrid from "./_components/levels-grid";

export default function VocabularyBuildingPage() {
  return (
    <div className="w-full md:max-w-5xl mx-auto pb-10">
      <VocabHeader />
      <StatsRow />
      <LevelsGrid />
    </div>
  );
}
