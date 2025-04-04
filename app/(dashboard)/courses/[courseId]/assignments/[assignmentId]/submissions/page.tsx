import { auth } from "@/auth";
import LecturerSubmissionsPage from "@/components/lecturer/SubmissionsHome";
import { notFound } from "next/navigation";

const Page = async ({ params }: { params: any }) => {
  const { courseId, assignmentId } = await params;
  const session = await auth();
  const role = session?.user?.role;
  const isStudent = role === "STUDENT";
  if (isStudent) {
    return notFound();
  }
  return (
    <LecturerSubmissionsPage courseId={courseId} assignmentId={assignmentId} />
  );
};
export default Page;
