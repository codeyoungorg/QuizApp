import Image from "next/image";
import { CircularProgress } from "@mui/material";
import "../subject-dashboard.css";
import { generateQuiz } from "@/actions/quiz.client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import saveGTMEvents from "@/lib/gtm";
import { grey } from "@mui/material/colors";

const TopicCard = ({
  badge,
  topic,
  rating,
  totalQnsAnswered,
  subjectId,
  subjectName,
  topicId,
  userGrade,
  userId,
}: {
  badge: string | null;
  topic: string;
  rating: number;
  totalQnsAnswered: number;
  subjectId: number;
  subjectName: string | null;
  topicId: number;
  userId: any;
  userGrade: any;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const badgeName = `topic-card-badge-${badge}`;
  const badgeText =
    badge == "assigned"
      ? "Assigned to you"
      : badge == "recommended"
      ? "Recommended"
      : "";

  const filledStarsArr = [];
  for (let i = 0; i < Math.floor(rating); i++) {
    filledStarsArr.push(i);
  }
  let halfFilledStar = false;
  if (rating - Math.floor(rating) > 0) {
    halfFilledStar = true;
  }
  const unfilledStarsArr = [];
  for (let i = 0; i < 5 - Math.ceil(rating); i++) {
    unfilledStarsArr.push(i);
  }

  const level = rating > 4 ? "master" : rating > 2 ? "pro" : "beginner";
  const nextBadge =
    level == "beginner" ? "Pro" : level == "pro" ? "Master" : null;

  const createQuizByTopic = async () => {
    setLoading(true);
    try {
      const data = await generateQuiz({
        topicId: topicId,
        grade: parseInt(userGrade),
        subjectId: subjectId,
        userId: userId,
        start: true,
      });

      if (subjectId == 1) {
        router.push(`/quiz/math/${data.id}?topic=${topicId}`);
      } else if (subjectId == 2) {
        router.push(`/quiz/science/${data.id}?topic=${topicId}`);
      } else if (subjectId == 3) {
        router.push(`/quiz/english/${data.id}?topic=${topicId}`);
      } else {
        console.log("Invalid subjectId");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={`topic-card-container`}>
      <span className={`topic-card-badge ${badgeName} flex flex-row`}>
        <span>{badgeText}</span>
        {badge == "recommended" && (
          <span>
            <Image
              src="/images/Union.png"
              alt="star"
              width={14.5}
              height={16}
            />
          </span>
        )}
      </span>
      <div className="topic-card-heading">{`${topic}`}</div>
      <div className="topic-card-rating-container">
        <div className="flex flex-row justify-between">
          <div>
            <div>
              <span className="topic-card-rating-text">Your level: </span>
              <span
                className={`font-bowlby topic-card-rating-level level-${level}`}
              >
                {level?.toUpperCase()}
              </span>
            </div>
            <div className="flex flex-row mt-2 gap-5 mb-2">
              <span className="flex flex-row gap-[8px] mt-auto mb-auto">
                {filledStarsArr.map((index) => {
                  return (
                    <Image
                      src="/images/full-star.png"
                      alt="full-star"
                      width={20}
                      height={20}
                      key={index}
                    />
                  );
                })}
                {halfFilledStar && (
                  <Image
                    src="/images/half-star.png"
                    alt="half-star"
                    width={20}
                    height={20}
                  />
                )}
                {unfilledStarsArr.map((index) => {
                  return (
                    <Image
                      src="/images/null-star.png"
                      alt="null-star"
                      width={20}
                      height={20}
                      key={index}
                    />
                  );
                })}
              </span>
              <span className="font-sans font-bold text-[#F0A205] text-center mt-auto mb-auto">{`${rating} / 5`}</span>
            </div>
            {level != "master" ? (
              <div>
                <span className="topic-card-rating-text">Achieve </span>
                <span
                  className={`font-sans lg:text-xs xs:text-[12px] font-bold leading-[14.52px] text-left level-${level}`}
                >
                  {`more than ${level == "beginner" ? "2" : "4"} stars`}
                </span>
                <span className="topic-card-rating-text">{` to unlock '${nextBadge}' badge`}</span>
              </div>
            ) : (
              <div className="topic-card-rating-text mt-2">
                You achieved Master badge for this topic
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <Image
              alt="level-icon"
              width={48}
              height={48}
              src={`/images/icons/level-${level}.png`}
              className="xs:w-[48px] xs:h-auto lg:w-[48px] lg:h-[48px]"
            />
          </div>
        </div>
      </div>
      <hr className="topic-card-hr" />
      <div className="flex flex-row justify-between md:mt-6 xs:mt-3">
        <div className="text-[#A3A3A3] text-sm mt-auto mb-auto">
          <span className="font-bold">{`${totalQnsAnswered} `}</span>
          <span>questions completed</span>
        </div>
        <button
          className="font-sans w-[120px] h-[37px] rounded-lg padding-[10px 20px 10px 20px] bg-[#EB9B3A] text-[#FFF] gap-1 hover:bg-[#F0B46B]"
          style={{ textTransform: "none" }}
          onClick={async () => {
            saveGTMEvents({
              eventAction: "practice_initiated",
              label: "student",
              label1: userId,
              label2: subjectName,
              label3: topic,
              label4: null,
            });
            await createQuizByTopic();
          }}
          disabled={loading}
        >
          <span className="flex flex-row justify-center items-center gap-2 text-sm font-semibold">
            Practice
            {loading ? (
              <CircularProgress size={10} sx={{ color: grey[50] }} />
            ) : (
              <Image
                src="/images/icons/arrow-right.png"
                alt="arrow"
                width={16}
                height={16}
              />
            )}
          </span>
        </button>
      </div>
    </div>
  );
};

export default TopicCard;
