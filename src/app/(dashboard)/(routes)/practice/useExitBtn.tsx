export const useExitBtn = (onExit?: () => void) => {
  const handleExit = () => {
    const confirmExit = window.confirm(
      "Are you sure you want to exit the quiz?"
    );

    if (onExit) {
      onExit();
      return;
    }

    if (confirmExit) {
      window.close();
    }
  };

  return { handleExit };
};
