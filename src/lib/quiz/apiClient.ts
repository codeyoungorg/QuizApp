import apiService from "../apiService";
import { getCookie } from "cookies-next";

export const captureEvent = async ({ data }) => {
  const userId = getCookie("userId");
  const userRole = getCookie("userRole");
  try {
    const types = [
      "gk",
      "coding",
      "language-learn",
      "language-practice",
    ];
    if(types.includes(data.type)){
      const response = await apiService.post(`quiz/submit`, {
        userId,
        userRole,
        ...data
      });
    }
  } catch (error) {
    // console.error("unab", error);
    // throw error;
  }
};
