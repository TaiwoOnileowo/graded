import { auth } from "@/auth";
import LecturerSubmissionPage from "@/components/lecturer/SubmissionHome";
import { notFound } from "next/navigation";

const Page = async ({ params }: { params: any }) => {
  const { courseId, assignmentId, submissionId } = await params;
  const session = await auth();
  const role = session?.user?.role;
  const isStudent = role === "STUDENT";
  if (isStudent) {
    return notFound();
  }
  return (
    // <LecturerSubmissionPage
    //   submissionId={submissionId}
    //   courseId={courseId}
    //   assignmentId={assignmentId}
    // />
    <></>
  );
};
export default Page;
