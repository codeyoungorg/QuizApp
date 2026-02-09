"use client";
import classNames from "clsx";
import React, { useEffect, useState } from "react";
import sandboxLogo from "@/assets/Images/sandboxLogo.svg";
import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import { getCookie } from "cookies-next";
import { stopLoader } from "../../utils/loaderUtils";
import { HandleQuite } from "@/utils/HandleQuite";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showBackButton, setShowBackButton] = useState(false);
  const [isWebView, setIsWebView] = useState(false);

  useEffect(() => {
    // stopLoader();

    // Check if we're in a WebView environment
    const checkWebView = () => {
      return window.ReactNativeWebView !== undefined;
    };

    setIsWebView(checkWebView());
  }, []);

  useEffect(() => {
    // stopLoader();

    if (window.ReactNativeWebView) {
      if (pathname !== "/" || getCookie("currentPageUrl")) {
        setShowBackButton(true);
      } else {
        setShowBackButton(false);
      }
    } else {
      if (pathname !== "/") {
        setShowBackButton(true);
      } else {
        setShowBackButton(false);
      }
    }
  }, [pathname]);

  const handleHome = () => {
    if (isWebView) {
      const mobileData = {
        type: "route",
      };
      window.ReactNativeWebView.postMessage(JSON.stringify(mobileData));
    }
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("from") && urlParams.get("from") !== "") {
      sessionStorage.setItem("entryPoint", urlParams.get("from") as string);
    }
  }, []);

  const isLanguagePage = pathname.includes("/language/");
  const isPracticePage = pathname.includes("/practice");

  const isHideNavigation = isLanguagePage || isPracticePage;

  return (
    <div
      className={`${inter.variable} font-sans h-full w-full bg-[#FFF] z-100`}
    >
      {!isHideNavigation && (
        <div
          className={`w-full border-b-2 flex items-center justify-between bg-[#FFF] py-4 sticky top-0 z-[100] ${
            isWebView && "h-14 top-7"
          }`}
        >
          {showBackButton ? (
            <button
              onClick={() => {
                const urlParams = new URLSearchParams(window.location.search);
                const entryPoint = sessionStorage.getItem("entryPoint");
                const fromParam = urlParams.get("from");
                if (isWebView) {
                  const targetUrl = getCookie("currentPageUrl");
                  const landingUrl = getCookie("targetPageUrl");

                  if (landingUrl === window.location.href) {
                    window.location.href = targetUrl || "";
                    return;
                  }
                }
                if (
                  entryPoint == "sandboxLanguage" &&
                  !pathname.includes("/quiz") &&
                  pathname.includes(`/languages`)
                ) {
                  window.location.href = `${process.env.NEXT_PUBLIC_SANDBOX_URL}/#/language-learning`;
                  sessionStorage.removeItem("entryPoint");
                  return;
                }
                if (fromParam == "sandbox") {
                  window.location.href = `${process.env.NEXT_PUBLIC_SANDBOX_URL}/#/home`;
                }
                if (pathname.includes("student-dashboard")) {
                  router.push("/");
                } else if (pathname.includes("subject-dashboard")) {
                  router.push("/student-dashboard");
                } else if (pathname.includes("gk-quiz")) {
                  router.push("/");
                } else if (pathname.includes("/quiz/")) {
                  const subjectName = pathname.split("/")[2];
                  router.push(
                    `/subject-dashboard?subject=${
                      subjectName == "math" ? "mathematics" : subjectName
                    }`
                  );
                } else if (pathname.includes("chat-bot/")) {
                  router.push("/chat-bot");
                } else if (pathname.includes("chat-bot")) {
                  router.push("/");
                } else if (
                  pathname.includes("languages/result") ||
                  pathname.includes("languages/quiz") ||
                  pathname.includes("languages/learn")
                ) {
                  const urlParams = new URLSearchParams(window.location.search);
                  const langParam = urlParams.get("lang");
                  if (langParam) {
                    router.push(`/languages?lang=${langParam}`);
                  } else {
                    router.push("/student-dashboard");
                  }
                } else if (pathname.includes("languages")) {
                  router.push("/student-dashboard");
                } else {
                  router.back();
                }
              }}
              className="md:ml-6 xs:ml-5 lg:text-sm md:text-xs font-bold leading-tight
            text-left text-[#569090] flex flex-row justify-center items-center lg:hover:bg-[#FFF] xs:hover:bg-[#f2f7f7] p-2 rounded-full"
            >
              <Image
                src={"/images/icons/arrow-left.svg"}
                alt="arrow-left"
                width={20}
                height={20}
              />
              <span className="ml-1 xs:hidden md:block">Go Back</span>
            </button>
          ) : (
            <></>
          )}
          {!isWebView && (
            <Link href="/" className="mx-auto">
              <Image src={sandboxLogo} alt="sandbox-logo" />
            </Link>
          )}
          {isWebView && (
            <IconButton
              aria-label="home"
              onClick={handleHome}
              className=" right-0"
            >
              <HomeIcon style={{ color: "#569090" }} />
            </IconButton>
          )}
          <button
            onClick={() => HandleQuite(false)}
            style={{
    display: "flex",
    alignItems: "center",
    gap: "8px",

    background: "#F2F2F2",
    border: "1px solid #6C9D9D",
    borderRadius: "14px",

    padding: "12px",
    marginRight: "32px",

    fontSize: "14px",
    fontWeight: 600,
    fontFamily: "Inter, sans-serif",
    color: "#6C9D9D",

    cursor: "pointer",
    transition: "background-color 0.2s ease, transform 0.1s ease",
  }}
  onMouseOver={(e) => {
    e.currentTarget.style.background = "#EFEFEF";
  }}
  onMouseOut={(e) => {
    e.currentTarget.style.background = "transparent";
  }}
  onMouseDown={(e) => {
    e.currentTarget.style.transform = "scale(0.99)";
  }}
  onMouseUp={(e) => {
    e.currentTarget.style.transform = "scale(1)";
  }}
>
  <span>Exit</span>
  <span style={{ fontSize: "18px", lineHeight: "1" }}>×</span>
  
  
  </button>
        </div>
      )}
      <main
        className={classNames(
          "md:mt-[1rem]  bg-[#FFF] overflow-y-auto refresh-scroll-container",
          isHideNavigation
            ? "h-[100svh] md:!mt-0"
            : "md:h-[calc(100vh-90px)] xs:h-[calc(100vh-56px)]"
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
