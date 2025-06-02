import { auth } from "@/auth";
import LecturerCoursePage from "@/components/lecturer/LecturerCourseHome";
import StudentCoursePage from "@/components/student/CourseHome";
import { getCourseById, getCourseName } from "@/lib/actions/course.action";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { courseId } = await params;
  const session = await auth();
  const role = session?.user?.role;
  const isStudent = role === "STUDENT";
  const course = await getCourseById(courseId);
  const courseDetails = await getCourseName(courseId);

  if (!course || !courseDetails) {
    return {};
  }

  const { name, code } = courseDetails;

  return {
    title: isStudent
      ? `Your Course: ${name} (${code})`
      : `Manage Course: ${name} (${code})`,
    description: isStudent
      ? `Access all your learning materials and updates for ${name} (${code}).`
      : `Manage content, materials, and students for the course ${name} (${code}).`,
  };
}

const Page = async ({ params }: any) => {
  const { courseId } = await params;
  const session = await auth();
  const role = session?.user?.role;
  const isStudent = role === "STUDENT";
  const course = await getCourseById(courseId, session?.user?.student?.id);

  if (!course) {
    return notFound();
  }

  return (
    <>
      {isStudent ? (
        <StudentCoursePage course={course} />
      ) : (
        <LecturerCoursePage course={course as any} />
      )}
    </>
  );
};

export default Page;
