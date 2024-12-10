"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { createQuizBySubject } from "@/actions/quiz.client";
import constants from "@/constants/constants";
import { getIcon } from "@/utils/get-icon";

interface SubjectCardProps {
  Icon: React.ComponentType<{ className?: string }>;
  subject: string;
  isSelected: boolean;
  onClick: () => void;
  color: "sky" | "emerald" | "indigo";
}

export default function QuickQuiz() {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const userId = getCookie("userId");
  const grade = parseInt(getCookie("grade")!);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsVisible(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleStartQuiz = async () => {
    if (!selectedSubject || !userId || !grade) return;

    let subjectId: number;
    let quizPath: string;

    // Map selected subject to subjectId and quizPath
    switch (selectedSubject) {
      case "Mathematics":
        subjectId = constants.SUBJECT_IDS.MATH;
        quizPath = "math";
        break;
      case "Science":
        subjectId = constants.SUBJECT_IDS.SCIENCE;
        quizPath = "science";
        break;
      case "English":
        subjectId = constants.SUBJECT_IDS.ENGLISH;
        quizPath = "english";
        break;
      default:
        return;
    }

    try {
      setLoading(true);

      const { quiz } = await createQuizBySubject({
        userId,
        grade,
        subjectId,
      });

      if (quiz && quiz.length > 0) {
        router.push(`/quiz/${quizPath}/${quiz[0].id}`);
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full mb-8"
        >
          <div className="w-full bg-[#F5F9FF] p-6 rounded-xl">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-[#5b8989] text-center mb-2">
                Let's Play a Quiz Game!
              </h2>
              <p className="text-xl text-[#5b8989] text-center mb-8">
                Just 5 Questions to showcase your brilliance
              </p>

              <div className="grid grid-cols-3 gap-8 mb-8">
                <SubjectCard
                  Icon={() => getIcon("Math")}
                  subject="Mathematics"
                  isSelected={selectedSubject === "Mathematics"}
                  onClick={() => setSelectedSubject("Mathematics")}
                  color="sky"
                />
                <SubjectCard
                  Icon={() => getIcon("Science")}
                  subject="Science"
                  isSelected={selectedSubject === "Science"}
                  onClick={() => setSelectedSubject("Science")}
                  color="emerald"
                />
                <SubjectCard
                  Icon={() => getIcon("English")}
                  subject="English"
                  isSelected={selectedSubject === "English"}
                  onClick={() => setSelectedSubject("English")}
                  color="indigo"
                />
              </div>

              <div className="text-center">
                {selectedSubject && (
                  <Button
                    size="lg"
                    className="bg-white hover:bg-[#5b8989]/10 text-[#5b8989] px-8 py-2 rounded-lg text-lg font-semibold border border-[#5b8989]/40 transition-colors"
                    onClick={handleStartQuiz}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        Loading...
                        {/* You can add a loading spinner here */}
                      </div>
                    ) : (
                      `Let's Start ${selectedSubject}`
                    )}
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-center mt-6 text-[#5b8989]">
                <span className="inline-block mr-2">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="text-lg">
                  Time left: <span className="font-medium">{timeLeft}</span>{" "}
                  seconds
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SubjectCard({
  Icon,
  subject,
  isSelected,
  onClick,
  color,
}: SubjectCardProps) {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      scale: isSelected ? 1.1 : 1,
      rotate: isSelected ? [0, -5, 5, -5, 5, 0] : 0,
      transition: { duration: 0.5 },
    });
  }, [isSelected, controls]);

  // Create a color mapping object for different states
  const colorStyles = {
    sky: {
      selected: "bg-white border-2 border-sky-300 text-sky-500",
      default: "bg-white text-sky-500 hover:border-2 hover:border-sky-300",
      iconBg: "bg-sky-100",
    },
    emerald: {
      selected: "bg-white border-2 border-emerald-300 text-emerald-500",
      default:
        "bg-white text-emerald-500 hover:border-2 hover:border-emerald-300",
      iconBg: "bg-emerald-100",
    },
    indigo: {
      selected: "bg-white border-2 border-indigo-300 text-indigo-500",
      default:
        "bg-white text-indigo-500 hover:border-2 hover:border-indigo-300",
      iconBg: "bg-indigo-100",
    },
  };

  const currentColor = colorStyles[color as keyof typeof colorStyles];

  return (
    <motion.button
      animate={controls}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex w-full flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 ${
        isSelected ? currentColor.selected : currentColor.default
      }`}
      aria-pressed={isSelected}
    >
      <motion.div
        className={`p-4 rounded-full mb-4 ${currentColor.iconBg}`}
        animate={{ rotate: isSelected ? [0, -10, 10, -10, 10, 0] : 0 }}
        transition={{ duration: 0.5 }}
      >
        <Icon />
      </motion.div>
      <span className="text-lg font-bold text-center">{subject}</span>
    </motion.button>
  );
}
