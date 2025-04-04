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
      },
    });
  } catch (error) {}
};
