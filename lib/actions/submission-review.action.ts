import { prisma } from "@/prisma/prisma";
import { auth } from "@/auth";

export type SubmissionReviewData = {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  student: {
    id: string;
    name: string;
    email: string;
    matricNumber: string;
  };
  submittedAt: Date;
  status: string;
  score: number;
  maxScore: number;
  isLate: boolean;
  deadline: Date;
  timeSpent: number;
  code: string;
  testResults: {
    name: string;
    passed: boolean;
    message: string;
  }[];
  automatedFeedback: string;
  lecturerFeedback: string;
  generalFeedback: string;
};

export async function getSubmissionReviewData(
  submissionId: string
): Promise<SubmissionReviewData | null> {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        assignment: {
          include: {
            course: true,
          },
        },
        student: {
          include: {
            user: true,
          },
        },
        testResults: true,
      },
    });

    if (!submission) return null;

    return {
      id: submission.id,
      assignmentId: submission.assignmentId,
      assignmentTitle: submission.assignment.title,
      courseId: submission.assignment.course.id,
      courseName: submission.assignment.course.name,
      courseCode: submission.assignment.course.code,
      student: {
        id: submission.student.id,
        name: submission.student.user.name,
        email: submission.student.user.email,
        matricNumber: submission.student.matricNumber,
      },
      submittedAt: submission.submittedAt,
      status: submission.gradedAt ? "Graded" : "Pending",
      score: submission.autoGrade || 0,
      maxScore: submission.assignment.marks,
      isLate:
        submission.submittedAt > (submission.assignment.deadline || new Date()),
      deadline: submission.assignment.deadline || new Date(),
      timeSpent: submission.timeSpent || 0,
      code: submission.content || "",
      testResults: submission.testResults.map((test) => ({
        name: test.name,
        passed: test.passed,
        message: test.message,
      })),
      automatedFeedback: submission.feedback || "",
      lecturerFeedback: submission.lecturerFeedback || "",
      generalFeedback: submission.generalFeedback || "",
    };
  } catch (error) {
    console.error("Error fetching submission review data:", error);
    throw new Error("Failed to fetch submission review data");
  }
}

export async function updateSubmissionFeedback(
  submissionId: string,
  data: {
    lecturerFeedback: string;
    generalFeedback: string;
    score: number;
  }
) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    // Verify the user is a lecturer
    if (session.user.role !== "LECTURER" && session.user.role !== "ADMIN") {
      throw new Error("Unauthorized: Only lecturers can provide feedback");
    }

    // Get the submission to verify the max score
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        assignment: true,
      },
    });

    if (!submission) {
      throw new Error("Submission not found");
    }

    // Validate the score is within bounds
    if (data.score < 0 || data.score > submission.assignment.marks) {
      throw new Error(
        `Score must be between 0 and ${submission.assignment.marks}`
      );
    }

    // Update the submission
    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        lecturerFeedback: data.lecturerFeedback,
        generalFeedback: data.generalFeedback,
        autoGrade: data.score,
        gradedAt: new Date(),
      },
    });

    return updatedSubmission;
  } catch (error) {
    console.error("Error updating submission feedback:", error);
    throw error;
  }
}
