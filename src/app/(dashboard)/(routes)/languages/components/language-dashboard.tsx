"use client";
import "../../subject-dashboard/components/subject-dashboard.css";
import Activity from "@/components/activity/activity";
import GlobalLeaderboard from "@/components/leaderboard";
import { useState, useEffect } from "react";
import LanguageCard from "../components/language-card";
import HeadingCard from "../components/heading-card";
import TopicSlider from "../components/topic-slider";
import { useQuery } from "@tanstack/react-query";
import {
  getLanguageDashboard,
  getStudentActivity,
} from "@/lib/student-dashboard/apiClient";
import type { LeaderboardResponse } from "@/lib/types/leaderboard";
import { getCookie } from "cookies-next";
import saveGTMEvents from "@/lib/gtm";

type Props = {
  levels: {
    level: number;
    id: number;
    name: string;
    points: number;
  }[];
  lang: string;
  langId: number;
  totalQuestions: {
    id: number;
    language_id: number;
  }[];
};

const LanguageDashboard = ({ levels, lang, langId, totalQuestions }: Props) => {
  const userId = getCookie("userId");

  const { data: dashboardData, isLoading: dashboardLoader } =
    useQuery<LeaderboardResponse>({
      queryKey: ["languageLeaderboard", userId, langId],
      queryFn: () =>
        getLanguageDashboard({
          userId: userId || null,
          lang: langId || null,
        }),
      enabled: !!userId && !!langId,
    });

  const { data: activityData, isLoading: activityLoader } = useQuery({
    queryKey: ["studentActivity", userId, langId],
    queryFn: () =>
      getStudentActivity({
        studentId: userId || null,
        subjectId: langId || null,
      }),
    enabled: !!userId && !!langId,
  });

  const [avatar, setAvatar] = useState<string>("");

  useEffect(() => {
    if (activityData?.response) {
      if (activityData.response.currentStudentMeta?.pic) {
        setAvatar(activityData.response.currentStudentMeta.pic);
        localStorage.setItem(
          "user-avatar",
          activityData.response.currentStudentMeta.pic
        );
      }
    }
  }, [activityData]);

  const currentStudent = dashboardData?.leaderboard?.topTenStudentList?.find(
    (row: any) => row.user_id === userId
  );

  const studentData = activityData?.response?.currentStudentMeta
    ? {
        ...activityData.response.currentStudentMeta,
        rank: currentStudent?.rank,
      }
    : null;

  const leaderboardData = {
    studentMeta: dashboardData?.leaderboard?.studentMeta,
    topTenStudentList:
      dashboardData?.leaderboard?.topTenStudentList?.map((item) => ({
        userid: item.user_id,
        count: item.totalPoints,
        rank: item.rank,
      })) || [],
  };
  saveGTMEvents({
    eventAction: "subject_opened",
    label: userId ? "student" : "guest",
    label1: userId || null,
    label2: lang,
    label3: null,
    label4: null,
  });
  return (
    <div className="w-full md:max-w-7xl mx-auto bg-[#FFF] pb-10 overflow-hidden !important">
      <div className="font-sans w-full flex justify-center">
        <div className="w-full flex justify-center flex-col">
          <HeadingCard lang={lang as string} />
          <LanguageCard
            lang={lang as string}
            langId={langId}
            totalQuestions={totalQuestions}
          />
          <div className="justify-center items-center py-4 hidden md:flex">
            <h1 className="text-[#5B8989] font-semibold text-xl md:text-2xl lg:text-3xl text-center">
              Practice{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A387FF] via-[#F55472] to-[#F55472]">
                Daily
              </span>{" "}
              to get better at learning
            </h1>
          </div>
          <div className="flex flex-col justify-center items-center py-4 md:hidden max-w-md mx-auto">
            <h1 className="text-[#5B8989] font-semibold text-xl md:text-2xl lg:text-3xl text-center">
              Practice{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A387FF] via-[#F55472] to-[#F55472]">
                Daily
              </span>{" "}
              and track your activity. Consistency can be{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E561CB] from-[61.4%] to-[#FDA521] to-[96.83%]">
                magical.
              </span>
            </h1>
          </div>
          <div className="flex lg:flex-row xs:flex-col justify-center gap-8 lg:mt-14 md:mt-6 xs:mt-12 mb-10">
            <Activity
              subject={lang}
              studentActivity={activityData?.response?.activity || []}
              streakData={activityData?.response?.streak || {}}
              studentData={studentData}
              avatar={avatar}
              setAvatar={setAvatar}
              loading={dashboardLoader || activityLoader}
            />
            <GlobalLeaderboard
              leaderboardData={leaderboardData}
              studentData={studentData}
              avatar={avatar}
              loading={dashboardLoader}
            />
          </div>

          <div id={"topics"} className="lg:mt-20 md:mt-12">
            {levels && <TopicSlider levels={levels} langId={langId} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageDashboard;
