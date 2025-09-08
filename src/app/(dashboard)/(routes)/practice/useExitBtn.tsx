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
      if (!(typeof window !== "undefined" && !!window.ReactNativeWebView))
        return false;

      const mobileData = {
        type: "route",
      };

      window.ReactNativeWebView.postMessage(JSON.stringify(mobileData));
    }
  };

  return { handleExit };
};
