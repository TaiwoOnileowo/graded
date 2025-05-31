import SubmissionReviewContent from "@/components/student/SubmissionReviewContent";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { getSubmissionReviewData } from "@/lib/actions/submission-review.action";

// SEO Metadata function
export async function generateMetadata({ params }: { params: any }) {
  const { submissionId } = await params;
  const session = await auth();
  const role = session?.user?.role;

  // Check if the user is authorized
  if (role !== "LECTURER" && role !== "ADMIN") {
    return {
      title: "Access Denied | Course Management",
      description: "You are not authorized to view this page.",
    };
  }

  const submission = await getSubmissionReviewData(submissionId);

  if (!submission) {
    return {
      title: "Submission Not Found | Course Management",
      description: "The requested submission details are not available.",
    };
  }

  return {
    title: `${submission.student.name}'s Submission - ${submission.assignmentTitle} | Course Management`,
    description: `Review ${submission.student.name}'s submission for ${submission.assignmentTitle} in ${submission.courseName}.`,
  };
}

export default async function SubmissionReviewPage({
  params,
}: {
  params: any;
}) {
  const { courseId, assignmentId, submissionId } = await params;
  const session = await auth();
  const role = session?.user?.role;

  // Check authorization
  if (role !== "LECTURER" && role !== "ADMIN") {
    return notFound();
  }

  // Get submission data
  const submission = await getSubmissionReviewData(submissionId);

  if (!submission) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<SubmissionReviewSkeleton />}>
        <SubmissionReviewContent
          submission={submission}
          courseId={courseId}
          assignmentId={assignmentId}
        />
      </Suspense>
    </div>
  );
}

function SubmissionReviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-10" />
        <div>
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-48 mt-1" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>

      <Skeleton className="h-[600px] w-full" />
    </div>
  );
}
