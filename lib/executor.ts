import { exec } from "child_process";
import { promises as fs } from "fs";
import path from "path";

// Define types for execution result
export interface ExecutionResult {
  success: boolean;
  output: string | null;
  error: string | null;
  executionTime: number | string;
}

// Define types for language commands
interface LanguageCommands {
  compile?: string;
  run: string;
}

interface CommandOutput {
  stdout: string;
  stderr: string;
}

/**
 * Execute code in the specified language
 * @param {string} filePath - Path to the code file
 * @param {string} language - Programming language
 * @param {string} workingDir - Working directory for execution
 * @returns {Promise<ExecutionResult>} - Execution result
 */
export async function executeCode(
  filePath: string,
  language: string,
  workingDir: string
): Promise<ExecutionResult> {
  const commands: Record<string, LanguageCommands> = {
    c: {
      compile: `gcc ${filePath} -o ${path.join(workingDir, "solution")}`,
      run: path.join(workingDir, "solution"),
    },
    cpp: {
      compile: `g++ ${filePath} -o ${path.join(workingDir, "solution")}`,
      run: path.join(workingDir, "solution"),
    },
    python: {
      run: `python ${filePath}`,
    },
    javascript: {
      run: `node ${filePath}`,
    },
    java: {
      compile: `javac ${filePath}`,
      run: `cd ${workingDir} && java Solution`,
    },
  };

  // Function to execute a shell command
  const execCommand = (cmd: string): Promise<CommandOutput> => {
    return new Promise((resolve, reject) => {
      exec(
        cmd,
        { cwd: workingDir, timeout: 10000 },
        (error, stdout, stderr) => {
          if (error && !stderr) {
            reject(error);
          } else {
            resolve({ stdout, stderr });
          }
        }
      );
    });
  };

  try {
    let compileOutput: CommandOutput | null = null;
    let runOutput: CommandOutput | null = null;

    // Compile if necessary
    if (commands[language].compile) {
      compileOutput = await execCommand(commands[language].compile);
      if (compileOutput.stderr) {
        return {
          success: false,
          output: null,
          error: compileOutput.stderr,
          executionTime: 0,
        };
      }
    }

    // Run the code
    const startTime = process.hrtime();
    runOutput = await execCommand(commands[language].run);
    const endTime = process.hrtime(startTime);
    const executionTimeMs = (endTime[0] * 1000 + endTime[1] / 1000000).toFixed(
      2
    );

    if (runOutput.stderr) {
      return {
        success: false,
        output: null,
        error: runOutput.stderr,
        executionTime: executionTimeMs,
      };
    }

    return {
      success: true,
      output: runOutput.stdout,
      error: null,
      executionTime: executionTimeMs,
    };
  } catch (error: any) {
    return {
      success: false,
      output: null,
      error: error.message || "Execution failed",
      executionTime: 0,
    };
  }
}
