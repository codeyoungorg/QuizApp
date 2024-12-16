import DefaultLoadingScreen from "@/components/default-loading-screen";

const messages = [
  "Welcome to Noah! We’re setting up your personalized learning adventure - just a moment!",
  "Almost there! Noah is crafting a unique learning path just for you.",
  "Hang tight! Noah is getting ready to guide you on your learning journey.",
];

export default function Loading() {
  return <DefaultLoadingScreen messages={messages} />;
}
