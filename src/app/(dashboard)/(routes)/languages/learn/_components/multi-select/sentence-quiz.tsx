import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, TimerIcon, Volume2 } from "lucide-react";
import { Sentence } from "./sentence";
import { Word } from "./word";
import { AnswerOption, FlashcardData } from "../../_types";
import { cn } from "@/lib/utils";

type FlashcardProps = {
  data: FlashcardData;
  currentCard: number;
  totalCards: number;
  onNextCard: () => void;
  onPrevCard: () => void;
  onAnswer: (isCorrect: boolean) => void;
};

export const Flashcard: React.FC<FlashcardProps> = ({
  data,
  currentCard,
  totalCards,
  onNextCard,
  onPrevCard,
  onAnswer,
}) => {
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [droppedAnswer, setDroppedAnswer] = useState<string | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [availableWords, setAvailableWords] = useState([
    "The",
    "quick",
    "brown",
    "fox",
    "jumps",
    "over",
    "the",
    "lazy",
    "dog",
  ]);
  const [sentence, setSentence] = useState<string[]>([]);

  useEffect(() => {
    // Reset state when the question changes
    setIsCorrect(null);
    setDroppedAnswer(null);
    setShowCorrectAnswer(false);
  }, [data.question, currentCard]);

  const handleDrop = (item: AnswerOption) => {
    const correct = item.text === data.correctAnswer;
    setDroppedAnswer(item.text);
    setIsCorrect(correct);
    setShowCorrectAnswer(true);
    onAnswer(correct);
  };

  const moveWord = useCallback(
    (
      dragIndex: number,
      hoverIndex: number,
      fromArea: string,
      toArea: string
    ) => {
      if (fromArea === "available" && toArea === "sentence") {
        const word = availableWords[dragIndex];
        setAvailableWords((prev) => prev.filter((_, i) => i !== dragIndex));
        setSentence((prev) => [
          ...prev.slice(0, hoverIndex),
          word,
          ...prev.slice(hoverIndex),
        ]);
      } else if (fromArea === "sentence" && toArea === "available") {
        const word = sentence[dragIndex];
        setSentence((prev) => prev.filter((_, i) => i !== dragIndex));
        setAvailableWords((prev) => [...prev, word]);
      } else if (fromArea === "sentence" && toArea === "sentence") {
        setSentence((prev) => {
          const newSentence = [...prev];
          const [movedWord] = newSentence.splice(dragIndex, 1);
          newSentence.splice(hoverIndex, 0, movedWord);
          return newSentence;
        });
      } else if (fromArea === "available" && toArea === "available") {
        setAvailableWords((prev) => {
          const newAvailable = [...prev];
          const [movedWord] = newAvailable.splice(dragIndex, 1);
          newAvailable.splice(hoverIndex, 0, movedWord);
          return newAvailable;
        });
      }
    },
    [availableWords, sentence]
  );

  const checkSentence = () => {
    const correctSentence = "The quick brown fox jumps over the lazy dog";
    setIsCorrect(sentence.join(" ") === correctSentence);
  };

  const resetQuiz = () => {
    setAvailableWords([
      "The",
      "quick",
      "brown",
      "fox",
      "jumps",
      "over",
      "the",
      "lazy",
      "dog",
    ]);
    setSentence([]);
    setIsCorrect(null);
  };

  return (
    <Card
      className="w-full max-w-lg bg-[#faf9f9]"
      style={{
        boxShadow: "0px 8px 16px 0px #00000014",
      }}
    >
      <div className="grid grid-cols-3 items-center p-4 py-2 border-b relative">
        <span className="text-sm text-[#5B8989] text-left w-full">
          {currentCard} of {totalCards}
        </span>
        <div className="w-fit mx-auto flex items-center gap-1 bg-[#E7EEEE] px-2 py-1 rounded-lg border border-[#C0D8D8]">
          <span>
            <TimerIcon className="size-4 text-[#5B8989]" />
          </span>
          <span className="text-sm font-semibold text-[#2F4F4F]">00:45</span>
        </div>
        <div
          className={cn(
            "absolute -bottom-[2px] left-0 h-[4px] rounded-full bg-[#E98451]",
            "w-[10%]"
          )}
        ></div>
      </div>
      <CardContent className="py-6 space-y-6">
        <Sentence words={sentence} moveWord={moveWord} />
        <div
          className="flex flex-wrap justify-center p-2 gap-4 rounded-md"
          aria-label="Available words area"
        >
          {availableWords.map((word, index) => (
            <Word
              key={`available-${word}-${index}`}
              word={word}
              index={index}
              moveWord={moveWord}
              area="available"
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="w-full">
        <div
          className={cn(
            "flex justify-between items-center mt-6 w-full",
            currentCard === 1 && "justify-center"
          )}
        >
          <Button
            variant="ghost"
            onClick={onPrevCard}
            className={cn(
              "text-[#E98451] cursor-pointer",
              currentCard === 1 && "hidden"
            )}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={onNextCard}
            disabled={!droppedAnswer || !isCorrect}
            className="bg-[#E98451] disabled:bg-[#C3B8AC] disabled:opacity-100 text-white cursor-pointer"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
