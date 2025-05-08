import { auth } from "@/auth";
import AllStudents from "@/components/lecturer/AllStudents";
import { getEnrolledStudentsByLecturer } from "@/lib/actions/course.action";
import type { Metadata } from "next";

// Dynamic SEO Metadata
export async function generateMetadata(): Promise<Metadata> {
  const session = await auth();
  const name = session?.user?.name;

  return {
    title: `All Enrolled Students | ${name}'s Dashboard`,
    description: `Browse and manage all students currently enrolled in your courses. Stay updated with student participation and progress.`,
  };
}

const page = async () => {
  const session = await auth();
  const lecturerStudents = await getEnrolledStudentsByLecturer(session?.user?.lecturer?.id!);

  return <AllStudents students={lecturerStudents} />;
};

export default page;
