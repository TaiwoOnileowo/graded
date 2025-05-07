import { auth } from "@/auth";
import ManageStudents from "@/components/student/ManageStudents";
import { getEnrolledStudents } from "@/lib/actions/course.action";
import { notFound } from "next/navigation";

const Page = async ({ params }: { params: any }) => {
  const { courseId: id } = await params;
  const session = await auth();
  const role = session?.user?.role;
  const isStudent = role === "STUDENT";
   const enrolledStudents = await getEnrolledStudents(id);
  if (isStudent) {
    return notFound();
  }
  return <ManageStudents students={enrolledStudents} courseId={id} />;
};
export default Page;
