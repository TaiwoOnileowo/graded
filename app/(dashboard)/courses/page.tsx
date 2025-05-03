import { auth } from "@/auth";
import LecturerCourseHome from "@/components/lecturer/LecturerCoursesHome";
import CoursesHome from "@/components/student/CoursesHome";
import { getCourses, getLecuterCourses } from "@/lib/actions/course.action";

export async function generateStaticParams() {}
const Page = async () => {
  const session = await auth();
  const role = session?.user?.role;
  const isStudent = role === "STUDENT";
  const courses = await getCourses(session?.user?.student?.id!);
  const lecturerCourse = await getLecuterCourses(session?.user?.lecturer?.id)
  return (
    <>
      {isStudent ? (
        <CoursesHome
          courses={courses}
          studentId={session?.user?.student?.id!}
        />
      ) : (
        <LecturerCourseHome courses={lecturerCourse} />
      )}
    </>
  );
};
export default Page;
