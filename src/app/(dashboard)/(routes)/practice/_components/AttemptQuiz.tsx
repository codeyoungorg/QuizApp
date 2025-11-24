import { useMemo, useState, useCallback } from "react";
import classNames from "clsx";
import { Button } from "@/components/newFlow/ui/buttons";
import { ProgressSteps } from "@/components/newFlow/ui/progressStepper";
import { ArrowRight, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { McqOption } from "@/components/newFlow/ui/McqOption";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { FeedbackModel } from "./FeedbackModel";
import { SubmissionType } from "@/types/quiz.types";
import axios from "axios";
import { ErrorToast, SuccessToast } from "@/utils/getToast";
import { AttemptQuizProps, FEEDBACK_TYPES, Option } from "../types";
import { useExitBtn } from "../useExitBtn";
import { captureEvent } from "@/lib/quiz/apiClient";
import ExitModel from "./ExitModel";
import { Frown, RefreshCw } from "lucide-react";

export const AttemptQuiz = ({
  isReviewQuiz,
  setIsReviewQuiz,
  setIsShowScore,
  quizData,
  userData,
  submissions,
  setSubmissions,
  resetQuiz,
  handleQuizEnd,
}: AttemptQuizProps) => {
  const questions = quizData?.questions || [];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [feedbackType, setFeedbackType] = useState<"good" | "bad" | null>(null);

  const [loadingNextQuestion, setLoadingNextQuestion] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  const currentQuestion = useMemo(() => {
    if (!questions.length) return null;
    return questions[currentQuestionIndex - 1];
  }, [currentQuestionIndex, questions]);

  const isLastQuestion = currentQuestionIndex === questions.length;
  const isFirstQuestion = currentQuestionIndex === 1;
  const canNavigateNext = isReviewQuiz || selectedOption;

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 1) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex]);

  const handleOptionSelect = useCallback(
    (option: Option, index: number) => {
      if (!isReviewQuiz && option) {
        setSelectedOption({
          text: option.text,
          correct: option.correct,
          index,
        });
      }
    },
    [isReviewQuiz, currentQuestionIndex]
  );

  const createSubmissionPayload = useCallback(
    (submissionList: SubmissionType[]) => {
      if (!currentQuestion || !selectedOption) return null;

      const options = currentQuestion.options || [];
      const index = selectedOption.index;
      const isCorrect = options[index]?.correct === "true";

      const currentSubmission = {
        topicId: userData.topicId,
        questionId: currentQuestion.id,
        selected: options[index],
        isCorrect,
        correctOption: options.find((option: any) => option.correct === "true")
          ?.text,
      };

      return {
        quizId: quizData?.id,
        userId: userData.id,
        grade: userData.grade,
        subjectId: userData.subjectId,
        submissions: submissionList,
        currentSubmission,
      };
    },
    [currentQuestion, selectedOption, quizData?.id, userData]
  );

  const submitAnswer = useCallback(async (payload: any) => {
    try {
      setLoadingNextQuestion(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_QUIZ_API}/quiz/submission`,
        payload
      );

      await captureEvent({
        data: {
          type: "coding",
          subject: currentQuestion!?.metadata?.subject,
          topicId: userData.topicId,
          difficulty: [currentQuestion?.difficulty_level!],
          quizId: parseInt(quizData?.id! as unknown as string),
          questionId: [currentQuestion?.id!],
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error submitting answer:", error);
      ErrorToast("Failed to submit answer.");
      throw error;
    } finally {
      setLoadingNextQuestion(false);
    }
  }, []);

  const completeQuiz = async () => {
    try {
      setLoadingNextQuestion(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_QUIZ_API}/quiz/submission/complete`,
        {
          quizId: quizData?.id,
          userId: userData.id,
        }
      );
    } catch (error) {
      throw error;
    } finally {
      setLoadingNextQuestion(false);
    }
  };

  const handleNextQuestion = async () => {
    if (isReviewQuiz) {
      if (isLastQuestion) {
        setIsShowScore(true);
        setIsReviewQuiz(false);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
      return;
    }

    if (selectedOption && currentQuestion) {
      const options = currentQuestion.options || [];
      const index = selectedOption.index;
      const isCorrect = options[index]?.correct === "true";

      const newSubmission = {
        questionId: currentQuestion.id as unknown as string,
        selected: options[index],
        isCorrect,
      };

      const updatedSubmissions = [...submissions, newSubmission];
      const payload = createSubmissionPayload(updatedSubmissions);

      let isQuestionSubmitted = false;
      if (payload) {
        try {
          await submitAnswer(payload);
          isQuestionSubmitted = true;
          setSubmissions(updatedSubmissions);
          setSelectedOption(null);
        } catch (error) {
          ErrorToast("Failed to submit answer.");
          return;
        }
      }

      if (isLastQuestion && isQuestionSubmitted) {
        try {
          await completeQuiz();
          await handleQuizEnd();
          setIsShowScore(true);
          setIsReviewQuiz(false);
          SuccessToast("Quiz completed successfully");
        } catch {
          ErrorToast("Failed to complete quiz.");
          return;
        }
      }
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleFeedback = useCallback((type: "good" | "bad") => {
    setFeedbackType(type);
  }, []);

  const renderQuestionOptions = () => {
    if (!currentQuestion?.options) return null;

    const optionState = (option: Option) => {
      if (isReviewQuiz) {
        const submittedOption = submissions.find(
          (submission) =>
            submission.questionId === (currentQuestion.id as unknown as string)
        );

        return submittedOption?.selected.text === option!.text
          ? submittedOption.isCorrect
            ? "correct"
            : "incorrect"
          : option!.correct === "true"
          ? "correct"
          : "unselected";
      } else {
        return selectedOption?.text === option!.text
          ? "selected"
          : "unselected";
      }
    };

    return (
      <div className="mt-4 flex flex-col gap-4">
        {currentQuestion.options.map((option: any, index: number) => (
          <McqOption
            key={index}
            label={option.text}
            onSelect={() => handleOptionSelect(option, index)}
            state={optionState(option)}
          />
        ))}
      </div>
    );
  };

  const renderNavigationButtons = () => {
    const showPreviousButton = isReviewQuiz && !isFirstQuestion;
    const buttonText = (() => {
      if (loadingNextQuestion) return "Submitting...";
      if (isLastQuestion) return isReviewQuiz ? "Go to Score" : "Finish";
      return "Next";
    })();

    return (
      <div
        className={classNames(
          "mt-4 flex gap-3",
          isReviewQuiz ? "justify-center" : ""
        )}
      >
        {showPreviousButton && (
          <Button
            variant="ghost"
            className="flex gap-2.5 w-full sm:max-w-[168px]"
            onClick={handlePreviousQuestion}
          >
            <ArrowCircleRightIcon className="ml-2 rotate-180" />
            <span>Previous</span>
          </Button>
        )}

        <Button
          variant="primary"
          className={classNames(
            "flex justify-between w-full sm:max-w-[168px]",
            isReviewQuiz ? "" : "sm:mx-auto"
          )}
          disabled={!canNavigateNext || loadingNextQuestion}
          onClick={handleNextQuestion}
        >
          <span>{buttonText}</span>
          <ArrowCircleRightIcon />
        </Button>
      </div>
    );
  };

  const renderFeedbackSection = () => {
    if (isReviewQuiz) return null;

    return (
      <>
        <div className="mt-10">
          <Button
            variant="secondary"
            className="flex justify-between w-full max-w-[250px] mx-auto rounded-[32px]"
          >
            <span className="text-sm text-app-text-grey font-semibold mr-4">
              Rate this question
            </span>
            <div className="flex items-center gap-4">
              <ThumbsUp
                size={18}
                onClick={() => handleFeedback(FEEDBACK_TYPES.GOOD)}
              />
              <ThumbsDown
                size={18}
                onClick={() => handleFeedback(FEEDBACK_TYPES.BAD)}
              />
            </div>
          </Button>
        </div>

        {feedbackType && (
          <FeedbackModel
            feedbackType={feedbackType}
            setFeedbackType={setFeedbackType}
            feedbackData={{
              questionId: (currentQuestion?.id as unknown as string)!,
              userId: userData?.id!,
            }}
          />
        )}
      </>
    );
  };

  const { handleExit } = useExitBtn(resetQuiz);

  const gotoScore = () => {
    if (isReviewQuiz) {
      setIsReviewQuiz(false);
      setIsShowScore(true);
      return;
    }
    setIsExitModalOpen(true);
  };

  return (
    <section className="w-full max-w-[810px] mx-auto py-5">
      <div className="flex justify-between items-center mb-10">
        <ProgressSteps
          current={currentQuestionIndex}
          total={questions.length}
          className="w-[150px]"
        />
        <Button variant="secondary" onClick={gotoScore}>
          {isReviewQuiz ? (
            <>
              Go to scores <ArrowRight />
            </>
          ) : (
            <>
              Exit <X />
            </>
          )}
        </Button>
        <ExitModel
          isOpen={isExitModalOpen}
          onClose={() => setIsExitModalOpen(false)}
          onConfirm={handleExit}
        />
      </div>

      {currentQuestion === null ? (
        <div className="flex flex-col gap-4 items-center mt-28">
          <Frown className="size-6" />
          <p className="text-app-black font-bold">Opps!</p>
          <p className="text-app-grey text-sm font-semibold">
            We are sorry, but it looks like an error has occurred.
          </p>
          <Button
            className="rounded-[18px]"
            variant="secondary"
            onClick={() => {
              resetQuiz();
            }}
          >
            <RefreshCw className="mr-2 size-4" />
            Refresh
          </Button>
        </div>
      ) : (
        <div className="border border-[#E6E6E6] p-5 sm:p-9 rounded-xl">
          <p className="font-bold text-app-text-black">
            {currentQuestion?.question}
          </p>

          {renderQuestionOptions()}

          <div className="border-t border-[#E6E6E6] my-6" />

          {renderNavigationButtons()}
        </div>
      )}

      {currentQuestion !== null && renderFeedbackSection()}
    </section>
  );
};
