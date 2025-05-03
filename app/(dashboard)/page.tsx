import { auth } from "@/auth";
import LecturerDashboard from "@/components/lecturer/LecturerDashHome";
import DashHome from "@/components/student/DashHome";
import { getEnrolledCourses, getEnrolledStudents, getLecuterCourses } from "@/lib/actions/course.action";
import { IEnrolledCourse, Course } from "@/types";

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
          <LecturerDashboard courses={lecturerCourses!} name={session?.user?.name!} title={session?.user.lecturer?.title!} userId={session?.user?.lecturer?.id!} />
      )}
    </>
  );
}
