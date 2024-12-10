'use client'
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import saveGTMEvents from "@/lib/gtm";
import { getCookie } from "cookies-next";


interface CompletionCardProps {
  lang: string;
  topicId: number;
  levelId: number;
  correctAnswers: number;
  totalCards: number;
  cardState: string;
}

export const CompletionCard = ({
  lang,
  topicId,
  levelId,
  correctAnswers,
  totalCards,
  cardState,
}: CompletionCardProps) => {
  const router = useRouter();
  const userId = getCookie("userId");
  const handleTakeQuiz = () => {
    
    saveGTMEvents({
      eventAction: "learn_language_opened",
      label: "student",
      label1: userId?.toString()||null,
      label2: lang,
      label3: topicId?.toString()||null,
      label4: null,
    });
    router.push(
      `/languages/quiz?lang=${lang}&topic=${topicId}&level=${levelId}&cards=${cardState}`
    );
  };

  const percentage = Math.round((correctAnswers / totalCards) * 100);

  return (
    <Card className="w-full max-w-lg bg-[#faf9f9] rounded-2xl">
      <CardContent className="p-6 flex flex-col items-center">
        <div className="mb-6">
          <Trophy className="h-16 w-16 text-[#E98451]" />
        </div>
        <h2 className="text-2xl font-bold text-[#446C6C] mb-2">
          Learning Complete!
        </h2>
        <p className="text-[#5B8989] mb-4 text-center">
          You got {correctAnswers} out of {totalCards} correct ({percentage}%)
        </p>
        <p className="text-[#5B8989] mb-6 text-center">
          Ready to test your knowledge? Take a quiz to reinforce what you've
          learned!
        </p>
        <Button
          onClick={handleTakeQuiz}
          className="bg-[#E98451] text-white hover:bg-[#d77544]"
        >
          Take Quiz
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};
