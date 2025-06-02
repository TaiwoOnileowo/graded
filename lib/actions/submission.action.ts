"use server";

import { prisma } from "@/prisma/prisma";
import { auth } from "@/auth";

export type SubmissionWithStudent = {
  id: string;
  studentName: string;
  matricNumber: string;
  submissionDate: string | null;
  onTime: boolean | null;
  status: "Graded" | "Ungraded" | "Missing";
  score: number | null;
  totalScore: number;
  content?: string | null;
  fileUrl?: string | null;
  feedback?: string | null;
  gradedAt?: Date | null;
  autoGrade?: number | null;
  testsPassed?: number | null;
  testsTotal?: number | null;
};

export type SubmissionStats = {
  totalSubmissions: number;
  totalStudents: number;
  averageScore: number;
  gradedCount: number;
};

export async function getSubmissions(
  assignmentId: string,
  page: number = 1,
  limit: number = 10,
  search?: string
) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await prisma.submission.count({
      where: {
        assignmentId,
        student: {
          user: {
            name: search
              ? { contains: search, mode: "insensitive" }
              : undefined,
          },
        },
      },
    });

    // Get submissions with student info
    const submissions = await prisma.submission.findMany({
      where: {
        assignmentId,
        student: {
          user: {
            name: search
              ? { contains: search, mode: "insensitive" }
              : undefined,
          },
        },
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        assignment: true,
      },
      skip,
      take: limit,
      orderBy: {
        submittedAt: "desc",
      },
    });

    // Transform the data
    const transformedSubmissions: SubmissionWithStudent[] = submissions.map(
      (sub) => ({
        id: sub.id,
        studentName: sub.student.user.name,
        matricNumber: sub.student.matricNumber,
        submissionDate: sub.submittedAt?.toLocaleString() || null,
        onTime: sub.submittedAt
          ? sub.submittedAt <= (sub.assignment.deadline || new Date())
          : null,
        status: sub.gradedAt
          ? "Graded"
          : sub.submittedAt
          ? "Ungraded"
          : "Missing",
        score: sub.autoGrade || null,
        totalScore: sub.assignment.marks,
        content: sub.content,
        feedback: sub.feedback,
        gradedAt: sub.gradedAt,
        autoGrade: sub.autoGrade,
        testsPassed: sub.testsPassed,
        testsTotal: sub.testsTotal,
      })
    );

    return {
      submissions: transformedSubmissions,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching submissions:", error);
    throw new Error("Failed to fetch submissions");
  }
}

export async function getSubmissionStats(assignmentId: string) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    // Get total students enrolled in the course
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        course: {
          include: {
            enrollments: true,
          },
        },
      },
    });

    if (!assignment) throw new Error("Assignment not found");

    const totalStudents = assignment.course.enrollments.length;

    // Get submission stats
    const submissions = await prisma.submission.findMany({
      where: { assignmentId },
      select: {
        autoGrade: true,
        gradedAt: true,
      },
    });

    const totalSubmissions = submissions.length;
    const gradedCount = submissions.filter((s) => s.gradedAt).length;
    const averageScore =
      submissions.reduce((acc, curr) => acc + (curr.autoGrade || 0), 0) /
      (gradedCount || 1);

    return {
      totalSubmissions,
      totalStudents,
      averageScore: Math.round(averageScore * 100) / 100,
      gradedCount,
    };
  } catch (error) {
    console.error("Error fetching submission stats:", error);
    throw new Error("Failed to fetch submission stats");
  }
}
