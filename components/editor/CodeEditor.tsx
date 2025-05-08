// @ts-nocheck
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

// Import Monaco Editor dynamically (client-side only)
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

interface CodeEditorProps {
  initialCode: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialCode }) => {
  const [language, setLanguage] = useState("ruby");
  const [theme, setTheme] = useState("vs-dark");
  const [output, setOutput] = useState<{
    success: boolean;
    message: string;
    stdout: string;
    stderr: string;
  } | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [dockerStatus, setDockerStatus] = useState({ checking: true });
  const editorRef = useRef<any>(null);

  useEffect(() => {
    checkDockerStatus();
  }, []);

  const checkDockerStatus = async () => {
    try {
      setDockerStatus({ checking: true });
      const response = await axios.get("/api/docker/status");
      setDockerStatus({
        checking: false,
        docker: response.data.docker,
        container: response.data.container,
      });
    } catch (error) {
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
    } catch (error) {
      setDockerStatus({
        ...dockerStatus,
        starting: false,
        error:
          error.response?.data?.error || "Failed to start Docker container",
      });
    }
  };

  const languages = [
    { id: "ruby", name: "Ruby" },
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

    // if (!dockerStatus.docker?.running || !dockerStatus.container?.running) {
    //   setOutput({
    //     success: false,
    //     output: "Code execution service is not available",
    //     stdout: "",
    //     stderr: "Please start the Docker container to run code.",
    //   });
    //   return;
    // }

    const code = editorRef.current.getValue();

    if (!code.trim()) {
      setOutput({
        success: false,
        output: "Please enter some code.",
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
    } catch (error) {
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
            // disabled={dockerStatus.starting}
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

  return (
    <div className="flex flex-col h-full">
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
          {renderDockerStatus()}
          <Button
            onClick={handleRunCode}
            // disabled={
            //   isRunning ||
            //   !dockerStatus.docker?.running ||
            //   !dockerStatus.container?.running
            // }
            className={`text-sm ${
              isRunning ||
              !dockerStatus.docker?.running ||
              !dockerStatus.container?.running
                ? "bg-gray-500"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isRunning ? "Running..." : "Run Code"}
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
