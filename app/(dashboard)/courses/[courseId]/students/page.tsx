import { auth } from "@/auth";
import ManageStudents from "@/components/student/ManageStudents";
import {
  getCourseName,
  getEnrolledStudents,
} from "@/lib/actions/course.action";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// SEO Metadata function
export async function generateMetadata({
  params,
}: {
  params: any;
}): Promise<Metadata> {
  const { courseId: id } = await params;
  const enrolledStudents = await getEnrolledStudents(id);
  const { name, code } = await getCourseName(id);

  return {
    title: `${name} (${code}) - Students List | Course Management`,
    description: `View and manage all ${enrolledStudents.length} students enrolled in ${name} (${code}). Stay updated with student progress and participation.`,
  };
}

const Page = async ({ params }: { params: any }) => {
  // Course ID param
  const { courseId: id } = await params;
  // Get the session
  const session = await auth();
  const role = session?.user?.role;
  // Check if the user is a student or lecturer
  const isStudent = role === "STUDENT";
  const enrolledStudents = await getEnrolledStudents(id);
  console.log(enrolledStudents);

  // Get course name
  const { name, code } = await getCourseName(id);

  // Check if the user is a student and if the courseId is valid
  if (isStudent) {
    return notFound();
  }

  return (
    <ManageStudents
      students={enrolledStudents}
      courseId={id}
      courseName={name!}
      courseCode={code!}
    />
  );
};

export default Page;
