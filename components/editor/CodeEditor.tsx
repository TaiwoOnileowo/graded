// src/components/CodeEditor.tsx

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { Editor } from '@monaco-editor/react';

// Import Monaco Editor dynamically (client-side only)
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  { ssr: false }
);

// Define types for the code execution response
interface ExecutionResult {
  success: boolean;
  output: string | null;
  error: string | null;
  executionTime: number | string;
}

// Define output state interface
interface OutputState {
  success: boolean;
  message: string;
  stdout?: string;
  stderr?: string;
  executionTime?: number | string;
}

// Define language option interface
interface LanguageOption {
  id: string;
  name: string;
}

// Define theme option interface
interface ThemeOption {
  id: string;
  name: string;
}

const CodeEditor: React.FC = () => {
  const [language, setLanguage] = useState<string>('c');
  const [theme, setTheme] = useState<string>('vs-dark');
  const [output, setOutput] = useState<OutputState | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const editorRef = useRef<any>(null);

  // Languages supported by the editor
  const languages: LanguageOption[] = [
    { id: 'c', name: 'C' },
    { id: 'cpp', name: 'C++' },
    { id: 'python', name: 'Python' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'java', name: 'Java' },
  ];

  // Themes available for the editor
  const themes: ThemeOption[] = [
    { id: 'vs', name: 'Light' },
    { id: 'vs-dark', name: 'Dark' },
  ];

  // Store a reference to the editor instance
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  // Execute the code
  const handleRunCode = async (): Promise<void> => {
    if (!editorRef.current) return;
    
    const code = editorRef.current.getValue();
    
    if (!code.trim()) {
      setOutput({
        success: false,
        message: 'Please enter some code.',
      });
      return;
    }
    
    try {
      setIsRunning(true);
      setOutput(null);
      
      const response = await axios.post<ExecutionResult>('/api/execute', {
        code,
        language,
      });
      
      const result = response.data;
      
      setOutput({
        success: result.success,
        message: result.success ? 'Code executed successfully!' : 'Execution failed.',
        stdout: result.output || undefined,
        stderr: result.error || undefined,
        executionTime: result.executionTime
      });
    } catch (error: any) {
      console.error('Error running code:', error);
      
      setOutput({
        success: false,
        message: 'Failed to run code.',
        stderr: error.response?.data?.error || error.message,
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Get default code for selected language
  const getDefaultCode = (lang: string): string => {
    switch (lang) {
      case 'c':
        return `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`;
      case 'cpp':
        return `#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}`;
      case 'python':
        return `print("Hello, World!")`;
      case 'javascript':
        return `console.log("Hello, World!");`;
      case 'java':
        return `public class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`;
      default:
        return '';
    }
  };

  // Handle language change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    
    // Update editor content with default code for the selected language
    if (editorRef.current) {
      editorRef.current.setValue(getDefaultCode(newLanguage));
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-between items-center p-4 bg-gray-100 border-b">
        <div className="flex items-center space-x-4">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="p-2 border rounded"
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
          
          <select
            value={theme}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTheme(e.target.value)}
            className="p-2 border rounded"
          >
            {themes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        
        <button
          onClick={handleRunCode}
          disabled={isRunning}
          className={`px-4 py-2 rounded text-white ${
            isRunning ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
        <div className="border rounded h-full min-h-[400px]">
          <MonacoEditor
            height="100%"
            language={language}
            theme={theme}
            defaultValue={getDefaultCode(language)}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              fontSize: 14,
              tabSize: 2,
            }}
          />
        </div>
        
        <div className="border rounded p-4 bg-gray-50 overflow-auto h-full min-h-[400px]">
          <h2 className="text-lg font-semibold mb-2">Output</h2>
          
          {output === null ? (
            <p className="text-gray-500">Run your code to see the output here.</p>
          ) : (
            <div>
              <div className={`mb-4 p-2 rounded ${
                output.success ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <span className={`font-bold ${
                  output.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {output.message}
                </span>
                {output.executionTime && (
                  <span className="ml-2 text-gray-600">
                    (Execution time: {output.executionTime}ms)
                  </span>
                )}
              </div>
              
              {output.stdout && (
                <div className="mb-4">
                  <h3 className="font-medium mb-1">Standard Output:</h3>
                  <pre className="bg-white p-2 border rounded whitespace-pre-wrap">{output.stdout}</pre>
                </div>
              )}
              
              {output.stderr && (
                <div>
                  <h3 className="font-medium mb-1">Standard Error:</h3>
                  <pre className="bg-white p-2 border rounded text-red-600 whitespace-pre-wrap">{output.stderr}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;