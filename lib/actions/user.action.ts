"use server";

import { signIn } from "@/auth";
import { hashPassword } from "@/utils/functions/password";
import { ZodError } from "zod";
import { signInSchema } from "../validations/signin";
import { prisma } from "@/prisma/prisma";

export type LecturerSignupCredentials = {
  email: string;
  password: string;
  name: string;
  title: string;
  department: string;
  bio: string;
  role: "LECTURER";
};
export type StudentSignupCredentials = {
  email: string;
  password: string;
  name: string;
  matricNumber: string;
  level: string;
  major: string;
  role: "STUDENT";
};
export const createLecturer = async (
  credentials: LecturerSignupCredentials
) => {
  try {
    const hashedPassword = await hashPassword(credentials.password);
    const newUser = await prisma.user.create({
      data: {
        email: credentials.email,
        name: credentials.name,
        hashedPassword,
        role: credentials.role,
        lecturer: {
          create: {
            title: credentials.title,
            department: credentials.department,
            bio: credentials.bio,
          },
        },
      },
    });
    return newUser;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const createStudent = async (credentials: StudentSignupCredentials) => {
  try {
    const hashedPassword = await hashPassword(credentials.password);
    const newUser = await prisma.user.create({
      data: {
        email: credentials.email,
        name: credentials.name,
        hashedPassword,
        role: credentials.role,
        student: {
          create: {
            matricNumber: credentials.matricNumber,
            major: credentials.major,
            level: Number(credentials.level),
          },
        },
      },
    });
    return newUser;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
export const signupUser = async (
  credentials: StudentSignupCredentials | LecturerSignupCredentials
) => {
  try {
    const { email, password } = await signInSchema.parseAsync(credentials);
    const user = await getUserByEmail(email);
    if (user) {
      throw new Error("User already exists");
    }
    let newUser;
    if (credentials.role === "STUDENT") {
      newUser = await createStudent(credentials);
    } else {
      newUser = await createLecturer(credentials);
    }
    await signIn("credentials", { email, password, redirect: false });
    return { success: true, user: newUser };
  } catch (error: any) {
    console.error("Authorize error:", error);
    if (error instanceof ZodError) {
      return { success: false, error: "Invalid input format" };
    }
    return { success: false, error: "Authentication failed" };
  }
};
export const signInUser = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const { email, password } = await signInSchema.parseAsync(credentials);

    await signIn("credentials", { email, password, redirect: false });
    return { success: true };
  } catch (error: any) {
    console.error("Authorize error:", error);
    if (error instanceof ZodError) {
      return { success: false, error: "Invalid input format" };
    }
    return { success: false, error: "Authentication failed" };
  }
};
export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        student: true,
        lecturer: true,
      },
    });

    if (user) {
      return user;
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
