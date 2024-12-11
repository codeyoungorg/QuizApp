import DefaultLoadingScreen from "@/components/default-loading-screen";

const messages = [
  "Getting ready to explore your subjects! Noah is gathering everything you need.",
  "Hang tight! We’re pulling up your subjects, perfectly tailored for you.",
  "Almost there! Noah is preparing the perfect subjects for your learning adventure.",
];

export default function Loading() {
  return <DefaultLoadingScreen messages={messages} />;
}
