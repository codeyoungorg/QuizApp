import { HandleQuite } from "@/utils/HandleQuite";

export const useExitBtn = (onExit?: () => void) => {
  const handleExit = () => {

    if (onExit) {
      onExit();
      return;
    }

    HandleQuite();
  };

  return { handleExit };
};
