"use client";
import saveGTMEvents from "@/lib/gtm";
import { getCookie } from "cookies-next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";

export type TagColors = {
  math: string;
  science: string;
  english: string;
  coding: string;
  french: string;
  spanish: string;
  hindi: string;
  germen: string;
  telugu: string;
};

const SubjectCard = ({
  subjectName,
  rank,
  answeredCount,
  cardClassName,
  status,
  loading,
  isLanguage,
}: {
  subjectName: string;
  rank: number | null;
  answeredCount: number | null;
  cardClassName: keyof TagColors;
  status: boolean;
  loading: boolean;
  isLanguage?: boolean;
}) => {
  const router = useRouter();
  const tagColors = {
    math: "#b58440",
    science: "#40b59b",
    english: "#4096b5",
    coding: "#b58440",
    french: "#eaeffe",
    spanish: "#4096b5",
    hindi: "#b58440",
    germen: "#40b59b",
    telugu: "#4096b5",
  };

  const handleGetStarted = (subjectName: string) => {
    const userId = getCookie("userId");
    saveGTMEvents({
      eventAction: "subject_clicked",
      label: userId ? "student" : "guest",
      label1: userId || null,
      label2: subjectName == "mathematics" ? "math" : subjectName,
      label3: null,
      label4: null,
    });
    if (isLanguage) {
      router.push(`/languages?lang=${subjectName}`);
    } else {
      router.push(`/subject-dashboard?subject=${subjectName}`);
    }
  };

  return (
    <div
      className={`rounded-[16px] xs:w-[343px] md:w-full lg:w-full shadow-[0px_2px_8px_0px_#00000029] card-${cardClassName} md:m-0 xs:ml-auto xs:mr-auto`}
    >
      <div className="flex justify-between flex-row">
        <div className="flex justify-center flex-col">
          <div className="text-xl font-semibold leading-[24.2px] text-left text-[#5B8989] ml-8 mt-5">
            {subjectName}
          </div>
          <div className="flex flex-row justify-left mt-3 h-[33px]">
            {status && (
              <span
                className={`ml-8 p-[8px] rounded-[6px] tags-${cardClassName}`}
              >
                {loading ? (
                  <span>
                    <ClipLoader
                      color={tagColors[cardClassName]}
                      loading={loading}
                      size={16}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  </span>
                ) : (
                  <span className="flex flex-row gap-[8px]">
                    <Image
                      alt="trophy"
                      src="/images/icons/trophy_star.svg"
                      width={16}
                      height={16}
                      className="mt-auto mb-auto"
                    />
                    <span className="lg:text-sm xs:text-[11px] font-medium leading-[16.94px] text-left mt-auto mb-auto">
                      {!rank && !answeredCount
                        ? "Start practicing to earn badges"
                        : rank
                        ? rank
                        : "-"}
                    </span>
                  </span>
                )}
              </span>
            )}
            {(rank || answeredCount) && status && (
              <span
                className={`flex flex-row p-[8px] gap-[8px] rounded-[6px] tags-${cardClassName} ml-4`}
              >
                {answeredCount && (
                  <span className="lg:text-sm xs:text-[11px] font-medium leading-[16.94px] text-left mt-auto mb-auto">
                    {answeredCount} answered
                  </span>
                )}
              </span>
            )}
          </div>
        </div>
        <Image
          alt={cardClassName}
          height={100}
          width={100}
          src={`/images/icons/${cardClassName}-icon.svg`}
          className="mr-6 mt-6 xs:h-[64px] xs:w-[64px] lg:h-[100px] lg:w-[100px]"
        />
      </div>
      <div className="ml-8 mt-4 mb-5">
        <button
          className={`md:w-[156px] md:h-[48px] xs:w-[145px] xs:h-[39px] top-[137px] left-[32px] md:p-[14px_20px] p-[11px_20px] gap-[10px] rounded-[8px] grid justify-center content-center
          ${
            status
              ? "bg-[#E98451] hover:bg-[#F1AD7E]"
              : "bg-[#C3B5AC] hover:bg-[#C3B5AC]"
          } text-[#FFF] font-semibold md:text-base xs:text-sm`}
          disabled={!status}
          onClick={() => {
            handleGetStarted(subjectName.toLowerCase());
          }}
        >
          <span className="flex flex-row justify-center items-center gap-2">
            {status ? "Get Started" : "Coming soon!"}
            {status && (
              <Image
                src="/images/icons/arrow-right.png"
                alt="arrow-right"
                width={16}
                height={16}
                className="mb-[0.5px]"
              />
            )}
          </span>
        </button>
      </div>
    </div>
  );
};

export default SubjectCard;
