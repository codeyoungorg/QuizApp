import DefaultLoadingScreen from "@/components/default-loading-screen";

const messages = [
  "Hold on! We’re gathering your strengths and areas for improvement.",
  "Almost there! Noah is analyzing your progress to deliver personalized insights.",
  "Just a moment! Your detailed insights are being tailored to help you grow.",
];

export default function Loading() {
  return <DefaultLoadingScreen messages={messages} />;
}
