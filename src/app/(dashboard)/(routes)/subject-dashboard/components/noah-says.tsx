import React, { useEffect, useState } from "react";
import "./subject-dashboard.css";
import Image from "next/image";
import NoahImage from "@/assets/Images/noah_doubt_solve_dp.svg";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { createQuizBySubject, getUserQuizHistory } from "@/actions/quiz.client";
import { grey } from "@mui/material/colors";
import saveGTMEvents from "@/lib/gtm";
import { motion, AnimatePresence } from "framer-motion";

const TypewriterEffect = ({ text }: { text: string }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02 }}
          >
            {char}
          </motion.span>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

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
  const [personalizedMessage, setPersonalizedMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [showTypewriter, setShowTypewriter] = useState(false);

  useEffect(() => {
    setIsMount(true);
    fetchQuizHistory();
  }, []);

  const fetchQuizHistory = async () => {
    setIsLoading(true);
    if (userId) {
      const quizHistory = await getUserQuizHistory(userId, subjectId);
      if (quizHistory) {
        const message = generatePersonalizedMessage(quizHistory, subjectName);
        setPersonalizedMessage(message);
      } else {
        setPersonalizedMessage(getDefaultWelcomeMessage());
      }
    } else {
      setPersonalizedMessage(getDefaultWelcomeMessage());
    }
    setIsLoading(false);
    setShowTypewriter(true);
  };

  const getDefaultWelcomeMessage = () => {
    const message =
      welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    return message.text.replace(/{name}/g, studentName?.split(" ")[0] || "");
  };

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

  const generatePersonalizedMessage = (
    quizHistory: any[],
    subjectName: string | null
  ) => {
    const completedQuizzes = quizHistory.filter((quiz) => quiz.complete).length;
    const totalQuestions = quizHistory.reduce(
      (sum, quiz) => sum + quiz.questions.length,
      0
    );
    const correctAnswers = quizHistory.reduce(
      (sum, quiz) =>
        sum + quiz.submissions.filter((sub: any) => sub.isCorrect).length,
      0
    );

    const accuracy =
      totalQuestions > 0
        ? ((correctAnswers / totalQuestions) * 100).toFixed(1)
        : 0;

    const recentQuizzes = quizHistory.slice(0, 3);
    const recentAccuracy =
      recentQuizzes.reduce(
        (sum, quiz) =>
          sum +
          quiz.submissions.filter((sub: any) => sub.is_correct).length /
            quiz.questions.length,
        0
      ) / recentQuizzes.length;

    const improvementRate = recentAccuracy - Number(accuracy) / 100;

    const topicPerformance = quizHistory.reduce((acc, quiz) => {
      const topicId = quiz.metadata?.topic;
      if (topicId) {
        if (!acc[topicId]) {
          acc[topicId] = { correct: 0, total: 0 };
        }
        acc[topicId].correct += quiz.submissions.filter(
          (sub: any) => sub.is_correct
        ).length;
        acc[topicId].total += quiz.questions.length;
      }
      return acc;
    }, {});

    const weakestTopic = Object.entries(topicPerformance).reduce<{
      topicId: string | null;
      accuracy: number;
    }>(
      (weakest, [topicId, performance]) => {
        const topicAccuracy =
          (performance as { correct: number; total: number }).correct /
          (performance as { correct: number; total: number }).total;
        return topicAccuracy < weakest.accuracy
          ? { topicId, accuracy: topicAccuracy }
          : weakest;
      },
      { topicId: null, accuracy: Infinity }
    );

    if (completedQuizzes === 0) {
      return `Welcome to ${subjectName}! I'm excited to help you start your learning journey. Let's begin with a quiz to see where you stand!`;
    } else if (completedQuizzes === 1) {
      return `Great job on completing your first ${subjectName} quiz! You answered ${correctAnswers} out of ${totalQuestions} questions correctly. That's a solid start! Ready to improve your score?`;
    } else if (Number(accuracy) > 80) {
      return `Wow! Your overall accuracy of ${accuracy}% in ${subjectName} is impressive. In your recent quizzes, you've ${
        improvementRate > 0 ? "improved" : "maintained a strong performance"
      }. Keep up the excellent work! Why not challenge yourself with some harder topics?`;
    } else if (Number(accuracy) > 60) {
      return `You're doing well in ${subjectName} with an overall accuracy of ${accuracy}%. ${
        improvementRate > 0
          ? `I've noticed improvement in your recent quizzes - great job!`
          : `There's still room for improvement.`
      } Let's focus on strengthening your knowledge in ${
        weakestTopic.topicId
      } to boost your overall performance.`;
    } else {
      return `You've completed ${completedQuizzes} quizzes in ${subjectName}, which shows great dedication! Your current accuracy is ${accuracy}%. ${
        improvementRate > 0
          ? "I see improvement in your recent quizzes - keep it up!"
          : "Let's work on improving your accuracy."
      } We'll focus on ${
        weakestTopic.topicId
      } to help you build a stronger foundation. Remember, practice makes perfect!`;
    }
  };

  if (!isMount) return null;
  return (
    <div className="noah-heading-wrapper flex items-center">
      <div className="noah-image-fact-wrap flex items-center">
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
              {isLoading ? (
                <CircularProgress size={20} sx={{ color: grey[500] }} />
              ) : (
                showTypewriter && (
                  <TypewriterEffect text={personalizedMessage} />
                )
              )}
            </div>
          </div>
          {/* <button className="insights-btn" onClick={redirectToInsights}>
            <span className="flex flex-row justify-center items-center gap-[0.5px]">
              View detailed insights
              <Image
                src="/images/icons/arrow-up-right.png"
                alt="arrow-up-right"
                width={20}
                height={20}
              />
            </span>
          </button> */}
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
