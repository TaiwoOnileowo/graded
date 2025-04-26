import { auth } from "@/auth";
import LecturerCoursePage from "@/components/lecturer/LecturerCourseHome";
import StudentCoursePage from "@/components/student/CourseHome";
import { getCourseById } from "@/lib/actions/course.action";

const Page = async ({ params }: any) => {
  const { courseId } = params;
  const session = await auth();
  const role = session?.user?.role;
  const isStudent = role === "STUDENT";
  const course = await getCourseById(courseId);
 
  console.log("course", course);
  return (
    <>
      {isStudent ? (
        <StudentCoursePage courseId={courseId} />
      ) : (
        <LecturerCoursePage course={course} />
      )}
    </>
  );
};
export default Page;
