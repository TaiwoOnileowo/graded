import { auth } from "@/auth";
import LecturerDashboard from "@/components/lecturer/LecturerDashHome";
import DashHome from "@/components/student/DashHome";

export default async function HomePage() {
  const session = await auth();
  const role = session?.user?.role;
  const isStudent = role === "STUDENT";
  return <>{isStudent ? <DashHome /> : <LecturerDashboard />}</>;
}
