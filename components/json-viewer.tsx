"use strict";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import React from "react";

// Dynamically import react-json-view to avoid SSR issues
const ReactJson = dynamic(() => import("react-json-view"), { ssr: false });

interface JsonViewerProps {
  src: object;
  collapsed?: boolean | number;
}

/**
 * JsonViewer Component
 * Renders a collapsible tree view of the JSON data.
 * Adapts to the current application theme.
 */
export function JsonViewer({ src, collapsed = false }: JsonViewerProps) {
  const { resolvedTheme } = useTheme();

  return (
    <div className="h-full w-full overflow-auto p-4 bg-white dark:bg-[#1e1e1e] border rounded-md text-sm">
      <ReactJson
        src={src}
        // Choose theme based on current mode
        theme={resolvedTheme === "dark" ? "monokai" : "rjv-default"}
        collapsed={collapsed}
        displayDataTypes={false}
        enableClipboard={true}
        displayObjectSize={true}
        indentWidth={2}
        style={{ backgroundColor: "transparent" }}
      />
    </div>
  );
}
