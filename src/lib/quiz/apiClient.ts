import apiService from "../apiService";
import { getCookie } from "cookies-next";

export const captureEvent = async ({ data }) => {
  const userId = getCookie("userId");
  const userRole = getCookie("userRole");
  try {
    const inclusion = [ "gk","coding", "language-practice"]; // "language-learn",
    if(inclusion.includes(data.type)){
      await apiService.post(`quiz/submit`, {
        userId,
        userRole,
        ...data
      });
    }
  } catch (error) {
    // throw error;
  }
};
