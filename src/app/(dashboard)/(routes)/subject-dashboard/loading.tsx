import DefaultLoadingScreen from "@/components/default-loading-screen";

const messages = [
  "Hang tight! Noah is preparing your topics and leaderboard.",
  "Almost there! We’re lining up your personalized topics and setting up the leaderboard.",
  "Just a moment! Your learning path and leaderboard are being customized for you.",
];

export default function Loading() {
  return <DefaultLoadingScreen messages={messages} />;
}
