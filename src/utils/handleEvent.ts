export const handleEvent = (eventName: string, eventDescription: string) => {
  if (window.ReactNativeWebView) {
    const mobileData = {
      type: "tracking",
      eventName: eventName,
      eventDescription: eventDescription,
    };
    window.ReactNativeWebView.postMessage(JSON.stringify(mobileData));
  }
};
