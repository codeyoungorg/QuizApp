"use client";

import { Button } from "@/components/newFlow/ui/buttons";
import { Home } from "lucide-react";
import { HandleQuite } from "@/utils/HandleQuite";

interface ResultNotFoundProps {
  lang: string;
}

export const ResultNotFound = ({ lang }: ResultNotFoundProps) => {

  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-6 max-w-md text-center">
        <div className="w-10 h-10 rounded-full bg-[#FFA500] flex items-center justify-center">
          <span className="text-4xl text-white">!</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-app-text-black mb-2">
            Quiz Result Not Found
          </h2>
          <p className="text-sm font-semibold text-app-text-grey max-w-[320px] mx-auto">
            We couldn't find the quiz result you're looking for. Please contact support for assistance.
          </p>
        </div>
        <div className="flex gap-3 w-full mt-4">
          <Button
            variant="secondary"
            onClick={() => {
              HandleQuite();
            }}
            className="flex-1 text-sm justify-center max-w-[150px] mx-auto"
          >
            <Home className="h-5 w-5" />
            Go to Home
          </Button>
          {/* <Button
            variant="primary"
            onClick={() => router.push(`/language/${lang}/practice`)}
            className="flex-1 text-sm justify-center"
          >
            Start a new quiz
          </Button> */}
        </div>
      </div>
    </div>
  );
};
