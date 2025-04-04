import { auth } from "@/auth";
import LecturerCoursePage from "@/components/lecturer/LecturerCourseHome";
import StudentCoursePage from "@/components/student/CourseHome";

const Page = async ({ params }: any) => {
  const { id } = await params;
  const session = await auth();
  const role = session?.user?.role;
  const isStudent = role === "STUDENT";

  return (
    <>
      {isStudent ? (
        <StudentCoursePage courseId={id} />
      ) : (
        <LecturerCoursePage courseId={id} />
      )}
    </>
  );
};
export default Page;
