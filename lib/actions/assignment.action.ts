"use server";

import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const assignmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  marks: z.number().min(0, "Marks must be positive"),
  deadline: z.string().optional(),
  questionText: z.string().optional(),
  codeTemplate: z.string().optional(),
  expectedSolution: z.string().optional(),
  hint: z.string().optional(),
  isPublished: z.boolean().default(false),
  courseId: z.string(),
  rubricItems: z.array(
    z.object({
      title: z.string().min(1, "Rubric title is required"),
      description: z.string().optional(),
      maxPoints: z.number().min(0, "Points must be positive"),
    })
  ),
  testCases: z.array(
    z.object({
      input: z.string().min(1, "Input is required"),
      expectedOutput: z.string().min(1, "Expected output is required"),
      description: z.string().optional(),
    })
  ),
});

export async function createAssignment(formData: FormData) {
  try {
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      marks: Number(formData.get("marks")),
      deadline: formData.get("deadline") as string,
      questionText: formData.get("questionText") as string,
      codeTemplate: formData.get("codeTemplate") as string,
      expectedSolution: formData.get("expectedSolution") as string,
      hint: formData.get("hint") as string,
      courseId: formData.get("courseId") as string,
      rubricItems: JSON.parse(formData.get("rubricItems") as string),
      testCases: JSON.parse(formData.get("testCases") as string),
    };
    const validatedData = assignmentSchema.parse(data);
    const assignment = await prisma.assignment.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        marks: validatedData.marks,
        deadline: validatedData.deadline
          ? new Date(validatedData.deadline)
          : undefined,
        questionText: validatedData.questionText,
        codeTemplate: validatedData.codeTemplate,
        expectedSolution: validatedData.expectedSolution,
        hint: validatedData.hint,
        courseId: validatedData.courseId,
        rubrics: {
          create: validatedData.rubricItems.map((item) => ({
            title: item.title,
            description: item.description,
            maxPoints: item.maxPoints,
          })),
        },
        testCases: {
          create: validatedData.testCases.map((test) => ({
            input: test.input,
            expectedOutput: test.expectedOutput,
            description: test.description,
          })),
        },
      },
    });

    revalidatePath(`/courses/${validatedData.courseId}`);
    return { success: true, assignmentId: assignment.id };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(", "),
      };
    }
    return { success: false, error: "Failed to create assignment" };
  }
}
