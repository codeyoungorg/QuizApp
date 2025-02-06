import Slider from "react-slick";
import TopicCard from "./topic-card";
import "./topic-card.css";
import ClipLoader from "react-spinners/ClipLoader";
import nextIcon from "@/public/images/icons/nextIcon.svg";
import prevIcon from "@/public/images/icons/prevIcon.svg";
import Image from "next/image";

const TopicCardCarousel = ({
  items,
  loading,
  subjectId,
  subjectName,
  userId,
  userGrade,
}: {
  items: any;
  loading: boolean;
  subjectId: number;
  subjectName: string | null;
  userId: string;
  userGrade: string;
}) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    initialSlide: 0,
    rows: 2,
    nextArrow: (
      <div className="carousel-buttons">
        <div className="next-slick-arrow rounded-[8px] xs:w-[32px] xs:h-[172px] md:w-[32px] md:h-[172px]">
          <Image
            src={nextIcon}
            alt="Next"
            width={32}
            height={172}
            className="xs:w-[32px] xs:h-[172px] md:w-[32px] md:h-[172px]"
          />
        </div>
      </div>
    ),
    prevArrow: (
      <div className="carousel-buttons">
        <div className="next-slick-arrow xs:w-[32px] xs:h-[172px] md:w-[32px] md:h-[172px]">
          <Image
            src={prevIcon}
            alt="Previous"
            width={32}
            height={172}
            className="xs:w-[32px] xs:h-[172px] md:w-[32px] md:h-[172px]"
          />
        </div>
      </div>
    ),
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 1,
          dots: false,
        },
      },
    ],
  };

  return (
    <div className="carousel-container">
      {loading && (
        <div className="flex flex-row justify-center">
          <ClipLoader
            color={"#C4C3C1"}
            loading={loading}
            size={30}
            aria-label="Loading Spinner"
            data-testid="loading"
          />
        </div>
      )}
      {items.length > 0 && (
        <Slider {...settings}>
          {items.map((item: any, index: number) => {
            return (
              <div key={index} className="topic-card-wrapper">
                <TopicCard
                  topic={item.topicName}
                  badge={item.badge}
                  rating={item.totalScore}
                  totalQnsAnswered={item.totalQuestion}
                  subjectId={subjectId}
                  subjectName={subjectName}
                  topicId={item.topicId}
                  userId={userId}
                  userGrade={userGrade}
                />
              </div>
            );
          })}
        </Slider>
      )}
    </div>
  );
};

export default TopicCardCarousel;
