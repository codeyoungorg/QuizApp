export const HandleQuite = (goBack?: boolean, route?: string, appData?: {
  returnUrl?: string;
  params?: any;
}) => {
  const entryPoint = sessionStorage.getItem("entryPoint");

  if (window.ReactNativeWebView) {
    const returnUrl = localStorage.getItem("appReturnUrl") || appData?.returnUrl || "Home";
    const mobileData = {
      type: "route",
      url: returnUrl,
      params: appData?.params,
    };
    window.ReactNativeWebView.postMessage(JSON.stringify(mobileData));
    return;
  }

  if (route) {
    window.location.href = route;
    return;
  }

  if (entryPoint == "sandboxLanguage") {
    window.location.href = `${process.env.NEXT_PUBLIC_SANDBOX_URL}/#/language-learning`;
    sessionStorage.removeItem("entryPoint");
    return;
  } else if (entryPoint == "sandbox") {
    window.location.href = `${process.env.NEXT_PUBLIC_SANDBOX_URL}/#/home`;
    sessionStorage.removeItem("entryPoint");
    return;
  } else {
    if (goBack) {
      window.history.back();
    } else {
      window.location.href = `${process.env.NEXT_PUBLIC_SANDBOX_URL}/#/home`;
      sessionStorage.removeItem("entryPoint");
      return;
    }
  }
};
