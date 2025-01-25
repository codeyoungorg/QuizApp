"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import MCQBox from "./mcq-box";
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import SelectedAnswer from "./selected-answer";
import { Input } from "@/components/ui/input";
import ion_send from "@/assets/Images/ion_send.png";
import Image from "next/image";
import QuizScore from "./quiz-score-diloag";
import {
  EndChatMessage,
  InitialChatMessage,
  TopicMessage,
} from "./chat-messages";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { QuizDataType, SubmissionType } from "@/types/quiz.types";
import { getQuizStats } from "@/actions/main.actions";
import {
  createQuizBySubject,
  getTopicNameFromDB,
  storeCorrectSubmission,
  storeUserSubmission,
  storeUserSubmissionToSubmissions,
  updateQuizToComplete,
} from "@/actions/quiz.client";
import saveGTMEvents from "@/lib/gtm";
import { captureEvent } from "@/lib/quiz/apiClient";

type ChatProps = {
  quizData: QuizDataType;
  quizId: string;
  user: {
    name: string;
    grade: number;
    id: string;
  };
  numberOfCompletedQuizData: any;
  assignStatus: boolean;
  subjectId: number;
  subjectName: string;
};

export default function Chat({
  quizData,
  quizId,
  user,
  numberOfCompletedQuizData,
  assignStatus,
  subjectId,
  subjectName,
}: ChatProps) {
  const queryParams = useSearchParams();
  const topic = queryParams.get("topic");
  const [questionIndex, setQuestionIndex] = useState(
    quizData.submissions?.length || 0
  );
  const [hasEnded, setHasEnded] = useState(
    quizData.questions?.length > 0
      ? quizData.submissions?.length === quizData.questions?.length
      : false
  );
  const [submissions, setSubmissions] = useState<SubmissionType[]>(
    quizData?.submissions || []
  );
  const [quizScore, showQuizScore] = useState(false);
  const [started, setStart] = useState(quizData.start);
  const [userInput, setUserInput] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [currentSubmission, setCurrentSubmission] =
    useState<SubmissionType | null>(null);
  const [score, setScore] = useState(0);
  const [quizTopic, setQuizTopic] = useState<string | null>(null);
  const [topicId, setTopicId] = useState<number | null>(quizData.topic_id);
  const bottom = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { questions: qList, complete: isComplete } = quizData;
  const [questionList, setQuestionList] = useState<any>(qList);

  const startNewQuiz = async () => {
    try {
      setLoader(true);

      const { quiz } = await createQuizBySubject({
        userId: user.id,
        grade: user.grade,
        subjectId,
      });

      if (!quiz || !quiz.length) {
        setLoader(false);
        return;
      }

      saveGTMEvents({
        eventAction: "next_quiz",
        label: "student",
        label1: user?.id,
        label2: subjectName,
        label3: topic ? "Topic" : "Noah",
        label4: null,
      });
      router.replace(`/quiz/${subjectName}/${quiz[0].id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  const endQuiz = (redirectPathParam: string) => {
    saveGTMEvents({
      eventAction: "end_quiz",
      label: "student",
      label1: user?.id,
      label2: subjectName,
      label3: topic ? "Topic" : "Noah",
      label4: null,
    });
    router.replace(`/subject-dashboard?subject=${redirectPathParam}`);
  };

  // Get the current question
  const currentQuestion = useMemo(() => {
    if (!questionList) return null;
    return questionList[questionIndex];
  }, [questionIndex, questionList]);

  // Get the options for the current question
  const options = useMemo(() => {
    if (!currentQuestion) return [];
    if (!currentQuestion.options) return [];
    return currentQuestion.options;
  }, [currentQuestion]);

  // Scroll to the bottom of the chat
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [bottom.current, currentQuestion, submissions, hasEnded]);

  const checkScore = async () => {
    if (submissions.length > 0) {
      let totalCorrect = submissions?.reduce((acc: any, question: any) => {
        if (question.isCorrect) {
          return acc + 1;
        }
        return acc;
      }, 0);

      setScore(totalCorrect);
    } else {
      const quiz_stats = await getQuizStats(quizId);

      let totalCorrect = quiz_stats?.submissions?.reduce(
        (acc: any, question: any) => {
          if (question.isCorrect) {
            return acc + 1;
          }
          return acc;
        },
        0
      );

      setScore(totalCorrect);
    }
  };

  // Check if the selected answer is correct
  const checkAnswer = (index: number) => {
    const isCorrect = options[index!].correct === "true";
    return isCorrect;
  };

  // GTM
  useEffect(() => {
    saveGTMEvents({
      eventAction: "quiz_opened",
      label: "student",
      label1: user?.id,
      label2: subjectName,
      label3: topic ? "Topic" : "Noah",
      label4: null,
    });
  }, []);

  useEffect(() => {
    // Store the user submission to the db
    (async () => {
      await storeUserSubmission({ quizId, userId: user.id, submissions });
      if (currentSubmission?.questionIntId && currentSubmission?.selected) {
        await storeUserSubmissionToSubmissions({
          quizId: parseInt(quizId),
          questionId: currentSubmission?.questionIntId!,
          isCorrect: currentSubmission?.isCorrect!,
          optionSelected: currentSubmission?.selected.text!,
          correctOption: currentSubmission?.correctOption!,
        });
      }
      if (currentSubmission?.isCorrect) {
        await storeCorrectSubmission({
          grade: user.grade,
          questionId: currentSubmission.questionId,
          quizId: quizData.id,
          topicId: topicId!,
          userId: user.id,
          subjectId: quizData.subject_id,
        });
      }
    })();
  }, [submissions, quizTopic, started]);

  // Handle the next button click
  const handleNext = useCallback(
    async (index: number) => {
      if (!options[index]) {
        toast({ title: "Invalid answer", duration: 3000 });
        return;
      }
      const isCorrect = checkAnswer(index);

      setCurrentSubmission({
        questionIntId: currentQuestion?.id,
        questionId: currentQuestion?.uuid!,
        selected: options[index!],
        isCorrect,
        correctOption: options.find((option: any) => option.correct === "true")
          ?.text,
      });

      setSubmissions((submissions) => [
        ...submissions,
        {
          questionId: currentQuestion?.uuid,
          selected: options[index!],
          isCorrect,
        },
      ]);

      if (allQuestionsAnswered) return;
      // Move to the next question
      await captureEvent({
        data: {
          type:"coding",
          subject:currentQuestion.subject,
          topicId:currentQuestion?.topic_id,
          difficulty:currentQuestion?.difficulty_level,
          quizId: parseInt(quizId),
          questionId: [currentQuestion?.id],
        }
      });
      setQuestionIndex((questionIndex) => questionIndex + 1);
    },
    [checkAnswer, questionIndex, questionList]
  );

  // Check if all questions have been answered
  const allQuestionsAnswered = useMemo(() => {
    if (!questionList) return false;
    return submissions.length === questionList.length;
  }, [submissions, questionList]);

  useEffect(() => {
    // Show the quiz score
    if (allQuestionsAnswered) {
      saveGTMEvents({
        eventAction: "quiz_completed",
        label: "student",
        label1: user?.id,
        label2: subjectName,
        label3: topic ? "Topic" : "Noah",
        label4: null,
      });
      setHasEnded(true);
      endGame();
      return;
    }
  }, [submissions]);

  const handleUserInput = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle user input
    if (userInput === "") {
      toast({ title: "Enter the answer", duration: 3000 });
    }
    // converting user input to lowercase and removing any extra spaces
    const optimizedAnswer: string = userInput.toLowerCase().trim();
    const formattedOptions = ["a", "b", "c", "d"];
    // Check if the user input is in type of a, b, c, d
    if (formattedOptions.includes(optimizedAnswer)) {
      const index = formattedOptions.indexOf(optimizedAnswer);
      handleNext(index);
      setUserInput("");
    } else {
      // Check if the user input is in the options text
      const optionTexts = options.map((option: any) =>
        option.text.toLowerCase().trim()
      );
      const index = optionTexts.indexOf(optimizedAnswer);
      if (index === -1) {
        toast({ title: "Invalid answer", duration: 3000 });
        return;
      }
      handleNext(index);
      setUserInput("");
    }
  };

  const endGame = async () => {
    // Update the quiz stats
    await checkScore();
    const { success } = await updateQuizToComplete({ quizId, userId: user.id });

    if (!success) {
      toast({ title: "Something went wrong!", duration: 3000 });
    }
  };

  useEffect(() => {
    (async () => {
      if (!quizData.topic_id) return;
      const topicName = await getTopicNameFromDB({
        topicId: quizData.topic_id,
        subjectId: quizData.subject_id,
      });
      setQuizTopic(topicName);
    })();

    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (hasEnded) {
      router.push(
        `/subject-dashboard?subject=${
          subjectName === "math" ? "mathematics" : subjectName
        }`
      );
    }
  }, []);

  if (!isMounted) return null;

  return (
    <ScrollArea className="h-full w-full flex flex-col">
      <div className="flex-1 px-4 py-8 md:px-8">
        <div className="pb-4 max-w-4xl mx-auto h-full w-full">
          <Toaster />
          <InitialChatMessage
            setStart={setStart}
            started={started}
            user={user}
            setQuestionList={setQuestionList}
            quizId={quizId}
            setQuizTopic={setQuizTopic}
            assignStatus={assignStatus}
            setTopicId={setTopicId}
            subjectId={quizData.subject_id}
          />
          {quizTopic && (
            <TopicMessage
              topic={quizTopic}
              questionsLength={questionList.length}
            />
          )}
          {started &&
            questionList
              ?.slice(0, questionIndex + 1)
              .map((question: any, i: number) => (
                <div className="grid" key={i}>
                  <MCQBox
                    currentQuestion={question}
                    handleNext={handleNext}
                    submissions={submissions}
                    questionIndex={i + 1}
                    user={user}
                    subjectName={subjectName}
                    topic={topic}
                    hasEnded={hasEnded}
                    explanation={question.explanation}
                  />
                  <SelectedAnswer submissions={submissions} index={i} />
                </div>
              ))}
          {hasEnded && (
            <EndChatMessage
              user={user}
              startNewQuiz={startNewQuiz}
              endQuiz={endQuiz}
              loader={loader}
              score={score}
              questionsLength={questionList?.length}
              subjectId={quizData.subject_id}
              topicId={topicId!}
            />
          )}
        </div>
        <div className="" ref={bottom}></div>
        <form
          onSubmit={handleUserInput}
          className="bg-white h-[4rem] border-t px-4 flex items-center justify-center gap-x-2 fixed left-0 bottom-0 w-full shadow-md z-10"
        >
          <div className="w-full rounded-lg md:ml-[-7rem] md:max-w-3xl flex bg-[#FFF] border-2 border-[#95B2B2]">
            <Input
              type="text"
              placeholder="Enter your answer e.g. 'A'"
              className="w-full border-0 focus-visible:outline-none focus-visible:border-0 focus-visible:ring-0"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <Button
              type="submit"
              className="border-0 bg-[#FFF] hover:bg-[#FFF]"
            >
              <Image src={ion_send} alt="" />
            </Button>
          </div>
        </form>
      </div>
      <QuizScore
        quizId={quizId}
        open={quizScore}
        setOpen={showQuizScore}
        numberOfCompletedQuizData={numberOfCompletedQuizData}
      />
    </ScrollArea>
  );
}
