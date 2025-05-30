import { auth } from "@/auth";
import LecturerNewAssignmentPage from "@/components/lecturer/AssignmentHome";
import { getCourseName } from "@/lib/actions/course.action";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// SEO Metadata function
export async function generateMetadata({
  params,
}: {
  params: any;
}): Promise<Metadata> {
  const { courseId: id } = await params;

  // Get course name and code
  const { name, code } = await getCourseName(id);

  return {
    title: `Create New Assignment - ${name} (${code}) | Course Management`,
    description: `Create a new assignment for the course ${name} (${code}). Manage and assess student submissions efficiently.`,
  };
}

const Page = async ({ params }: { params: any }) => {
  const { courseId: id } = await params;
  const session = await auth();
  const role = session?.user?.role;
  const isStudent = role === "STUDENT";

  // Prevent students from accessing the page
  if (isStudent) {
    return notFound();
  }

  return <LecturerNewAssignmentPage courseId={id} />;
};

export default Page;
