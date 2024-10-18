import React, { useEffect } from "react";
import "./subject-dashboard.css";
import Image from "next/image";
import NoahImage from "@/assets/Images/noah_doubt_solve_dp.svg";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { createQuizBySubject } from "@/actions/quiz.client";
import { grey } from "@mui/material/colors";
import saveGTMEvents from "@/lib/gtm";

const NoahHeader = ({
  subjectId,
  subjectName,
  quizPath,
}: {
  subjectId: number;
  subjectName: string | null;
  quizPath: string;
}) => {
  const userId = getCookie("userId");
  const grade = parseInt(getCookie("grade")!);
  const studentName = getCookie("userName");
  const [isMount, setIsMount] = React.useState(false);
  const [welcomeMessage, setWelcomeMessage] = React.useState("");
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    setIsMount(true);
    const message =
      welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    setWelcomeMessage(message.text);
  }, []);

  const redirectToInsights = () => {
    saveGTMEvents({
      eventAction: "insights_opened",
      label: userId ? "student" : "guest",
      label1: userId || null,
      label2: subjectName,
      label3: null,
      label4: null,
    });
    router.push("/view-insights/" + subjectId);
  };

  const createQuiz = async () => {
    if (!userId || !grade) return;

    try {
      setLoading(true);
      const { quiz, previous } = await createQuizBySubject({
        userId,
        grade,
        subjectId,
      });

      if (quiz && quiz.length > 0) {
        if (previous)
          router.push(`/quiz/${quizPath}/${quiz[0].id}?previous=true`);
        else router.push(`/quiz/${quizPath}/${quiz[0].id}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isMount) return null;
  return (
    <div className="noah-heading-wrapper">
      <div className="noah-image-fact-wrap">
        <div className="noah-image-txtContainer">
          <Image
            src={NoahImage}
            alt="Noah image"
            width={104}
            height={104}
            className="h-[104px]"
          />
          <div className="noah-image-txt">Noah says</div>
        </div>
        <div className="fact-card-container">
          <div className="fact-card">
            <div className="fact-card-txt">
              {welcomeMessage.replace(
                /{name}/g,
                studentName?.split(" ")[0] || ""
              )}
            </div>
          </div>
          <button className="insights-btn" onClick={redirectToInsights}>
            <span className="flex flex-row justify-center items-center gap-[0.5px]">
              View detailed insights
              <Image
                src="/images/icons/arrow-up-right.png"
                alt="arrow-up-right"
                width={20}
                height={20}
              />
            </span>
          </button>
        </div>
      </div>
      <div className="noah-subject-wrap">
        <div className="noah-subject-quiz">
          <div className="noah-subject-text">
            Noah curates quizzes to help you learn better
          </div>
          <button
            className="resume-quizz-btn"
            onClick={async () => {
              saveGTMEvents({
                eventAction: "noah_quiz_initiated",
                label: userId ? "student" : "guest",
                label1: userId || null,
                label2: subjectName,
                label3: null,
                label4: null,
              });
              createQuiz();
            }}
            disabled={loading}
          >
            <span className="flex flex-row justify-center items-center gap-2">
              Continue Quiz
              {loading ? (
                <CircularProgress size={10} sx={{ color: grey[50] }} />
              ) : (
                <Image
                  src="/images/icons/arrow-right.png"
                  alt="arrow-right"
                  width={16}
                  height={16}
                  className="mb-1"
                />
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

const welcomeMessages = [
  {
    text: "Hey {name}, We're thrilled to continue this learning journey with you! I'm here to help you master new concepts and overcome challenges as you work towards your academic goals. Together, we'll explore fascinating topics that spark your curiosity. Remember, {name}, each question you ask is a building block for your future success!",
  },
  {
    text: "Welcome back, {name}! Your dedication to learning is inspiring. I'm excited to guide you through new concepts and help you tackle any obstacles that come your way. We'll dive into thought-provoking subjects and sharpen your analytical skills. {name}, always remember that your growth mindset is your greatest asset!",
  },
  {
    text: "{name}, great to see you! Ready for another exciting learning adventure? I'm pumped to help you uncover new ideas and conquer academic hurdles. We're a team in this journey, exploring intriguing topics and boosting your problem-solving abilities. Hey {name}, don't forget - your questions are the fuel that powers our learning rocket!",
  },
  {
    text: "Welcome, {name}! It's wonderful to have you back on this learning expedition. My role is to support you in grasping complex ideas and turning challenges into victories. We'll embark on fascinating intellectual explorations together, enhancing your critical thinking along the way. {name}, always remember that your curiosity is the key to unlocking new understanding!",
  },
  {
    text: "{name}, welcome aboard! I'm thrilled to continue guiding you towards academic excellence. Together, we'll crack tough concepts and transform obstacles into stepping stones for your success. Get ready to dive into captivating subjects that will expand your intellectual horizons. Remember, {name} - every 'aha!' moment brings you closer to your goals!",
  },
];

export default NoahHeader;
