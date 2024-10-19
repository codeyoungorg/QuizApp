import ScoreCard from "./_components/score";
import UpcomingTopics from "./_components/upcoming-topics";

export default async function ResultPage({
  searchParams,
}: {
  searchParams: { lang: string };
}) {
  return (
    <div className="">
      <ScoreCard lang={searchParams.lang} />
      <UpcomingTopics />
    </div>
  );
}
