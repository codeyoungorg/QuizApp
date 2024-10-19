import QuizScore from "@/components/quiz-score";
import React, { Suspense } from "react";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import CircularProgress from "@mui/material/CircularProgress";
import { getDashboard } from "@/app/supabase-server";
import apiService from "@/lib/apiService";
import Loader from "./_components/loader";

type Props = {
  subjectId: number;
};

const PageContent = async (props: Props) => {
  const user_Id = getCookie("userId", { cookies });

  const [dashboardData, insightResponse] = await Promise.all([
    getDashboard(user_Id!, props.subjectId),
    apiService.get(
      `/insights/subject?studentId=${user_Id}&subjectId=${props.subjectId}`
    ),
  ]);

  const insightData = insightResponse.data.response;

  if (!insightData || !dashboardData) {
    return <Loader />;
  }

  return (
    <div className="p-5 md:p-12 w-full md:max-w-5xl mx-auto bg-[#FFF] !important">
      <QuizScore dashboardData={dashboardData} insights={insightData} />
    </div>
  );
};

const Page = ({ params: { subjectId } }: { params: { subjectId: number } }) => {
  return (
    <Suspense fallback={<Loader />}>
      <div className="p-5 md:px-12 w-full md:max-w-7xl mx-auto bg-[#FFF] !important">
        <PageContent subjectId={subjectId} />
      </div>
    </Suspense>
  );
};

export default Page;
