import apiService from "../apiService";
import { getCookie } from "cookies-next";

export const captureEvent = async ({ data }) => {
  const userId = getCookie("userId");
  const userRole = getCookie("userRole");
  try {
    const response = await apiService.post(`quiz/submit`, {
      userId,
      userRole,
      ...data
    });
    return response.data;
  } catch (error) {
    // console.error("unab", error);
    // throw error;
  }
};
