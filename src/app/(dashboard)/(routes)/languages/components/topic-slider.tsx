"use client";

import Slider from "react-slick";
import TopicCard from "./topic-card";
import { LockKeyhole } from "lucide-react";
import Lock from "@/public/images/icons/lock.svg";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getLanguageTopics } from "@/actions/language.actions";

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 2,
  initialSlide: 0,
  rows: 1,
  nextArrow: (
    <div className="carousel-buttons">
      <div className="next-slick-arrow rounded-[8px] xs:w-[15px] xs:h-[15px] md:w-[24px] md:h-[24px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          stroke="black"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          className="xs:w-[15px] xs:h-[15px] md:w-[24px] md:h-[24px]"
        >
          <path d="m242-200 200-280-200-280h98l200 280-200 280h-98Zm238 0 200-280-200-280h98l200 280-200 280h-98Z" />
        </svg>
      </div>
    </div>
  ),
  prevArrow: (
    <div className="carousel-buttons">
      <div className="next-slick-arrow rotate-180 xs:w-[15px] xs:h-[15px] md:w-[24px] md:h-[24px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          stroke="black"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          className="xs:w-[15px] xs:h-[15px] md:w-[24px] md:h-[24px]"
        >
          <path d="m242-200 200-280-200-280h98l200 280-200 280h-98Zm238 0 200-280-200-280h98l200 280-200 280h-98Z" />
        </svg>
      </div>
    </div>
  ),
  responsive: [
    {
      breakpoint: 500,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        rows: 1,
        dots: false,
      },
    },
    {
      breakpoint: 800,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        rows: 1,
        dots: false,
      },
    },
  ],
};

export default function TopicSlider({
  levels,
}: {
  levels: { id: number; level: number; name: string; points: number }[];
}) {
  const { data, isFetching, error } = useQuery({
    queryKey: ["language_topics"],
    queryFn: async () => {
      return await getLanguageTopics();
    },
  });
  return (
    <div className="space-y-16 py-6 pb-16">
      <div className="text-xl md:text-2xl lg:text-3xl font-semibold text-center space-y-1">
        <h1 className="text-[#5B8989]">
          <span className="bg-gradient-to-br from-pink-500 to-yellow-500 text-transparent bg-clip-text">
            Master
          </span>{" "}
          every topic
        </h1>
        <h1 className="text-[#5B8989]">
          Progress through levels with more{" "}
          <span className="bg-gradient-to-br from-yellow-500 to-pink-500 text-transparent bg-clip-text">
            practice
          </span>
        </h1>
      </div>
      {levels.map((level) => (
        <div className="space-y-4" key={level.id}>
          <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center px-4">
            <div className="flex items-center gap-2">
              <div className="bg-[#E5F0F0] w-6 h-6 rounded-full grid place-items-center">
                <Image src={Lock} alt="lock" width={12} height={12} />
              </div>
              <h1 className="text-[#5B8989] font-semibold text-lg md:text-xl lg:text-2xl">
                {"Level " + level.level + " - "} {level.name}
              </h1>
            </div>
            <div className="w-fit">
              {level.level === 1 ? (
                <p className="text-[#5B8989] font-medium text-sm md:text-base">
                  🪙80/110 done
                </p>
              ) : (
                <p className="bg-[#E6EFEF] text-[#5B8989] px-2 py-1 text-sm rounded-md">
                  Complete Level {level.level - 1} to unlock level {level.level}
                </p>
              )}
            </div>
          </div>
          {data && (
            <Slider {...settings}>
              {data
                .filter((d) => d.level_id === level.level)
                .map((item, index) => (
                  <TopicCard
                    key={index}
                    cards={item.flashcards}
                    lock={level.level === 1 ? false : true}
                    topic={item}
                    levelId={level.id}
                  />
                ))}
            </Slider>
          )}
        </div>
      ))}
    </div>
  );
}

// const levels = [
//   {
//     id: 1,
//     title: "Learning words",
//     level: 1,
//     lock: false,
//   },
//   {
//     id: 2,
//     title: "Making Sentences",
//     level: 2,
//     lock: true,
//   },
//   {
//     id: 3,
//     title: "Making Conversation",
//     level: 3,
//     lock: true,
//   },
// ];

const content = [
  {
    icon: "🌞",
    title: "Basic noun",
    flashcards: 20,
  },
  {
    icon: "🎃",
    title: "Simple adjective",
    flashcards: 20,
  },
  {
    icon: "🤝",
    title: "Greetings",
    flashcards: 20,
  },
  {
    icon: "🎲",
    title: "Numbers",
    flashcards: 20,
  },
  {
    icon: "🍎",
    title: "Fruits & Vegetables",
    flashcards: 20,
  },
  {
    icon: "🖌️",
    title: "Colors",
    flashcards: 20,
  },
  {
    icon: "🦁",
    title: "Animals",
    flashcards: 20,
  },
];
