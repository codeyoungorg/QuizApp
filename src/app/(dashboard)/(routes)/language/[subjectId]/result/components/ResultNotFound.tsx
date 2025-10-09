"use client";

import { Button } from "@/components/newFlow/ui/buttons";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface ResultNotFoundProps {
  lang: string;
}

export const ResultNotFound = ({ lang }: ResultNotFoundProps) => {
  const router = useRouter();

  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-6 max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <X className="h-8 w-8 text-red-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-app-text-black mb-2">
            Quiz Result Not Found
          </h2>
          <p className="text-base text-app-text-grey">
            We couldn't find the quiz result you're looking for. Please contact support for assistance.
          </p>
        </div>
        <div className="flex gap-3 w-full">
          <Button
            variant="secondary"
            onClick={() => {
              if (window.ReactNativeWebView) {
                const mobileData = {
                  type: "route",
                };
                window.ReactNativeWebView.postMessage(JSON.stringify(mobileData));
              } else {
                history.back();
              }
            }}
            className="flex-1"
          >
            Go to Dashboard
          </Button>
          <Button
            variant="primary"
            onClick={() => router.push(`/language/${lang}/practice`)}
            className="flex-1"
          >
            Start New Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};
