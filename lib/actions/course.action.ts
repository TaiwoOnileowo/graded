"use server";

import { prisma } from "@/prisma/prisma";
import { CourseData } from "@/types";

export const createCourse = async (courseData: CourseData) => {
  try {
    const createdCourse = await prisma.course.create({
      data: {
        name: courseData.name,
        code: courseData.code,
        description: courseData.description,
        lecturerId: courseData.lecturerId,
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
        enrollments: true,
      },
    });
    return {
      ...course,
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

export const enrollStudent = async (courseId: string, studentId: string) => {
  console.log(courseId, studentId, "enrollStudent");
  try {
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
    throw new Error("Error enrolling student");
  }
};

export const getEnrolledStudents = async (courseId: string) => { 
  try {
    const students = await prisma.enrollment.findMany({
      where: {
        courseId: courseId,
        status: "ENROLLED",
      },
      include: {
        student: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
    return students.map((student) => ({
      id: student.studentId,
      name: student.student.user.name,
      email: student.student.user.email,
    }));
  } catch (error) {
    console.log(error, "Error");
    throw new Error("Error fetching enrolled students");
  }
}

export const  getEnrolledStudentsByLecturer = async (userId: string) =>{
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
    throw new Error('Lecturer not found');
  }

  // Flatten and return student users
  const enrolledStudents = lecturer.courses.flatMap(course =>
    course.enrollments.map(enrollment => ({
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
}