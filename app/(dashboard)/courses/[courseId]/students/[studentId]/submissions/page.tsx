import { auth } from "@/auth";
import StudentSubmissionsView from "@/components/student/StudentSubmissions";
import { Button } from "@/components/ui/button";
import { getCourseName } from "@/lib/actions/course.action";
import {
    getStudentSubmissions,
    getStudentSubmissionStats,
} from "@/lib/actions/student-submission.action";
import {
    getStudentDetails
} from "@/lib/actions/student.action";
import { queryClient } from "@/lib/http";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// SEO Metadata function
export async function generateMetadata({ params }: { params: any }) {
  const { courseId, studentId } = params;
  const session = await auth();
  const role = session?.user?.role;

  // Check if the user is authorized
  if (role !== "LECTURER" && role !== "ADMIN") {
    return {
      title: "Access Denied | Course Management",
      description: "You are not authorized to view this page.",
    };
  }

  // Fetch course and student details
  const course = await getCourseName(courseId);
  const student = await getStudentDetails(studentId);

  if (!course || !student) {
    return {
      title: "Student or Course Not Found | Course Management",
      description: "The requested student or course details are not available.",
    };
  }

  return {
    title: `${student.name}'s Submissions - ${course.name} | Course Management`,
    description: `View ${student.name}'s submissions for ${course.name} course.`,
  };
}

export default async function StudentSubmissionsPage({
  params,
}: {
  params: { courseId: string; studentId: string };
}) {
  const { courseId, studentId } = params;
  const session = await auth();
  const role = session?.user?.role;

  // Check authorization
  if (role !== "LECTURER" && role !== "ADMIN") {
    return notFound();
  }

  // Prefetch the initial data
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["studentSubmissions", studentId, courseId, 1, 10],
      queryFn: () => getStudentSubmissions(studentId, courseId, 1, 10),
    }),
    queryClient.prefetchQuery({
      queryKey: ["studentSubmissionStats", studentId, courseId],
      queryFn: () => getStudentSubmissionStats(studentId, courseId),
    }),
  ]);

  // Get course and student details
  const course = await getCourseName(courseId);
  const student = await getStudentDetails(studentId);

  if (!course || !student) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/courses/${courseId}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to course</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Student Submissions
          </h1>
          <p className="text-sm text-muted-foreground">
            {course.name} ({course.code})
          </p>
        </div>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <StudentSubmissionsView
          studentId={studentId}
          courseId={courseId}
          student={student}
          course={course}
        />
      </HydrationBoundary>
    </div>
  );
}
