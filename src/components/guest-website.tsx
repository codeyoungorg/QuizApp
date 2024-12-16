"use client";
import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import { DialogContent } from "@mui/material";
import { setCookie } from "cookies-next";

const GuestWebsite = ({
  open,
  setIsPopupOpen,
}: {
  open: boolean;
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

  const gradeButtons = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleGradeSelect = (grade: number) => {
    setSelectedGrade(grade);
  };

  const handleStartLearning = () => {
    if (selectedGrade) {
      setCookie("grade", selectedGrade, {
        path: "/",
        domain: ".codeyoung.com",
      });
      localStorage.setItem("popupShown", "true");
      setIsPopupOpen(false);
    }
  };
  return (
    <Dialog
      open={open}
      onClose={() => {}}
      PaperProps={{
        style: {
          borderRadius: "16px",
          overflow: "hidden",
          padding: "20px",
        },
      }}
    >
      <DialogContent className="flex flex-col items-center space-y-4">
        <h2 className="text-[#2F4F4F] font-bold text-[16px] text-center">
          Make Noah yours!
        </h2>

        <p className="text-[#569090] font-medium text-[14px] text-center">
          Select your grade to get content tailored for you!
        </p>

        <div className="grid grid-cols-3 gap-4 mt-4">
          {gradeButtons.map((grade) => (
            <button
              key={grade}
              onClick={() => handleGradeSelect(grade)}
              className={`w-[110px] h-[35px] border rounded-[8px] px-4 py-2 text-center font-medium text-[12px] ${
                selectedGrade === grade
                  ? "text-[#E98451] border-[#E98451]"
                  : "text-[#569090] border-[#E0E0E0]"
              }`}
            >
              Grade {grade}
            </button>
          ))}
        </div>

        <button
          onClick={handleStartLearning}
          disabled={!selectedGrade}
          className={`mt-15 w-[150px] h-[36px] rounded-[4px] px-4 py-2 font-medium text-[14px] text-center ${
            selectedGrade
              ? "bg-[#E98451] text-white border-[#E98451]"
              : "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
          }`}
        >
          Start Learning
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default GuestWebsite;
