import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import { NextResponse } from "next/server";

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.student?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      code,
      assignmentId,
      questionText,
      description,
      rubrics,
      testCases,
    } = await req.json();

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: { testCases: true, rubrics: true },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    const prompt = `
You are an expert programming instructor grading a student's assignment. Please analyze the following:

Assignment Details:
Question: ${questionText}
Description: ${description}

Student's Code:
\`\`\`
${code}
\`\`\`

Rubrics for Grading:
${rubrics
  .map((r: any) => `- ${r.title} (${r.maxPoints} points): ${r.description}`)
  .join("\n")}

Test Cases:
${testCases
  .map(
    (t: any) =>
      `Input: ${t.input}\nExpected Output: ${t.expectedOutput}\nDescription: ${t.description}`
  )
  .join("\n\n")}

Please provide:
1. A detailed analysis of the code
2. Whether each test case passes or fails
3. A score for each rubric item with justification
4. Overall feedback and suggestions for improvement
5. A final grade (out of ${assignment.marks})

Format your response as JSON with the following structure:
{
  "analysis": "detailed analysis of the code",
  "testResults": [
    {
      "name": "test case description",
      "passed": true/false,
      "message": "explanation of result"
    }
  ],
  "rubricEvaluations": [
    {
      "rubricItemId": "id",
      "points": number,
      "title": "title",
      "comment": "justification"
    }
  ],
  "feedback": "overall feedback",
  "finalGrade": number
}`;

    const client = ModelClient(endpoint, new AzureKeyCredential(token!));

    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          {
            role: "system",
            content:
              "You are an expert programming instructor grading student assignments. Provide detailed, constructive feedback and accurate grading based on the provided rubrics and test cases.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        top_p: 1.0,
        model: model,
      },
    });

    if (isUnexpected(response)) {
      throw response.body.error;
    }

    const gradingResult = JSON.parse(
      response.body.choices[0].message.content || "{}"
    );
    console.log(gradingResult, "gradingresult");

    // Map the rubric evaluations to use the correct rubric item IDs
    const rubricEvaluations = gradingResult.rubricEvaluations.map(
      (evaluation: any) => {
        // Try to find a rubric item by exact title match first
        let rubricItem = assignment.rubrics.find(
          (r) => r.title.toLowerCase() === evaluation.title.toLowerCase()
        );

        // If no exact match, try to find by partial title match
        if (!rubricItem) {
          rubricItem = assignment.rubrics.find(
            (r) =>
              r.title.toLowerCase().includes(evaluation.title.toLowerCase()) ||
              evaluation.title.toLowerCase().includes(r.title.toLowerCase())
          );
        }

        // If still no match, try to find by rubricItemId
        if (!rubricItem && evaluation.rubricItemId) {
          rubricItem = assignment.rubrics.find(
            (r) => r.id === evaluation.rubricItemId
          );
        }

        if (!rubricItem) {
          console.warn(
            `Could not find exact match for rubric: ${evaluation.title}`
          );
          // Find the first rubric item as a fallback
          rubricItem = assignment.rubrics[0];
          if (!rubricItem) {
            throw new Error("No rubric items found in the assignment");
          }
        }

        return {
          points: evaluation.points,
          comment: evaluation.comment,
          rubricItemId: rubricItem.id,
        };
      }
    );

    const submission = await prisma.submission.create({
      data: {
        content: code,
        studentId: session.user.student.id,
        assignmentId: assignmentId,
        autoGrade: gradingResult.finalGrade,
        feedback: gradingResult.feedback,
        testsPassed: gradingResult.testResults.filter((t: any) => t.passed)
          .length,
        testsTotal: gradingResult.testResults.length,
        testResults: {
          create: gradingResult.testResults.map((result: any) => ({
            name: result.name,
            passed: result.passed,
            message: result.message,
          })),
        },
        rubricEvaluations: {
          create: rubricEvaluations,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: { submission, gradingResult },
    });
  } catch (error) {
    console.error("Error in submission:", error);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 }
    );
  }
}
