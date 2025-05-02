import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { executeCode } from "@/lib/executor";

// Define interface for request body
interface ExecuteRequestBody {
  code: string;
  language: string;
}

// Create submissions directory if it doesn't exist
const submissionsDir = path.join(process.cwd(), "submissions");
if (!fs.existsSync(submissionsDir)) {
  fs.mkdirSync(submissionsDir, { recursive: true });
}

export async function POST(request: NextRequest) {
  try {
    const { code, language } = (await request.json()) as ExecuteRequestBody;

    if (!code || !language) {
      return NextResponse.json(
        { error: "Code and language are required" },
        { status: 400 }
      );
    }

    // Validate language
    const supportedLanguages: string[] = [
      "c",
      "cpp",
      "python",
      "javascript",
      "java",
    ];
    if (!supportedLanguages.includes(language.toLowerCase())) {
      return NextResponse.json(
        { error: "Unsupported language" },
        { status: 400 }
      );
    }

    // Create a unique ID for this submission
    const submissionId = uuidv4();
    const submissionPath = path.join(submissionsDir, submissionId);
    fs.mkdirSync(submissionPath, { recursive: true });

    // Save code to file
    const fileExtensions: Record<string, string> = {
      c: "c",
      cpp: "cpp",
      python: "py",
      javascript: "js",
      java: "java",
    };

    const filename = `solution.${fileExtensions[language.toLowerCase()]}`;
    const filePath = path.join(submissionPath, filename);

    fs.writeFileSync(filePath, code);

    // Execute the code
    const result = await executeCode(
      filePath,
      language.toLowerCase(),
      submissionPath
    );

    // Clean up submission directory after execution
    fs.rmSync(submissionPath, { recursive: true, force: true });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error executing code:", error);
    return NextResponse.json(
      { error: "Failed to execute code" },
      { status: 500 }
    );
  }
}
