import apiService from "../apiService";
import { getCookie } from "cookies-next";

export const saveStreak = async () => {
  const userId = getCookie("userId");
  const userRole = getCookie("userRole");

  try {
    const response = await apiService.post(`quiz/submit`, {
      userId,
      userRole,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
