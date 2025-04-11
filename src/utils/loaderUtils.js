export const isInReactNativeWebView = () => {
  return typeof window !== "undefined" && !!window.ReactNativeWebView;
};

export const startLoader = (options = {}) => {
  console.log(options, "optionssss");
  if (!isInReactNativeWebView()) return false;

  const mobileData = {
    type: "startLoader",
    options: options,
  };

  window.ReactNativeWebView.postMessage(JSON.stringify(mobileData));
  return true;
};

export const stopLoader = (options = {}) => {
  if (!isInReactNativeWebView()) return false;

  const mobileData = {
    type: "killLoader",
    ...options,
  };

  window.ReactNativeWebView.postMessage(JSON.stringify(mobileData));
  return true;
};
