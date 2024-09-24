"use client";

import Slider from "react-slick";
import TopicCard from "./topic-card";

export default function TopicSlider() {
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
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 1,
          dots: false,
        },
      },
    ],
  };
  return (
    <div className="space-y-16 py-6 pb-16">
      <div className="text-lg md:text-2xl lg:text-3xl font-semibold text-center space-y-1">
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
      {levels.map((item) => (
        <div className="" key={item.id}>
          <Slider {...settings}>
            {content.map((item, index) => (
              <TopicCard
                key={index}
                title={item.title}
                icon={item.icon}
                cards={item.flashcards}
              />
            ))}
          </Slider>
        </div>
      ))}
    </div>
  );
}

const levels = [
  {
    id: 1,
    title: "Learning words",
    level: 1,
  },
  {
    id: 2,
    title: "Making Sentences",
    level: 2,
  },
  {
    id: 3,
    title: "Making Conversation",
    level: 3,
  },
];

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
