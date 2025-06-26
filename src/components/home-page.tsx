"use client";
import noahHeadingImage from "@/assets/Images/NoahHeading.png";
import noahImage from "@/assets/Images/noahHomepageImage.png";
import GKCategoryDialog from "@/components/gk-category-dialog";
import "@/components/home-page.css";
import saveGTMEvents from "@/lib/gtm";
import chatsCompleted from "@/public/images/icons/chatsCompleted.png";
import NewIcon from "@/public/images/icons/new-icon.png";
import star from "@/public/images/icons/pointsStar.svg";
import { getCookie } from "cookies-next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {
  userId: string;
  mathQuiz: any;
  gkQuiz: any;
  doubtChats: any;
  gkCategories: string[];
  grade: number;
};

type QuizData = {
  numberOfCompletedQuiz: number;
  level: number;
  totalQuiz: number;
};

const HomePage: React.FC<Props> = ({
  userId,
  mathQuiz,
  gkQuiz,
  doubtChats,
  gkCategories,
  grade,
}: Props) => {
  const router = useRouter();

  const [showCategoryDialog, setShowCategoryDialog] = useState(false);

  const [quizData] = useState<QuizData | null>({
    numberOfCompletedQuiz: gkQuiz?.value?.numberOfPointsEarned || 0,
    level: gkQuiz?.value?.level || 1,
    totalQuiz: gkQuiz?.value?.totalQuiz || 0,
  });
  const [totalDoubtChats] = useState<number>(doubtChats?.value || 0);
  const [numberOfCompletedQuiz] = useState<number>(mathQuiz?.value || 0);

  const cards = [
    {
      title: "Learn",
      additionalText: (
        <div className="text-[#e89861] bg-[#fff5eb] px-2 py-2 rounded-lg font-medium flex flex-row w-fit text-sm items-center gap-2">
          <Image
            src={NewIcon}
            alt="new-icon"
            width={512}
            height={512}
            className="w-5 h-5"
          />
          Learn languages on Noah
        </div>
      ),
      subtitle:
        "Learn through quizzes on different academic subjects tailored for you",
      description: (
        <>
          {numberOfCompletedQuiz > 0 ? (
            <div className="flex flex-row items-center">
              <Image
                src={star}
                alt="new-icon"
                width={16}
                height={16}
                className="w-5 h-5 mr-1"
              />
              {numberOfCompletedQuiz} pts
            </div>
          ) : (
            ""
          )}
        </>
      ),
    },
    {
      title: "Fun Trivia",
      subtitle:
        "Test your general knowledge skills across various topics through quizzes",
      description:
        quizData && quizData?.numberOfCompletedQuiz ? (
          <div className="flex flex-row items-center">
            <Image
              src={star}
              alt="new-icon"
              width={16}
              height={16}
              className="w-5 h-5 mr-1"
            />
            {quizData.numberOfCompletedQuiz} pts
          </div>
        ) : (
          ""
        ),
    },
    {
      title: "Ask a Doubt",
      subtitle:
        "Chat with Noah real time to get any of your doubts resolved or discuss any topic",
      description: totalDoubtChats ? (
        <div className="flex flex-row items-center">
          <Image
            src={chatsCompleted}
            alt="new-icon"
            width={14}
            height={14}
            className="w-5 h-5 mr-1"
          />
          {totalDoubtChats} chats completed
        </div>
      ) : (
        ""
      ),
    },
  ];

  useEffect(() => {
    const userId = getCookie("userId");

    saveGTMEvents({
      eventAction: "noah_homepage",
      label: userId ? "student" : "guest",
      label1: userId || null,
      label2: null,
      label3: null,
      label4: null,
    });
    if (!userId) {
      window.open(process.env.NEXT_PUBLIC_SANDBOX_URL, "_self");
    }
     const params = new URLSearchParams(window.location.search);
    const fromParam = params.get("from");
    const triviaParam = params.get("trivia");
    if (fromParam === "sandbox" && triviaParam === "1") {
      saveGTMEvents({
        eventAction: "general_opened",
        label: userId ? "student" : "guest",
        label1: userId || null,
        label2: null,
        label3: null,
        label4: null,
      });
      setShowCategoryDialog(true);
    }
  }, []);

  const handleButtonClick = (title: string) => {
    const userId = getCookie("userId");
    if (title === "Fun Trivia") {
      saveGTMEvents({
        eventAction: "general_opened",
        label: userId ? "student" : "guest",
        label1: userId || null,
        label2: null,
        label3: null,
        label4: null,
      });
      setShowCategoryDialog(true);
    } else if (title === "Ask a Doubt") {
      saveGTMEvents({
        eventAction: "doubt_clicked",
        label: userId ? "student" : "guest",
        label1: userId || null,
        label2: null,
        label3: null,
        label4: null,
      });
      router.push("/chat-bot");
    } else if (title === "Learn") {
      saveGTMEvents({
        eventAction: "academics_opened",
        label: userId ? "student" : "guest",
        label1: userId || null,
        label2: null,
        label3: null,
        label4: null,
      });
      router.push("/student-dashboard");
    }
  };

  return (
    <>
      <div className="flex flex-row justify-center pb-5">
        <div className="parentDiv">
          <div className="titleSectionWrapper">
            <div className="titleTxt">
              <div className="flex flex-row xs:justify-center md:justify-start">
                <Image
                  src={noahHeadingImage}
                  alt="Noah heading"
                  height={42}
                  width={151}
                  className="noahHeadingImg"
                />
              </div>
              <div className="subHeadingTxt">Built to make you better.</div>
            </div>
            <div className="noahHomeIcon">
              <Image
                src={noahImage}
                alt="Noah image"
                height={222}
                width={266}
                className="md:w-[266px] md:h-[222px] xs:w-[206px] xs:h-[172px]"
              />
            </div>
          </div>
          <div className="cardContainer">
            <div className="cardHeading">What do you want to do today?</div>
            <div className="cardsWrapper">
              {cards.map((card, index) => (
                <div key={index} className="cardLayout">
                  <div className="lg:m-6 md:m-2 lg:p-0 xs:p-4 h-5/6 relative flex flex-col gap-4">
                    <div className="cardTitle">{card.title}</div>
                    <div className="cardSubTitle">{card.subtitle}</div>
                    {getCookie("userRole") !== "guest" && (
                      <div className={card.description && "cardDescription"}>
                        {card.description}
                      </div>
                    )}
                    <div className=" boxContainer flex flex-col gap-4 ">
                      <div className="additionalText">
                        {" "}
                        {card.additionalText}
                      </div>
                      <div className="">
                        <button
                          className="getStartedBtn"
                          onClick={() => handleButtonClick(card.title)}
                        >
                          <span className="flex flex-row justify-center gap-2">
                            Get Started
                            <Image
                              src="/images/icons/arrow-right.png"
                              alt="arrow-right"
                              width={16}
                              height={16}
                              className="mb-1"
                            />
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <GKCategoryDialog
        isOpen={showCategoryDialog}
        onClose={() => setShowCategoryDialog(false)}
        categories={gkCategories}
        grade={grade}
        userId={userId}
      />
    </>
  );
};

export default HomePage;
