import { auth } from "@/auth";
import ManageStudents from "@/components/student/ManageStudents";
import { notFound } from "next/navigation";

const Page = async ({ params }: { params: any }) => {
  const { courseId: id } = await params;
  const session = await auth();
  const role = session?.user?.role;
  const isStudent = role === "STUDENT";
  if (isStudent) {
    return notFound();
  }
  return <ManageStudents courseId={id} />;
};
export default Page;
