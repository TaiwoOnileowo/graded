import { auth } from "@/auth";
import LecturerDashboard from "@/components/lecturer/LecturerDashHome";
import DashHome from "@/components/student/DashHome";
import { getEnrolledCourses } from "@/lib/actions/course.action";
import { IEnrolledCourse } from "@/types";

export default async function HomePage() {
  const session = await auth();
  const role = session?.user?.role;
  const isStudent = role === "STUDENT";
  let enrolledCourses: IEnrolledCourse[] | undefined = [];
  if (isStudent) {
    enrolledCourses = await getEnrolledCourses(session?.user?.student?.id!);
  }
  return (
    <>
      {isStudent ? (
        <DashHome enrolledCourses={enrolledCourses} />
      ) : (
        <LecturerDashboard />
      )}
    </>
  );
}
