import { auth } from "@/auth";
import LecturerDashboard from "@/components/lecturer/LecturerDashHome";
import DashHome from "@/components/student/DashHome";
import { getEnrolledCourses, getLecuterCourses } from "@/lib/actions/course.action";
import { IEnrolledCourse, Course } from "@/types";
import type { Metadata } from "next";

// Dynamic SEO metadata
export async function generateMetadata(): Promise<Metadata> {
  const session = await auth();
  const role = session?.user?.role;
  const isStudent = role === "STUDENT";

  return {
    title: isStudent ? "Student Dashboard | Learn Smart" : "Lecturer Dashboard | Teach Smart",
    description: isStudent
      ? "View your enrolled courses, progress, and recent updates all in one place."
      : `Welcome back, ${session?.user?.name}. Manage your courses, monitor student engagement, and plan your lectures.`,
  };
}

export default async function HomePage() {
  const session = await auth();
  const role = session?.user?.role;
  const isStudent = role === "STUDENT";
  let enrolledCourses: IEnrolledCourse[] | undefined = [];
  let lecturerCourses: Course[] | undefined = [];

  if (isStudent) {
    enrolledCourses = await getEnrolledCourses(session?.user?.student?.id!);
  } else {
    lecturerCourses = await getLecuterCourses(session?.user?.lecturer?.id!);
  }

  return (
    <>
      {isStudent ? (
        <DashHome enrolledCourses={enrolledCourses} />
      ) : (
        <LecturerDashboard
          courses={lecturerCourses!}
          name={session?.user?.name!}
          title={session?.user.lecturer?.title!}
          userId={session?.user?.lecturer?.id!}
        />
      )}
    </>
  );
}
