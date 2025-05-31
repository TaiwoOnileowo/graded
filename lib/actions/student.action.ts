import { prisma } from "@/prisma/prisma";
import { auth } from "@/auth";

export type StudentDetails = {
  id: string;
  name: string;
  email: string;
  matricNumber: string;
  level: number;
  major: string;
};

export async function getStudentDetails(
  studentId: string
): Promise<StudentDetails | null> {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: true,
      },
    });

    if (!student) return null;

    return {
      id: student.id,
      name: student.user.name,
      email: student.user.email,
      matricNumber: student.matricNumber,
      level: student.level,
      major: student.major,
    };
  } catch (error) {
    console.error("Error fetching student details:", error);
    throw new Error("Failed to fetch student details");
  }
}
