import apiService from "../apiService";

export const getSubjectWise = async ({
  userId,
  subjectId,
}: {
  userId: string | null;
  subjectId: number | null;
}) => {
  try {
    const params = {
      studentId: userId,
      subjectId: subjectId,
    };

    const response = await apiService.get(`/dashboard/subjectWise`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getStudentDashboard = async ({
  studentId,
  subjectId,
}: {
  studentId: string | null;
  subjectId: number | null;
}) => {
  try {
    const params = {
      studentId,
      subjectId,
    };

    const response = await apiService.get(`/dashboard/student`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getStudentTopics = async ({
  course,
  studentId,
  grade,
}: {
  studentId: string | null;
  course: string | null;
  grade: string | null;
}) => {
  try {
    const params = {
      studentId,
      course,
      grade,
    };

    const response = await apiService.get(`/dashboard/topic`, { params });

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getLanguageDashboard = async ({
  userId,
  lang,
}: {
  userId: string | null;
  lang: number | null;
}) => {
  try {
    const params = {
      userId,
      languageId: lang,
    };
    const response = await apiService.get(`/language-learning/leaderboard`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getStudentActivity = async ({
  studentId,
  subjectId,
  userType,
  timeZone
}: {
  studentId: string | null;
  subjectId: number | null;
  userType: string 
  timeZone: string | false;
}) => {
  try {
    const params = {
      studentId,
      subjectId,
      userType,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    const response = await apiService.get(`/dashboard/activity`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getGuestDetails = async ({
  guestId,
}: {
  guestId: string | null;
}) => {
  try {
    const params = {
      guestId,
    };

    const response = await apiService.get(`/guest/student/init`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const saveStudentDetails = async (studentDetails: {
  studentName: string;
  grade: string;
  email: string;
  countryId: string;
  guestId: string;
  parentContact: string;
  parentName: string;
}) => {
  console.log(studentDetails, "details");
  try {
    const response = await apiService.post(`guest/student`, studentDetails);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
