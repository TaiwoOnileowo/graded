"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";

// Import Monaco Editor dynamically (client-side only)
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

interface CodeEditorProps {
  defaultValue: string;
  language?: string;
  readOnly?: boolean;
}

export default function CodeEditor({
  defaultValue,
  language = "c",
  readOnly = false,
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);

  // Store a reference to the editor instance
  const handleEditorDidMount = (editor: any): void => {
    editorRef.current = editor;
  };

  return (
    <div className="h-full w-full">
      <MonacoEditor
        height="100%"
        language={language}
        theme="vs-dark"
        defaultValue={defaultValue}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          fontSize: 14,
          tabSize: 2,
          lineNumbers: "on",
          readOnly: readOnly,
          renderLineHighlight: "all",
          scrollbar: {
            vertical: "visible",
            horizontal: "visible",
          },
        }}
      />
    </div>
  );
}
