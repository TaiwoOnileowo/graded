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
      testCases,
      totalMarks,
      questionText,
      rubrics,
      timeSpent,
    } = await req.json();
    const prompt = `
You are a supportive programming instructor grading a student's assignment. Write in a friendly, encouraging tone designed for beginners. Please analyze the following:

Assignment Details:
Question: ${questionText}

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
1. A beginner-friendly analysis of the code using simple language
2. Whether each test case passes or fails, with clear explanations about why tests failed and how to fix them
3. A score for each rubric item with easy-to-understand justification
4. Overall feedback that's encouraging and highlights what was done well first, then provides clear, specific suggestions for improvement
5. A final grade (out of ${totalMarks})

Guidelines for your feedback:
- Use simple, non-technical language where possible
- Explain programming concepts as if teaching someone new to coding
- Give specific examples of how to improve the code
- Be encouraging and positive, focusing on growth rather than mistakes
- Provide step-by-step explanations for complex issues

Format your response as JSON with the following structure:
{
  "analysis": "beginner-friendly analysis of the code",
  "testResults": [
    {
      "name": "test case description",
      "passed": true/false,
      "message": "clear explanation of result with simple fix if failed"
    }
  ],
  "rubricEvaluations": [
    {
      "rubricItemId": "id",
      "points": number,
      "title": "title",
      "comment": "encouraging, easy-to-understand justification"
    }
  ],
  "feedback": "encouraging overall feedback with specific learning opportunities",
  "finalGrade": number
}`;

    const client = ModelClient(endpoint, new AzureKeyCredential(token!));

    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          {
            role: "system",
            content:
              "You are a kind, supportive programming instructor grading student assignments. Your goal is to help beginners learn and grow. Provide encouraging, easy-to-understand feedback using simple language. Explain concepts clearly as if teaching someone new to programming, highlight what the student did well, and offer specific, actionable suggestions for improvement. Grade accurately based on the provided rubrics and test cases, but focus on the learning experience rather than just the grade.",
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
        let rubricItem = rubrics.find(
          (r: any) => r.title.toLowerCase() === evaluation.title.toLowerCase()
        );

        // If no exact match, try to find by partial title match
        if (!rubricItem) {
          rubricItem = rubrics.find(
            (r: any) =>
              r.title.toLowerCase().includes(evaluation.title.toLowerCase()) ||
              evaluation.title.toLowerCase().includes(r.title.toLowerCase())
          );
        }

        // If still no match, try to find by rubricItemId
        if (!rubricItem && evaluation.rubricItemId) {
          rubricItem = rubrics.find(
            (r: any) => r.id === evaluation.rubricItemId
          );
        }

        if (!rubricItem) {
          console.warn(
            `Could not find exact match for rubric: ${evaluation.title}`
          );
          // Find the first rubric item as a fallback
          rubricItem = rubrics[0];
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
        timeSpent,
        rubricEvaluations: {
          create: rubricEvaluations,
        },
      },
      include: {
        testResults: true,
        rubricEvaluations: {
          include: {
            rubricItem: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: { submission },
    });
  } catch (error) {
    console.error("Error in submission:", error);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 }
    );
  }
}
