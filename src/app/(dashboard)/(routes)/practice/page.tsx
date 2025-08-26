import { cookies } from "next/headers";
import PracticeClient from "./_components/PracticeClient";

export default function PracticePage() {
  const cookieStore = cookies();

  const userId = cookieStore.get("userId")?.value || null;
  const grade = cookieStore.get("grade")?.value || null;

  return <PracticeClient user_id={userId} user_grade={grade} />;
}
