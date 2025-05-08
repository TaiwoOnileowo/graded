import { auth } from "@/auth";
import LecturerCoursePage from "@/components/lecturer/LecturerCourseHome";
import StudentCoursePage from "@/components/student/CourseHome";
import { getCourseById } from "@/lib/actions/course.action";
import { notFound } from "next/navigation";

const Page = async ({ params }: any) => {
  const { courseId } = await params;
  const session = await auth();
  const role = session?.user?.role;
  const isStudent = role === "STUDENT";
  const course = await getCourseById(courseId);
  if (!course) {
    return notFound();
  }
  return (
    <>
      {isStudent ? (
        <StudentCoursePage course={course} />
      ) : (
        <LecturerCoursePage course={course} />
      )}
    </>
  );
};
export default Page;
