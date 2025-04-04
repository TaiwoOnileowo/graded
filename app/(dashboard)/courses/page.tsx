import { auth } from "@/auth";
import LecturerCourseHome from "@/components/lecturer/LecturerCoursesHome";
import CoursesHome from "@/components/student/CoursesHome";

const Page = async () => {
  const session = await auth();
  const role = session?.user?.role;
  const isStudent = role === "STUDENT";
  return <>{isStudent ? <CoursesHome /> : <LecturerCourseHome />}</>;
};
export default Page;
