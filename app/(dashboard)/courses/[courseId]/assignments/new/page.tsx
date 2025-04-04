import { auth } from "@/auth";
import LecturerNewAssignmentPage from "@/components/lecturer/AssignmentHome";
import { notFound } from "next/navigation";

const Page = async ({ params }: { params: any }) => {
  const { id } = await params;
  const session = await auth();
  const role = session?.user?.role;
  const isStudent = role === "STUDENT";
  if (isStudent) {
    return notFound();
  }
  return <LecturerNewAssignmentPage courseId={id} />;
};
export default Page;
