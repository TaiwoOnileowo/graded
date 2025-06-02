"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import Loader from "../icons/Loader";
import Info from "../icons/Info";
import Success from "../icons/Success";
import Warn from "../icons/Warn";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsTrigger, TabsContent, TabsList } from "../ui/tabs";
import { useRouter } from "next/navigation";

// Import Monaco Editor dynamically (client-side only)
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

interface CodeEditorProps {
  initialCode: string;
  timeLimit?: number; // in minutes
  courseId: string;
}

interface DockerStatus {
  checking: boolean;
  docker?: {
    running: boolean;
  };
  container?: {
    running: boolean;
  };
  starting?: boolean;
  error?: string;
}

interface OutputState {
  success: boolean;
  message: string;
  stdout: string;
  stderr: string;
  output?: string;
  executionTime?: number;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode,
  timeLimit,
  courseId,
}) => {
  const router = useRouter();
  const [language, setLanguage] = useState("python");
  const [theme, setTheme] = useState("vs-dark");
  const [output, setOutput] = useState<OutputState | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [dockerStatus, setDockerStatus] = useState<DockerStatus>({
    checking: true,
  });
  const editorRef = useRef<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number>(
    timeLimit ? timeLimit * 60 : 0
  ); // Convert to seconds
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();
    checkDockerStatus();
  }, []);

  // Timer effect
  useEffect(() => {
    if (timeLimit) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timerRef.current);
            handleSubmit(); // Auto-submit when time is up
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Track time spent
      const timeSpentInterval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);

      return () => {
        clearInterval(timerRef.current);
        clearInterval(timeSpentInterval);
      };
    }
  }, [timeLimit]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const checkDockerStatus = async () => {
    try {
      setDockerStatus({ checking: true });
      const response = await axios.get("/api/docker/status");
      setDockerStatus({
        checking: false,
        docker: response.data.docker,
        container: response.data.container,
      });
    } catch (error: any) {
      setDockerStatus({
        checking: false,
        error: error.response?.data?.error || "Failed to check Docker status",
      });
    }
  };

  const startDockerContainer = async () => {
    try {
      setDockerStatus({ ...dockerStatus, starting: true });
      await axios.post("/api/docker/start");
      await checkDockerStatus();
    } catch (error: any) {
      setDockerStatus({
        ...dockerStatus,
        starting: false,
        error:
          error.response?.data?.error || "Failed to start Docker container",
      });
    }
  };

  const languages = [
    { id: "python", name: "Python" },
    { id: "javascript", name: "JavaScript" },
    { id: "java", name: "Java" },
    { id: "cpp", name: "C++" },
  ];

  const themes = [
    { id: "vs", name: "Light" },
    { id: "vs-dark", name: "Dark" },
  ];

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleRunCode = async () => {
    if (!editorRef.current) return;

    const code = editorRef.current.getValue();

    if (!code.trim()) {
      setOutput({
        success: false,
        message: "Please enter some code.",
        stdout: "",
        stderr: "",
      });
      return;
    }

    try {
      setIsRunning(true);
      setOutput(null);

      const response = await axios.post("/api/editor/execute", {
        code,
        language,
      });
      setOutput(response.data);
    } catch (error: any) {
      setOutput({
        success: false,
        message: "Failed to run code.",
        stdout: "",
        stderr: error.response?.data?.error || error.message,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!editorRef.current) return;

    const code = editorRef.current.getValue();

    if (!code.trim()) {
      setOutput({
        success: false,
        message: "Please enter some code.",
        stdout: "",
        stderr: "",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmissionResult(null);
      setOutput(null);
      const response = await axios.post("/api/assignments/submit", {
        code,
        assignmentId: window.location.pathname.split("/")[4],
        questionText: document.querySelector("[data-question-text]")
          ?.textContent,
        description: document.querySelector("[data-description]")?.textContent,
        rubrics: Array.from(
          document.querySelectorAll("[data-rubric-item]")
        ).map((el) => ({
          id: el.getAttribute("data-rubric-id"),
          title: el.querySelector("[data-rubric-title]")?.textContent,
          description: el.querySelector("[data-rubric-description]")
            ?.textContent,
          maxPoints: parseInt(el.getAttribute("data-rubric-points") || "0"),
        })),
        testCases: Array.from(
          document.querySelectorAll("[data-test-case]")
        ).map((el) => ({
          id: el.getAttribute("data-test-case-id"),
          input: el.querySelector("[data-test-input]")?.textContent,
          expectedOutput: el.querySelector("[data-test-output]")?.textContent,
          description: el.querySelector("[data-test-description]")?.textContent,
        })),
        timeSpent,
      });

      setSubmissionResult(response.data.data);
    } catch (error: any) {
      setOutput({
        success: false,
        message: "Failed to submit code.",
        stdout: "",
        stderr: error.response?.data?.error || error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderDockerStatus = () => {
    if (dockerStatus.checking) {
      return (
        <div className="flex items-center text-gray-500">
          <Loader />
          Checking Docker status...
        </div>
      );
    }

    if (!dockerStatus.docker?.running) {
      return (
        <div className="bg-red-100 text-red-700 p-2 rounded flex items-center">
          <Info />
          Docker is not running. Please start Docker Desktop.
        </div>
      );
    }

    if (!dockerStatus.container?.running) {
      return (
        <div className="flex items-center text-sm">
          <span className="bg-yellow-100 text-yellow-700 p-2 rounded flex items-center mr-2">
            <Warn />
            Executor container is not running
          </span>
          <Button
            onClick={startDockerContainer}
            className={`px-3 py-1 rounded text-white ${
              dockerStatus.starting
                ? "bg-gray-500"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {dockerStatus.starting ? "Starting..." : "Start Container"}
          </Button>
        </div>
      );
    }

    return (
      <div className="bg-green-100 text-green-700 p-2 rounded flex items-center">
        <Success />
        Code execution service is running
      </div>
    );
  };

  // Full screen loading overlay
  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Grading Your Submission</h2>
        <p className="text-gray-600">
          Please wait while we analyze your code...
        </p>
      </div>
    </div>
  );

  // Full screen result overlay
  const ResultOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Submission Results</h2>

        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-semibold text-blue-800">Final Score</h3>
            <p className="text-2xl font-bold text-blue-600">
              {submissionResult.gradingResult.finalGrade}%
            </p>
            <p className="text-blue-600">
              Tests Passed: {submissionResult.submission.testsPassed}/
              {submissionResult.submission.testsTotal}
            </p>
            <p className="text-blue-600">Time Spent: {formatTime(timeSpent)}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Test Results</h3>
            {submissionResult.gradingResult.testResults.map(
              (result: any, index: number) => (
                <div
                  key={index}
                  className={`p-3 rounded mb-2 ${
                    result.passed ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <p
                    className={`font-medium ${
                      result.passed ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {result.name}: {result.passed ? "Passed" : "Failed"}
                  </p>
                  <p className="text-sm">{result.message}</p>
                </div>
              )
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2">Rubric Evaluations</h3>
            {submissionResult.gradingResult.rubricEvaluations.map(
              (evaluation: any, index: number) => (
                <div key={index} className="border-b pb-3 mb-3">
                  <p className="font-medium">Points: {evaluation.points}</p>
                  <p className="text-sm text-gray-600">{evaluation.comment}</p>
                </div>
              )
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2">Feedback</h3>
            <p className="text-gray-700">
              {submissionResult.gradingResult.feedback}
            </p>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => router.push(`/courses/${courseId}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
            >
              Back to Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Timer Display */}
      {timeLimit && (
        <div className="bg-gray-800 text-white p-2 text-center">
          <span className="font-mono text-lg">
            Time Remaining: {formatTime(timeLeft)}
          </span>
        </div>
      )}

      {/* Editor Header */}
      <div className="flex justify-between items-center p-3 bg-gray-800 text-white">
        <div className="flex items-center space-x-3">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[120px] bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.id} value={lang.id}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="w-[100px] bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {themes.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-3">
          {/* {renderDockerStatus()} */}

          <Button
            onClick={handleRunCode}
            className={`text-sm bg-green-600 hover:bg-green-700`}
          >
            {isRunning ? "Running..." : "Run Code"}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`text-sm bg-blue-600 hover:bg-blue-700`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>

      {/* Editor and Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
        <div className="border rounded h-[600px]">
          <MonacoEditor
            height="100%"
            language={language}
            theme={theme}
            defaultValue={initialCode}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              fontSize: 14,
              tabSize: 2,
              padding: { top: 10 },
            }}
          />
        </div>

        <div className="border rounded p-4 bg-gray-50 overflow-auto h-[600px]">
          <Tabs defaultValue="output" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="output">Output</TabsTrigger>
            </TabsList>
            <TabsContent value="output">
              {output === null ? (
                <p className="text-gray-500">
                  Run your code to see the output here.
                </p>
              ) : (
                <div>
                  <div
                    className={`mb-4 p-2 rounded ${
                      output.success ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    <span
                      className={`font-bold ${
                        output.success ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {output.output}
                    </span>
                  </div>
                  {output.executionTime && (
                    <div className="mb-4">
                      <h3 className="font-medium mb-1">Execution Time:</h3>
                      <pre className="bg-white p-2 border rounded whitespace-pre-wrap">
                        {output.executionTime}s
                      </pre>
                    </div>
                  )}
                  {output.stderr && (
                    <div>
                      <h3 className="font-medium mb-1">Standard Error:</h3>
                      <pre className="bg-white p-2 border rounded text-red-600 whitespace-pre-wrap">
                        {output.stderr}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {submissionResult && (
                <div className="mt-4 space-y-4">
                  <div className="bg-blue-50 p-4 rounded">
                    <h3 className="font-semibold text-blue-800">
                      Submission Results
                    </h3>
                    <p className="text-blue-600">
                      Final Grade: {submissionResult.gradingResult.finalGrade}
                    </p>
                    <p className="text-blue-600">
                      Tests Passed: {submissionResult.submission.testsPassed}/
                      {submissionResult.submission.testsTotal}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Test Results</h3>
                    {submissionResult.gradingResult.testResults.map(
                      (result: any, index: number) => (
                        <div
                          key={index}
                          className={`p-2 rounded mb-2 ${
                            result.passed ? "bg-green-50" : "bg-red-50"
                          }`}
                        >
                          <p
                            className={`font-medium ${
                              result.passed ? "text-green-800" : "text-red-800"
                            }`}
                          >
                            {result.name}: {result.passed ? "Passed" : "Failed"}
                          </p>
                          <p className="text-sm">{result.message}</p>
                        </div>
                      )
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Rubric Evaluations</h3>
                    {submissionResult.gradingResult.rubricEvaluations.map(
                      (evaluation: any, index: number) => (
                        <div key={index} className="border-b pb-2 mb-2">
                          <p className="font-medium">
                            Points: {evaluation.points}
                          </p>
                          <p className="text-sm text-gray-600">
                            {evaluation.comment}
                          </p>
                        </div>
                      )
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">General Feedback</h3>
                    <p className="text-gray-700">
                      {submissionResult.gradingResult.generalFeedback}
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Overlays */}
      {isSubmitting && <LoadingOverlay />}
      {submissionResult && <ResultOverlay />}
    </div>
  );
};

export default CodeEditor;
