"use server";

const { exec } = require("child_process");
const fs = require("fs").promises;
const path = require("path");

// Define types for execution result
/**
 * @typedef {Object} ExecutionResult
 * @property {boolean} success
 * @property {string|null} output
 * @property {string|null} error
 * @property {number|string} executionTime
 */

/**
 * @typedef {Object} LanguageCommands
 * @property {string} [compile]
 * @property {string} run
 */

/**
 * @typedef {Object} CommandOutput
 * @property {string} stdout
 * @property {string} stderr
 */

/**
 * Execute code in the specified language
 * @param {string} filePath - Path to the code file
 * @param {string} language - Programming language
 * @param {string} workingDir - Working directory for execution
 * @returns {Promise<ExecutionResult>} - Execution result
 */
async function executeCode(filePath, language, workingDir) {
  const commands = {
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
  const execCommand = (cmd) => {
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
    let compileOutput = null;
    let runOutput = null;

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
  } catch (error) {
    return {
      success: false,
      output: null,
      error: error.message || "Execution failed",
      executionTime: 0,
    };
  }
}

module.exports = { executeCode };
