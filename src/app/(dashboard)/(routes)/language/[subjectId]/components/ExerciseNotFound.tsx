"use client";

import React from "react";
import { Button } from "@/components/newFlow/ui/buttons";
import { ArrowRight, RefreshCw } from "lucide-react";
import { HandleQuite } from "@/utils/HandleQuite";

interface ExerciseNotFoundProps {
  onRefresh?: () => void;
}

const ExerciseNotFound: React.FC<ExerciseNotFoundProps> = ({ onRefresh }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[300px] p-4">
      <div className="text-4xl mb-2">😔</div>
      <h2 className="text-xl font-semibold mb-4">Oops!</h2>
      <p className="text-muted-foreground text-center mb-10">
        We are sorry, but it looks like an error has occurred.
      </p>
      <div className="flex gap-4">
        <Button
          variant="secondary"
          className="flex items-center gap-2"
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>

        <Button
          variant="secondary"
          className="flex items-center gap-2"
          onClick={() => {
            HandleQuite(true);
          }}
        >
          Go Back
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ExerciseNotFound;
