import { prisma } from "@/prisma/prisma";
import { auth } from "@/auth";

export type StudentSubmission = {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  submittedAt: Date;
  score: number;
  maxScore: number;
  status: "GRADED" | "LATE";
  feedback: string | null;
  attempts: number;
  timeSpent: number;
  deadline: Date;
  isLate: boolean;
};

export type StudentSubmissionStats = {
  averageScore: number;
  totalSubmissions: number;
  gradedSubmissions: number;
  lateSubmissions: number;
};

export async function getStudentSubmissions(
  studentId: string,
  courseId: string,
  page: number = 1,
  limit: number = 10
) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await prisma.submission.count({
      where: {
        studentId,
        assignment: {
          courseId,
        },
      },
    });

    // Get submissions with assignment info
    const submissions = await prisma.submission.findMany({
      where: {
        studentId,
        assignment: {
          courseId,
        },
      },
      include: {
        assignment: true,
      },
      skip,
      take: limit,
      orderBy: {
        submittedAt: "desc",
      },
    });

    // Transform the data
    const transformedSubmissions: StudentSubmission[] = submissions.map(
      (sub) => ({
        id: sub.id,
        assignmentId: sub.assignmentId,
        assignmentTitle: sub.assignment.title,
        submittedAt: sub.submittedAt,
        score: sub.finalGrade || 0,
        maxScore: sub.assignment.marks,
        status: sub.gradedAt ? "GRADED" : "LATE",
        feedback: sub.feedback,
        attempts: 1, // This would need to be calculated if you track attempts
        timeSpent: sub.timeSpent || 0,
        deadline: sub.assignment.deadline || new Date(),
        isLate: sub.submittedAt > (sub.assignment.deadline || new Date()),
      })
    );

    return {
      submissions: transformedSubmissions,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching student submissions:", error);
    throw new Error("Failed to fetch student submissions");
  }
}

export async function getStudentSubmissionStats(
  studentId: string,
  courseId: string
): Promise<StudentSubmissionStats> {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const submissions = await prisma.submission.findMany({
      where: {
        studentId,
        assignment: {
          courseId,
        },
      },
      include: {
        assignment: true,
      },
    });

    const totalSubmissions = submissions.length;
    const gradedSubmissions = submissions.filter((s) => s.gradedAt).length;
    const lateSubmissions = submissions.filter(
      (s) => s.submittedAt > (s.assignment.deadline || new Date())
    ).length;

    const averageScore =
      submissions.reduce((acc, curr) => acc + (curr.finalGrade || 0), 0) /
      (gradedSubmissions || 1);

    return {
      averageScore: Math.round(averageScore * 100) / 100,
      totalSubmissions,
      gradedSubmissions,
      lateSubmissions,
    };
  } catch (error) {
    console.error("Error fetching student submission stats:", error);
    throw new Error("Failed to fetch student submission stats");
  }
}
