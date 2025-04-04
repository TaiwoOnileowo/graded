"use server";
import { prisma } from "@/prisma/prisma";

export const getLecturerDetails = async (id: string) => {
  try {
    const details = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
        lecturer: {
          select: {
            title: true,
            department: true,
          },
        },
      },
    });
    const lecturerDetails = {
      name: details?.name || "Unknown",
      title: details?.lecturer?.title || "Lecturer",
      department: details?.lecturer?.department,
    };
    return lecturerDetails;
  } catch (error) {
    console.log(error, "Error");
  }
};
