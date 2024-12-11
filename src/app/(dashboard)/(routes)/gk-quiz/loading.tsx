import DefaultLoadingScreen from "@/components/default-loading-screen";

const messages = [
  "Get set! Noah is cooking up some brain-busting quizzes just for you!",
  "Hold on tight! Noah is fine-tuning the perfect quiz to challenge your super brain!",
  "Almost there! Noah’s magic pencil is writing your quiz questions—get ready!",
];

export default function Loading() {
  return <DefaultLoadingScreen messages={messages} />;
}
