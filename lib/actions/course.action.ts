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
        isPublished: courseData.isPublished,
        lecturerId: courseData.lecturerId,
      },
    });
    return createdCourse;
  } catch (error) {
    console.log(error, "Error");
    throw new Error("Error creating course");
  }
};

export const getCourses = async () => {
  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        description: true,
        isPublished: true,
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
        assignments: course.assignments.length,
        students: course.enrollments.length,
      };
    });
  } catch (error) {
    console.log(error, "Error");
    throw new Error("Error fetching courses");
  }
};

export const getCourseById = async (courseId: string) => {
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
        enrollments: true,
      },
    });
    return course;
  } catch (error) {
    console.log(error, "Error");
    throw new Error("Error fetching course");
  }
};
