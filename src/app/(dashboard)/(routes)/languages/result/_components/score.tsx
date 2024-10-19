"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import NoahImage from "@/assets/Images/noah_doubt_solve_dp.svg";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ScoreCard({ lang }: { lang: string }) {
  const [result, setResult] = useState({ total: 0, correct: 0 });
  useEffect(() => {
    console.log(localStorage.getItem("result"));
    setResult(JSON.parse(localStorage.getItem("result")!));
  }, []);
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card
        className="mb-6 rounded-2xl"
        style={{
          boxShadow: "0px 0px 8px 0px #0053F429",
          background:
            "linear-gradient(133.16deg, #FCF7ED -0.38%, #FDF2F9 100%)",
        }}
      >
        <CardContent className="flex flex-col-reverse md:flex-row gap-2 items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <Image
              src={NoahImage}
              alt="Robot avatar"
              width={80}
              height={80}
              className="rounded-full shrink-0"
            />
            <div>
              <p className="text-[#6C9D9D] text-lg font-medium mb-2">
                Keep learning and unlock levels
              </p>
              <Link href={"/languages?lang=" + lang}>
                <Button className="bg-[#EB9B3A] hover:bg-orange-500 text-white">
                  Continue Learning
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-2 h-4 w-4"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
          <div
            className="text-[#569090] bg-white/60 p-4 grid place-items-center rounded-lg"
            // style={{
            //   background:
            //     "linear-gradient(133.16deg, #FCF7ED -0.38%, #FDF2F9 100%)",
            // }}
          >
            <p className="mb-1">Your Score</p>
            <p className="text-4xl font-bold">
              {result.correct}
              <span className="text-xl">/{result.total}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card
          className="bg-[#F5F9FF] rounded-2xl"
          style={{
            boxShadow: "0px 0px 8px 0px #0053F429",
          }}
        >
          <CardHeader>
            <h4 className="text-sm font-semibold mb-2 text-[#A3A3A3]">
              CURRENT TOPIC
            </h4>
            <CardTitle className="text-xl font-semibold text-[#517B7B]">
              <span className="mr-2">🎃</span>
              Simple adjective
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress
              value={60}
              className="mb-4 rounded-full h-3"
              style={{
                background:
                  "linear-gradient(316.81deg, #FFE7D6 -21.21%, #FFECD6 123.06%)",
              }}
              bg={
                "linear-gradient(316.81deg, #FF9147 -21.21%, #FFBC70 123.06%)"
              }
              round="100px"
            />
            <p className="text-sm text-[#A3A3A3]">
              Completed 12 of 20 flash cards
            </p>
          </CardContent>
        </Card>

        <Card
          className="bg-[#F5F9FF] rounded-2xl"
          style={{
            boxShadow: "0px 0px 8px 0px #0053F429",
          }}
        >
          <CardHeader>
            <h4 className="text-sm font-semibold mb-2 text-[#A3A3A3]">
              CURRENT LEVEL
            </h4>
            <CardTitle className="text-xl font-semibold text-[#517B7B]">
              <span className="mr-2">🏆</span>
              Level 1
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress
              value={60}
              className="mb-4 rounded-full h-3"
              style={{
                background:
                  "linear-gradient(316.81deg, #FFE7D6 -21.21%, #FFECD6 123.06%)",
              }}
              bg={
                "linear-gradient(316.81deg, #FF9147 -21.21%, #FFBC70 123.06%)"
              }
              round="100px"
            />
            <p className="text-sm text-[#A3A3A3]">
              Completed 64 of 80 flash cards
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
