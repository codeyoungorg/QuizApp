export const useExitBtn = (onExit?: () => void) => {
  const handleExit = () => {
    // replace with custom model

    if (onExit) {
      onExit();
      return;
    }

    window.close();
    if (!(typeof window !== "undefined" && !!window.ReactNativeWebView))
      return false;

    const mobileData = {
      type: "route",
    };

    window.ReactNativeWebView.postMessage(JSON.stringify(mobileData));
  };

  return { handleExit };
};
