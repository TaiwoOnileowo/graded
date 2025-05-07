import { auth } from "@/auth";
import LecturerCourseHome from "@/components/lecturer/LecturerCoursesHome";
import CoursesHome from "@/components/student/CoursesHome";
import { getCourses, getLecuterCourses } from "@/lib/actions/course.action";
import type { Metadata } from "next";

// SEO metadata function
export async function generateMetadata(): Promise<Metadata> {
  const session = await auth();
  const role = session?.user?.role;
  const isStudent = role === "STUDENT";

  return {
    title: isStudent ? "My Courses | Student Dashboard" : "Manage Courses | Lecturer Portal",
    description: isStudent
      ? "Browse and access all your enrolled courses, materials, and announcements in one place."
      : "Manage all your taught courses, upload content, and track student engagement efficiently.",
  };
}

const Page = async () => {
  const session = await auth();
  const role = session?.user?.role;
  const isStudent = role === "STUDENT";

  const studentCourses = await getCourses(session?.user?.student?.id!);
  const lecturerCourse = await getLecuterCourses(session?.user?.lecturer?.id);

  return (
    <>
      {isStudent ? (
        <CoursesHome
          courses={studentCourses.sort().reverse()}
          studentId={session?.user?.student?.id!}
        />
      ) : (
        <LecturerCourseHome courses={lecturerCourse.sort().reverse()} />
      )}
    </>
  );
};

export default Page;
