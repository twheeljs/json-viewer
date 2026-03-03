"use strict";

import React from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { useTheme } from "next-themes";

interface JsonEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
}

/**
 * JsonEditor Component
 * Wrapper around Monaco Editor configured for JSON editing.
 * Supports theme switching and basic validation configuration.
 */
export function JsonEditor({ value, onChange }: JsonEditorProps) {
  const { resolvedTheme } = useTheme();

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // Configure JSON language defaults
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      allowComments: false,
      schemas: [],
      enableSchemaRequest: false,
    });
  };

  return (
    <div className="h-full w-full border rounded-md overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage="json"
        value={value}
        onChange={onChange}
        // Map next-themes to Monaco themes
        theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
          formatOnPaste: true,
          automaticLayout: true,
        }}
        onMount={handleEditorDidMount}
      />
    </div>
  );
}
