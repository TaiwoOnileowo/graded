"use server";

import { prisma } from "@/prisma/prisma";
import { CourseData } from "@/types";
import { auth } from "@/auth";

export const createCourse = async (courseData: CourseData) => {
  try {
    const createdCourse = await prisma.course.create({
      data: {
        name: courseData.name,
        code: courseData.code,
        description: courseData.description,
        lecturerId: courseData.lecturerId,
        password: courseData.password || courseData.code.toUpperCase(),
      },
    });
    return createdCourse;
  } catch (error) {
    console.log(error, "Error");
    throw new Error("Error creating course");
  }
};

export const getCourses = async (studentId?: string) => {
  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        description: true,
        isPublished: true,
        lecturer: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        assignments: {
          select: {
            id: true,
          },
          where: {
            isPublished: true,
          },
        },
        enrollments: {
          select: {
            id: true,
            studentId: true,
          },
          where: {
            status: "ENROLLED",
          },
        },
      },
    });
    return courses.map((course) => {
      return {
        id: course.id,
        name: course.name,
        code: course.code,
        description: course.description,
        isPublished: course.isPublished,
        lecturer: course.lecturer.user.name,
        assignments: course.assignments.length,
        enrolled: course.enrollments.find((enrollment) => {
          return enrollment.studentId === studentId;
        })
          ? true
          : false,
        students: course.enrollments.length,
      };
    });
  } catch (error) {
    console.log(error, "Error");
    throw new Error("Error fetching courses");
  }
};

export type CourseDetails = {
  id: string;
  name: string;
  code: string;
};

export async function getCourseName(
  courseId: string
): Promise<CourseDetails | null> {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        name: true,
        code: true,
      },
    });

    if (!course) return null;

    return {
      id: course.id,
      name: course.name,
      code: course.code,
    };
  } catch (error) {
    console.error("Error fetching course details:", error);
    throw new Error("Failed to fetch course details");
  }
}

export const getLecuterCourses = async (lecturerId?: string) => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        lecturerId,
      },
      select: {
        id: true,
        name: true,
        code: true,
        description: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
        lecturer: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        assignments: {
          select: {
            id: true,
          },
          where: {
            isPublished: true,
          },
        },
        enrollments: {
          select: {
            id: true,
            studentId: true,
          },
          where: {
            status: "ENROLLED",
          },
        },
      },
    });
    return courses.map((course) => {
      return {
        id: course.id,
        name: course.name,
        code: course.code,
        description: course.description,
        isPublished: course.isPublished,
        lecturer: course.lecturer.user.name,
        createdAt: course.createdAt,
        students: course.enrollments.length,
        updatedAt: course.updatedAt,
        assignments: course.assignments.length,
      };
    });
  } catch (error) {
    console.log(error, "Error");
    throw new Error("Error fetching courses");
  }
};
export const getCourseById = async (courseId: string, studentId?: string) => {
  try {
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        assignments: {
          include: {
            submissions: true,
          },
        },
        lecturer: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        enrollments: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            student: {
              select: {
                id: true,
                level: true,
                major: true,
                matricNumber: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!course) {
      return null;
    }

    // Create a studentList for easier access in the component
    const studentList = course.enrollments.map((enrollment) => ({
      enrollmentId: enrollment.id,
      studentId: enrollment.student.id,
      status: enrollment.status,
      enrolledAt: enrollment.createdAt,
      level: enrollment.student.level,
      major: enrollment.student.major,
      matricNumber: enrollment.student.matricNumber,
      user: enrollment.student.user,
    }));

    return {
      ...course,
      studentList, // Add this for easy access
      assignments: course?.assignments.map((assignment) => ({
        ...assignment,
        completed: assignment.submissions.find(
          (submission) => studentId === submission.studentId
        )
          ? true
          : false,
      })),
    };
  } catch (error) {
    console.log(error, "Error");
    throw new Error("Error fetching course");
  }
};

export const getEnrolledCourses = async (studentId: string) => {
  try {
    const enrolledCourses = await prisma.course.findMany({
      where: {
        enrollments: {
          some: {
            studentId: studentId,
            status: "ENROLLED",
          },
        },
      },
      include: {
        lecturer: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        assignments: {
          select: {
            id: true,
          },
        },
      },
    });
    return enrolledCourses.map((course) => {
      return {
        id: course.id,
        name: course.name,
        code: course.code,
        description: course.description,
        assignments: course.assignments.length,
        lecturer: course.lecturer.user.name,
      };
    });
  } catch (error) {
    console.log(error, "Error");
    throw new Error("Error fetching enrolled courses");
  }
};

export const enrollStudent = async (
  courseId: string,
  studentId: string,
  password: string
) => {
  console.log(courseId, studentId, "enrollStudent");
  try {
    // First, get the course to verify the password
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { password: true },
    });

    if (!course) {
      throw new Error("Course not found");
    }

    // Verify the password
    if (course.password !== password) {
      throw new Error("Invalid course password");
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        courseId: courseId,
        studentId: studentId,
        status: "ENROLLED",
      },
    });
    return enrollment;
  } catch (error) {
    console.log(error, "Error");
    throw error; // Re-throw the error to handle it in the component
  }
};

export const getEnrolledStudents = async (courseId: string) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        name: true,
        enrollments: {
          where: {
            status: "ENROLLED",
          },
          include: {
            student: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      throw new Error("Course not found");
    }

    const students = course.enrollments.map((enrollment) => ({
      id: enrollment.student.id,
      name: enrollment.student.user.name,
      email: enrollment.student.user.email,
      matricNumber: enrollment.student.matricNumber,
      level: enrollment.student.level,
      major: enrollment.student.major,
      courseId: course.id,
      courseName: course.name,
    }));

    return students;
  } catch (error) {
    console.log(error, "Error");
    throw new Error("Error fetching enrolled students");
  }
};

export const getEnrolledStudentsByLecturer = async (userId: string) => {
  const lecturer = await prisma.lecturer.findUnique({
    where: { id: userId },
    include: {
      courses: {
        include: {
          enrollments: {
            include: {
              student: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!lecturer) {
    throw new Error("Lecturer not found");
  }

  // Flatten and return student users
  const enrolledStudents = lecturer.courses.flatMap((course) =>
    course.enrollments.map((enrollment) => ({
      courseId: course.id,
      courseName: course.name,
      studentId: enrollment.student.id,
      matricNumber: enrollment.student.matricNumber,
      level: enrollment.student.level,
      major: enrollment.student.major,
      user: enrollment.student.user,
    }))
  );

  return enrolledStudents;
};
