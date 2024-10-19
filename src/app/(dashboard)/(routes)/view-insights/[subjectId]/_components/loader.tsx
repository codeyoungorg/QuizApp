"use client";

import { useState, useEffect } from "react";

export default function Loader() {
  const [percentage, setPercentage] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const loadingTexts = [
    "Analyzing data...",
    "Generating insights...",
    "Preparing your personalized report...",
    "Supercharging your Math learning...",
  ];

  useEffect(() => {
    const fastInterval = setInterval(() => {
      setPercentage((prevPercentage) => {
        if (prevPercentage >= 80) {
          clearInterval(fastInterval);
          return 80;
        }
        return prevPercentage + 1;
      });
    }, 50);

    return () => clearInterval(fastInterval);
  }, []);

  useEffect(() => {
    if (percentage === 80) {
      const slowInterval = setInterval(() => {
        setPercentage((prevPercentage) => {
          if (prevPercentage >= 95) {
            clearInterval(slowInterval);
            return 95;
          }
          return prevPercentage + 1;
        });
      }, 150);

      return () => clearInterval(slowInterval);
    }
  }, [percentage]);

  useEffect(() => {
    const textIntervalId = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length);
    }, 2000);

    return () => clearInterval(textIntervalId);
  }, []);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full gap-4 flex flex-col items-center justify-center p-4 max-w-xl mx-auto">
      <div className="w-full max-w-md">
        <p className="text-lg text-center text-orange-600">
          {loadingTexts[textIndex]}
        </p>
      </div>
      <div className="w-full bg-orange-200 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-orange-700">
          {percentage}% Complete
        </span>
      </div>
    </div>
  );
}
