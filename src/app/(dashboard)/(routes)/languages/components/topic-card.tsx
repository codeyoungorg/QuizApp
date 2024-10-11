"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Lock from "@/public/images/icons/lock-white.png";

type TopicCardProps = {
  lock: boolean;
  cards: number;
  topic: { id: number; name: string };
  levelId: number;
};

export default function TopicCard({
  cards,
  lock,
  topic,
  levelId,
}: TopicCardProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang");

  const getIcon = (topic: string) => {
    switch (topic) {
      case "Animals and Nature":
        return "🐶";
      case "Body Parts":
        return "👃";
      case "Colors":
        return "🌈";
      case "Everyday Objects":
        return "📱";
      case "Family Members":
        return "👪";
      case "Food and Drinks":
        return "🍔";
      case "Shapes":
        return "🔶";
    }
  };

  return (
    <div className="px-2">
      <Card
        className={cn(
          "w-full shadow-none rounded-2xl",
          lock ? "bg-[#FAFAFA]" : "bg-[#F5F9FF]"
        )}
        style={{
          boxShadow: "0px 0px 8px 0px #0053F429",
        }}
      >
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-xl">{getIcon(topic.name)}</span>
            <h3 className="text-lg md:text-xl font-semibold text-[#517B7B]">
              {topic.name}
            </h3>
          </div>
          <p className="text-sm text-[#A3A3A3] font-medium">
            {cards} flash cards available
          </p>
        </CardContent>
        {lock ? (
          <CardFooter className="flex justify-between p-6 pt-6 gap-6">
            <Button
              disabled={lock}
              onClick={() => {}}
              className="bg-[#C3B8AC] hover:bg-[#C3B8AC]/80 disabled:opacity-1000 rounded-lg text-white w-fit items-center flex"
            >
              Start Learning{" "}
              <Image
                src={Lock}
                alt="lock"
                width={12}
                height={12}
                className="ml-2"
              />
            </Button>
          </CardFooter>
        ) : (
          <CardFooter className="flex justify-between p-6 pt-6 gap-6">
            <Button
              onClick={() =>
                router.push(
                  `/languages/learn?lang=${lang}&topic=${topic.id}&level=${levelId}`
                )
              }
              className="bg-[#F0A919] hover:bg-yellow-500 text-white w-full"
            >
              Learn
            </Button>
            <Button
              onClick={() =>
                router.push(
                  `/languages/quiz?lang=${lang}&topic=${topic.id}&level=${levelId}`
                )
              }
              className="bg-[#E98451] hover:bg-orange-500 text-white w-full"
            >
              Practice
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
