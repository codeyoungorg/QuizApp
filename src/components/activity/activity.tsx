"use client";
import { Avatar } from "@mui/material";
import React from "react";
import "@/components/home-page.css";
import Image from "next/image";
import rank_active from "@/assets/Images/rank_active.svg";
import rank_gray from "@/assets/Images/rank_greyed.svg";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EditProfileDialog from "@/components/edit-avatar/avatar-dialog";
import noahFireStreak from "@/assets/Images/noah_fire_streak_transparent_v1.gif";
import ActivityStreak from "./activity-streak";
import ClipLoader from "react-spinners/ClipLoader";
import { getCookie } from "cookies-next";
import saveGTMEvents from "@/lib/gtm";

const activity = ({
  subject,
  earnedPoints,
  studentActivity,
  streakData,
  studentData,
  avatar,
  setAvatar,
  loading,
}: {
  subject: string | null;
  earnedPoints: any;
  studentActivity: any;
  streakData: any;
  studentData: any;
  avatar: string;
  setAvatar: Function;
  loading: boolean;
}) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const grade = getCookie("grade");
  const userRole = getCookie("userRole");
  const handleOpenDialog = () => {
    const userId = getCookie("userId");
    saveGTMEvents({
      eventAction: "edit_clicked",
      label: userId ? "student" : "guest",
      label1: userId || null,
      label2: null,
      label3: null,
      label4: null,
    });
    setOpenDialog(true);
  };
  const handleCloseDialog = () => setOpenDialog(false);

  const getBackgroundColor = (subject: string | null) => {
    switch (subject) {
      case "mathematics":
        return "math-gradient";
      case "science":
        return "science-gradient";
      case "english":
        return "english-gradient";
      default:
        return "math-gradient";
    }
  };

  return (
    <>
      <div className="activityCardContainer mx-auto lg:mx-0">
        <div className="cardHeadingTxt">My Activity</div>
        <div className="profileWrapper">
          <div className="profileSection">
            <Avatar
              src={avatar || "/images/default-profile.png"}
              alt="profile"
              sx={{ width: 80, height: 80 }}
            />
            <div className="profileDetails">
              <span className="nameTag">
                {studentData?.studentName || "N/A"}
              </span>
              <div className="gradeTag">
                Grade {studentData?.grade || grade || "N/A"}
              </div>
              {userRole !== "guest" && (
                <button
                  className="editBtn"
                  onClick={handleOpenDialog}
                  disabled={loading}
                >
                  <span className="flex flex-row justify-center items-center gap-1">
                    Edit
                    <EditOutlinedIcon fontSize="small" />
                  </span>
                </button>
              )}
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center w-[126px] self-center">
              <ClipLoader
                color={"#C4C3C1"}
                loading={loading}
                size={30}
                aria-label="Loading Spinner"
                data-testid="loading"
              />
            </div>
          ) : (
            <div className="rankContainer">
              <div className="rankSection">
                <Image
                  src={studentData?.rank > 0 ? rank_active : rank_gray}
                  alt="rank"
                  width={126}
                  height={80}
                />
                <div className="rankNumber">
                  {studentData?.rank > 0 ? studentData?.rank : ""}
                </div>
              </div>
              <div
                className={
                  studentData?.rank > 0 ? "rankTitle" : "rankTitleGray"
                }
              >
                {studentData?.rank > 0 ? "Your Rank" : "Unranked"}
              </div>
            </div>
          )}
        </div>
        <div className="activitiesTrackerContainer">
          {streakData?.totalQuestions > 0 ? (
            <>
              <div className="streaksGraphContainer">
                <div className="activityTrackHeading">
                  Activities in last 7 days
                </div>
              </div>
              <div className="streaksContainer">
                <div className="streakGraph">
                  <ActivityStreak
                    studentActivity={studentActivity}
                    subjectGradient={getBackgroundColor(subject)}
                  />
                </div>
                <div className="activityStreak">
                  <div className="streakGifAndText">
                    <Image
                      src={
                        streakData?.streak > 0
                          ? noahFireStreak
                          : "/images/streak_grey.svg"
                      }
                      alt="noahFireStreak"
                      width={72}
                      height={72}
                    />
                    <div className="mt-auto mb-auto">
                      <div
                        className={`font-bowlby text-4xl font-normal ${
                          streakData?.streak > 0
                            ? getBackgroundColor(subject) +
                              " gradient-text-addon"
                            : "text-[#C4C3C1]"
                        } text-center`}
                      >
                        {`${streakData?.streak}x`}
                      </div>

                      <div className="streakTxt">daily streak</div>
                    </div>
                  </div>
                  <div className="streakDescription text-[#A3A3A3]">
                    <strong>{`${earnedPoints}`}</strong> points earned
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="grid justify-center content-center xs:mt-36 md:mt-24">
              {loading ? (
                <span>
                  <ClipLoader
                    color={"#C4C3C1"}
                    loading={loading}
                    size={30}
                    aria-label="Loading Spinner"
                    data-testid="loading"
                  />
                </span>
              ) : (
                <div className="flex flex-row md:w-[429px] xs:w-[300px] justify-center">
                  <Image
                    src={noahFireStreak}
                    alt="noahFireStreak"
                    width={66}
                    height={72}
                    className="mt-auto mb-auto"
                  />
                  <div className="streakTxt mt-auto mb-auto">
                    Keep completing your daily activities and watch your
                    learning streak burning brightly here!
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {openDialog && (
        <EditProfileDialog
          open={openDialog}
          onClose={handleCloseDialog}
          userName={studentData.studentName || ""}
          grade={studentData.grade}
          studentId={studentData.studentId}
          setAvatar={setAvatar}
          avatar={avatar}
        />
      )}
    </>
  );
};

export default activity;
