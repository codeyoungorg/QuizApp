"use client";
import { Icons } from "../_icons";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "@/components/ui/carousel";
import TopicCard from "./topic-card";
import Lock from "@/public/images/icons/lock.svg";
import Image from "next/image";
import { LanguageDB, LanguageQuiz } from "../learn/_types";
import { cn } from "@/lib/utils";

type Props = {
  level: {
    id: number;
    level: number;
    name: string;
  };
  data: {
    id: number;
    name: string;
    level_id: number;
    languages_quiz: LanguageQuiz[];
    languages_db: LanguageDB[];
  }[];
};

export default function TopicLevel({ level, data }: Props) {
  const totalQuestionsInLevel = data
    ?.filter((d) => d.level_id === level.level)
    .reduce((acc, topic) => acc + topic.languages_db.length, 0);

  const totalLevelPoints = totalQuestionsInLevel * level.level;

  const userPoints = data
    ?.filter((topic) => topic.level_id === level.level)
    .reduce(
      (acc, curr) =>
        acc + curr.languages_quiz.reduce((acc, curr) => acc + curr.points, 0),
      0
    );

  const previousLevelPoints = data
    ?.filter((topic) => topic.level_id === level.level - 1)
    .reduce(
      (acc, curr) =>
        acc + curr.languages_quiz.reduce((acc, curr) => acc + curr.points, 0),
      0
    );

  const totalPreviousLevelPoints =
    data
      ?.filter((d) => d.level_id === level.level - 1)
      .reduce((acc, topic) => acc + topic.languages_db.length, 0) *
    (level.level - 1);

  const isLevelUnlocked =
    level.level === 1 || previousLevelPoints >= totalPreviousLevelPoints * 0.85;

  return (
    <div className="space-y-4" key={level.id}>
      <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center px-4">
        <div className="flex items-center gap-2">
          {!isLevelUnlocked && (
            <div className="bg-[#E5F0F0] w-6 h-6 rounded-full grid place-items-center">
              <Image src={Lock} alt="lock" width={12} height={12} />
            </div>
          )}
          <h1 className="text-[#5B8989] font-semibold text-lg md:text-xl lg:text-2xl">
            {"Level " + level.level + " - "} {level.name}
          </h1>
        </div>
        <div className="w-fit">
          {isLevelUnlocked ? (
            <p className="text-[#5B8989] font-medium text-sm md:text-base flex items-center gap-2">
            <span className="inline-flex items-center">
              {Icons.coin}
            </span>
            <span>
              {userPoints}/{totalLevelPoints}
            </span>
            <span>done</span>
          </p>
          ) : (
            <p className="bg-[#E6EFEF] text-[#5B8989] px-2 py-1 text-sm rounded-md">
              Complete 85% of Level {level.level - 1} to unlock level{" "}
              {level.level}
            </p>
          )}
        </div>
      </div>
      <div className="">
        {data && (
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full relative hidden sm:flex"
          >
            <CarouselContent className="-ml-2">
              {data
                .filter((d) => d.level_id === level.level)
                .map((item, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/2 xl:basis-1/3"
                  >
                    <TopicCard
                      cards={
                        item?.languages_db?.filter(
                          (i: any) => i.level_id === level.level
                        ).length
                      }
                      lock={!isLevelUnlocked}
                      topic={item}
                      levelId={level.id}
                    />
                  </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious
              className={cn(
                "h-full -left-10 rounded-none shadow-md bg-white hover:bg-gray-50 text-[#517B7B] hidden lg:flex"
              )}
            />
            <CarouselNext
              className={cn(
                "h-full -right-10 rounded-none shadow-md bg-white hover:bg-gray-50 text-[#517B7B] hidden lg:flex"
              )}
            />
          </Carousel>
        )}
        {data && (
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full relative sm:hidden"
          >
            <CarouselContent className="-ml-2">
              {chunk(
                data.filter((d) => d.level_id === level.level),
                2
              ).map((group, slideIndex) => (
                <CarouselItem
                  key={slideIndex}
                  className="pl-2 basis-full sm:basis-1/2 lg:basis-1/2 xl:basis-1/3"
                >
                  <div className="grid grid-rows-[auto_auto] gap-4">
                    {group.map((item, index) => (
                      <div key={item.id}>
                        <TopicCard
                          cards={
                            item?.languages_db?.filter(
                              (i: any) => i.level_id === level.level
                            ).length
                          }
                          lock={!isLevelUnlocked}
                          topic={item}
                          levelId={level.id}
                        />
                      </div>
                    ))}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
              className={cn(
                "h-full -left-10 rounded-none shadow-md bg-white hover:bg-gray-50 text-[#517B7B] hidden sm:flex"
              )}
            />
            <CarouselNext
              className={cn(
                "h-full -right-10 rounded-none shadow-md bg-white hover:bg-gray-50 text-[#517B7B] hidden sm:flex"
              )}
            />
          </Carousel>
        )}
      </div>
    </div>
  );
}

function chunk<T>(array: T[], size: number): T[][] {
  const chunked: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
}
