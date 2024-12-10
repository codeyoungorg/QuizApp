"use client";
import React, { useState, useEffect } from "react";
import "@/components/home-page.css";
import Image from "next/image";
import noahImage from "@/assets/Images/noahHomepageImage.png";
import noahHeadingImage from "@/assets/Images/NoahHeading.png";
import { useRouter } from "next/navigation";
import { createGKQuiz, getGKQuestions } from "@/actions/gk-quiz";
import { getCookie } from "cookies-next";
import saveGTMEvents from "@/lib/gtm";
import NewIcon from "@/public/images/icons/new-icon.png";

type Props = {
  userId: string;
  mathQuiz: any;
  gkQuiz: any;
  doubtChats: any;
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
}: Props) => {
  const router = useRouter();

  const [quizData] = useState<QuizData | null>({
    numberOfCompletedQuiz: gkQuiz?.value?.numberOfCompletedQuiz || 0,
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
          {numberOfCompletedQuiz > 0 && (
            <span>
              <strong>{numberOfCompletedQuiz}</strong> questions completed
            </span>
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
          <span>
            <strong>{quizData.numberOfCompletedQuiz}</strong> questions
            completed
          </span>
        ) : (
          ""
        ),
    },
    {
      title: "Ask a Doubt",
      subtitle:
        "Chat with Noah real time to get any of your doubts resolved or discuss any topic",
      description: totalDoubtChats ? (
        <span>
          <strong>{totalDoubtChats}</strong> chats completed
        </span>
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
  }, []);

  const generateGKQuiz = async () => {
    try {
      const { questions, topics } = await getGKQuestions(userId);
      if (questions.length === 0) {
        return;
      }

      // create gk quiz and redirect to gk-quiz page
      const data = await createGKQuiz(userId, questions, topics);
      if (!data || !data!.length) return;
      router.push(`/gk-quiz/${data[0]?.id}`);
    } catch (error) {
      console.log(error);
      return;
    }
  };

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
      generateGKQuiz();
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
        {/* <QuickQuiz /> */}
        <div className="cardContainer">
          <div className="cardHeading">What do you want to do today?</div>
          <div className="cardsWrapper">
            {cards.map((card, index) => (
              <div key={index} className="cardLayout">
                <div className="lg:m-6 md:m-2 lg:p-0 xs:p-4 h-5/6 relative flex flex-col gap-4">
                  <div className="cardTitle">{card.title}</div>
                  <div className="cardSubTitle">{card.subtitle}</div>
                 <div className="additionalText">  {card.additionalText}</div>
                  
                  <div className=" boxContainer flex flex-col gap-4 ">
                  {getCookie("userRole") !== "guest" && (
                    <div className="cardDescription">{card.description}</div>
                  )}
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
  );
};

export default HomePage;
