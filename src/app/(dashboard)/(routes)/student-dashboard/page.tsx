"use client";
import Activity from "@/components/activity/activity";
import SubjectCard, { TagColors } from "./components/subject-card";
import "./components/student-dashboard.css";
import GlobalLeaderboard from "@/components/leaderboard";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import {
  getStudentDashboard,
  getSubjectWise,
} from "@/lib/student-dashboard/apiClient";
import constants from "../../../../constants/constants";

interface SubjectInfo {
  subjectId: number;
  subjectName: string;
  rank: number | null;
  answeredCount: number | null;
}

interface SubjectData {
  [key: string]: SubjectInfo;
}

const PageContent = () => {
  const [subjectData, setSubjectData] = useState<SubjectData>({
    math: {
      subjectId: constants.SUBJECT_IDS.MATH,
      subjectName: "Mathematics",
      rank: null,
      answeredCount: null,
    },
    science: {
      subjectId: constants.SUBJECT_IDS.SCIENCE,
      subjectName: "Science",
      rank: null,
      answeredCount: null,
    },
    english: {
      subjectId: constants.SUBJECT_IDS.ENGLISH,
      subjectName: "English",
      rank: null,
      answeredCount: null,
    },
    french: {
      subjectId: constants.SUBJECT_IDS.FRENCH,
      subjectName: "French",
      rank: null,
      answeredCount: null,
    },
    spanish: {
      subjectId: constants.SUBJECT_IDS.SPANISH,
      subjectName: "Spanish",
      rank: null,
      answeredCount: null,
    },
    hindi: {
      subjectId: constants.SUBJECT_IDS.HINDI,
      subjectName: "Hindi",
      rank: null,
      answeredCount: null,
    },
    germen: {
      subjectId: constants.SUBJECT_IDS.GERMAN,
      subjectName: "Germen",
      rank: null,
      answeredCount: null,
    },
    telugu: {
      subjectId: constants.SUBJECT_IDS.TELUGU,
      subjectName: "Telugu",
      rank: null,
      answeredCount: null,
    },
    // coding: {
    //   subjectId: constants.SUBJECT_IDS.CODING,
    //   subjectName: "Coding",
    //   rank: null,
    //   answeredCount: null,
    // },
  });
  const [leaderboardData, setLeaderboardData] = useState({
    studentMeta: {},
    topTenStudentList: [],
  });
  const [studentActivity, setStudentActivity] = useState([]);
  const [streakData, setStreakData] = useState({});
  const [studentData, setStudentData] = useState(null);
  const [avatar, setAvatar] = useState<string>("");
  const [subjectWiseLoader, setSubjectWiseLoader] = useState<boolean>(false);
  const [dashboardLoader, setDashboardLoader] = useState<boolean>(false);
  const languages = ["french", "spanish", "hindi", "germen", "telugu"];

  useEffect(() => {
    const userId = getCookie("userId");
    if (!userId) {
      window.open(process.env.NEXT_PUBLIC_SANDBOX_URL, "_self");
    }
  }, []);

  useEffect(() => {
    const userId = getCookie("userId");
    const fetchData = async () => {
      if (userId) {
        setSubjectWiseLoader(true);
        try {
          const data = await getSubjectWise({ userId, subjectId: null });
          let updatedSubjectData: any = subjectData;
          data.response.forEach((subject: any) => {
            updatedSubjectData[subject.subjectName].rank = subject.rank;
            updatedSubjectData[subject.subjectName].answeredCount = parseInt(
              subject.count,
              10
            );
          });
          setSubjectData(updatedSubjectData);
        } catch (err) {
          console.error("Error fetching data:", err);
        }
        setSubjectWiseLoader(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const userId = getCookie("userId");
    const fetchData = async () => {
      if (userId) {
        setDashboardLoader(true);
        try {
          const data2 = await getStudentDashboard({
            studentId: userId,
            subjectId: null,
          });
          setLeaderboardData(data2.response.leaderboard);
          setStudentActivity(data2.response.activity);
          setStreakData(data2.response.streak);

          const currentStudent =
            data2.response.leaderboard.topTenStudentList.find(
              (row: any) => row.userid == userId
            );
          setStudentData({
            ...data2.response.currentStudentMeta,
            rank: currentStudent?.rank,
          });
          setAvatar(data2.response.currentStudentMeta?.pic || "");

          if (data2.response.currentStudentMeta?.pic) {
            localStorage.setItem(
              "user-avatar",
              data2.response.currentStudentMeta?.pic
            );
          }
        } catch (err) {
          console.error("Error fetching data:", err);
        }
        setDashboardLoader(false);
      }
    };
    fetchData();
  }, []);

  const subjects = Object.keys(subjectData);

  return (
    <div className={`font-sans`}>
      <div className="w-full flex justify-center">
        <div className="w-full flex justify-center flex-col">
          <div className="lg:text-4xl md:text-2xl xs:text-xl font-semibold leading-[38.73px] text-center lg:mt-10 md:mt-8 xs:mt-6">
            <span className="text-[#5B8989]">Various subjects curated by</span>
            <span className="gradient-text"> Noah.</span>
          </div>
          <div className="lg:text-4xl md:text-2xl xs:text-xl font-semibold leading-[38.73px] text-center lg:mt-4 md:mt-2 xs:mt-1">
            <span className="text-[#5B8989]">Just for</span>
            <span className="gradient-text-2"> You.</span>
          </div>
          <div className="text-[#5B8989] lg:text-xl xs:text-base font-semibold leading-[24.2px] text-center lg:mt-12 md:mt-10 xs:mt-10">
            Choose a subject to get started
          </div>
          <div className="mt-4 md:mt-8 grid md:grid-cols-2 gap-6 md:gap-10 justify-center place-items-center mx-auto w-full max-w-[700px] lg:max-w-[1100px]">
            {subjects.map((subject: string) => (
              <SubjectCard
                key={subject}
                subjectName={subjectData[subject].subjectName}
                rank={subjectData[subject].rank}
                answeredCount={subjectData[subject].answeredCount}
                status={true}
                cardClassName={subject as keyof TagColors}
                loading={subjectWiseLoader}
                isLanguage={languages.includes(subject)}
              />
            ))}
          </div>
          <div className="lg:text-4xl md:text-2xl xs:text-[19px] font-semibold leading-[38.73px] text-center lg:mt-20 md:mt-18 xs:mt-16">
            <span className="text-[#5B8989]">Practice</span>
            <span className="gradient-text-2"> Daily</span>
            <span className="text-[#5B8989]"> and track your activity.</span>
          </div>
          <div className="lg:text-4xl md:text-2xl xs:text-[19px] font-semibold leading-[38.73px] text-center lg:mt-4 md:mt-2 xs:mt-0">
            <span className="text-[#5B8989]">Consistency can be</span>
            <span className="gradient-text-2"> magical.</span>
          </div>
          <div className="flex lg:flex-row xs:flex-col justify-center gap-8 lg:mt-14 md:mt-12 xs:mt-6 mb-10">
            <Activity
              subject={null}
              studentActivity={studentActivity}
              streakData={streakData}
              studentData={studentData}
              avatar={avatar}
              setAvatar={setAvatar}
              loading={dashboardLoader}
            />
            <GlobalLeaderboard
              leaderboardData={leaderboardData}
              studentData={studentData}
              avatar={avatar}
              loading={dashboardLoader}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <div className="w-full md:max-w-7xl mx-auto bg-[#FFF] overflow-hidden !important">
      <PageContent />
    </div>
  );
};

export default Page;

{
  /* <SubjectCard
                subjectName={subjectData["coding"].subjectName}
                rank={subjectData["coding"].rank}
                answeredCount={subjectData["coding"].answeredCount}
                status={false}
                cardClassName={"coding"}
                loading={subjectWiseLoader}
              /> */
}
