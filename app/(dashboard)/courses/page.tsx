import { auth } from "@/auth";
import LecturerCourseHome from "@/components/lecturer/LecturerCoursesHome";
import CoursesHome from "@/components/student/CoursesHome";
import { getCourses } from "@/lib/actions/course.action";

export async function generateStaticParams() {}
const Page = async () => {
  const session = await auth();
  const role = session?.user?.role;
  const isStudent = role === "STUDENT";
  const courses = await getCourses();
  return (
    <>
      {isStudent ? <CoursesHome /> : <LecturerCourseHome courses={courses} />}
    </>
  );
};
export default Page;
