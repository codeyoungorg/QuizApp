export interface LeaderboardResponse {
  msg: string;
  leaderboard: {
    studentMeta: {
      [key: string]: {
        studentName: string;
        studentId: string;
        countryName: string;
        countryId: string;
        pic: string;
        timeZone: string;
        grade: number;
      };
    };
    topTenStudentList: {
      user_id: string;
      totalPoints: string;
      rank: string;
    }[];
  };
}
