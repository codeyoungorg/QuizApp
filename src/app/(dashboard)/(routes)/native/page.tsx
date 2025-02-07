"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import CircularProgress from "@mui/material/CircularProgress";

const NativeComponent = () => {
  const router = useRouter();
  useEffect(() => {
    const handleMessage = async (event: {
      data: {
        authToken?: string;
        refreshToken?: string;
        userName?: string;
        userId?: string;
        grade?: number;
        userRole?: string;
      };
    }) => {
      const data = event.data;

      setCookie("Authorization", data?.authToken);
      setCookie("refresh-token", data?.refreshToken);
      setCookie("userName", data?.userName);
      setCookie("userId", data?.userId);
      setCookie("grade", data?.grade);
      setCookie("userRole", data?.userRole);

      setTimeout(() => {
        router.push("/");
      }, 2000);
      // Route to the main page
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);
  return (
    <div className="flex justify-center align-middle">
      {" "}
      <CircularProgress color="inherit" size={25} />
    </div>
  );
};

export default NativeComponent;
