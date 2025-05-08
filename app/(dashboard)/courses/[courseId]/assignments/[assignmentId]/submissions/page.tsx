import { auth } from "@/auth";
import LecturerSubmissionsPage from "@/components/lecturer/SubmissionsHome";
import { notFound } from "next/navigation";
import { getCourseName } from "@/lib/actions/course.action";
import { getAssignmentDetails } from "@/lib/actions/assignment.action";


// SEO Metadata function
export async function generateMetadata({ params }: { params: any }) {
  const { courseId, assignmentId } = await params;
  const session = await auth();
  const role = session?.user?.role;

  // Check if the user is a student, if so, return fallback SEO
  if (role === "STUDENT") {
    return {
      title: "Access Denied | Course Management",
      description: "You are not authorized to view this page.",
    };
  }

  // Fetch course and assignment details
  const course = await getCourseName(courseId);
  const assignment = await getAssignmentDetails(assignmentId, session?.user?.id as string);

  if (!course || !assignment) {
    return {
      title: "Assignment or Course Not Found | Course Management",
      description: "The requested course or assignment details are not available.",
    };
  }

  // Set the page title and description dynamically based on course and assignment data
  return {
    title: `${assignment?.title} Submissions - ${course.name} | Course Management`,
    description: `View the submissions for ${assignment?.title} in the ${course.name} course. Manage and review student submissions here.`,
  };
}

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
