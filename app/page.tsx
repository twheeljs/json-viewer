"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import { JsonEditor } from "@/components/json-editor";
import { JsonViewer } from "@/components/json-viewer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { saveAs } from "file-saver";
import { compress, decompress } from "@/lib/share";
import { jsonToXml, jsonToString } from "@/lib/converter";
import { 
  FileJson, 
  Copy, 
  Download, 
  Trash2, 
  Share2,
} from "lucide-react";
import { useTheme } from "next-themes";

// Dynamically import Monaco Editor and React JSON View to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });
const ReactJson = dynamic(() => import("react-json-view"), { ssr: false });

/**
 * Main Application Component
 * Handles the logic for JSON input, parsing, validation, conversion, and display.
 */
function JsonViewerApp() {
  // State for raw string input
  const [input, setInput] = useState<string>("");
  // State for parsed JSON object
  const [parsed, setParsed] = useState<object | null>(null);
  // State for validation error message
  const [error, setError] = useState<string | null>(null);
  // State for current view mode (Tree View, XML, or String)
  const [mode, setMode] = useState<"tree" | "xml" | "string">("tree");
  // State for converted output (XML or String)
  const [converted, setConverted] = useState<string>("");
  
  const { theme, setTheme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Effect to load data from URL (shared link) or Local Storage on mount
  useEffect(() => {
    // 1. Check for shared data in URL query parameters
    const sharedData = searchParams.get("data");
    if (sharedData) {
      try {
        const decompressed = decompress(sharedData);
        if (decompressed) {
          setInput(decompressed);
          validateAndParse(decompressed);
          toast.success("Loaded shared JSON");
          return;
        }
      } catch (e) {
        console.error("Failed to decompress shared data", e);
      }
    }

    // 2. Fallback: Load from local storage if no shared data found
    const saved = localStorage.getItem("json-input");
    if (saved) {
      setInput(saved);
      validateAndParse(saved);
    }
  }, [searchParams]);

  /**
   * Validates and parses the JSON input string.
   * Updates state variables and local storage accordingly.
   */
  const validateAndParse = (value: string) => {
    try {
      if (!value.trim()) {
        setParsed(null);
        setError(null);
        return;
      }
      const json = JSON.parse(value);
      setParsed(json);
      setError(null);
      // Persist valid input to local storage
      localStorage.setItem("json-input", value);
    } catch (e: any) {
      setError(e.message);
      setParsed(null);
    }
  };

  // Handler for input changes in the editor
  const handleInputChange = (value: string | undefined) => {
    const val = value || "";
    setInput(val);
    validateAndParse(val);
  };

  // Format JSON with 2-space indentation
  const formatJson = () => {
    if (!parsed) return;
    const formatted = JSON.stringify(parsed, null, 2);
    setInput(formatted);
    toast.success("Formatted JSON");
  };

  // Minify JSON (remove whitespace)
  const minifyJson = () => {
    if (!parsed) return;
    const minified = JSON.stringify(parsed);
    setInput(minified);
    toast.success("Minified JSON");
  };

  // Convert current JSON to XML format
  const convertToXml = () => {
    if (!parsed) return;
    try {
      const xml = jsonToXml(parsed);
      setConverted(xml);
      setMode("xml");
      toast.success("Converted to XML");
    } catch (e) {
      toast.error("XML Conversion failed");
    }
  };

  // Convert current JSON to Escaped String format
  const convertToString = () => {
    if (!parsed) return;
    try {
      const str = jsonToString(parsed);
      setConverted(str);
      setMode("string");
      toast.success("Converted to String");
    } catch (e) {
      toast.error("String Conversion failed");
    }
  };

  // Copy text content to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  // Download content as a file
  const downloadFile = (content: string, ext: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `data.${ext}`);
  };

  // Clear all data (input, parsed, storage, URL params)
  const clearAll = () => {
    setInput("");
    setParsed(null);
    setError(null);
    setConverted("");
    localStorage.removeItem("json-input");
    // Clear URL param
    router.replace("/");
    toast.success("Cleared");
  };

  // Generate a shareable link with compressed data
  const shareJson = () => {
    if (!input) return;
    try {
      const compressed = compress(input);
      const url = new URL(window.location.href);
      url.searchParams.set("data", compressed);
      navigator.clipboard.writeText(url.toString());
      toast.success("Share link copied to clipboard!");
    } catch (e) {
      toast.error("Failed to generate share link");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Header Section */}
      <header className="flex items-center justify-between px-6 py-3 border-b">
        <div className="flex items-center gap-2">
          <FileJson className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold">Modern JSON Viewer</h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? "🌞" : "🌛"}
          </Button>
          {/* Share Button */}
          <Button variant="outline" size="sm" onClick={shareJson}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          {/* GitHub Link */}
          {/* <Button variant="outline" onClick={() => window.open("https://github.com/your-repo", "_blank")}>
            GitHub
          </Button> */}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Pane: Input Editor */}
        <div className="flex-1 flex flex-col border-r w-1/2">
          <div className="p-2 border-b flex items-center justify-between bg-muted/20">
            <span className="text-sm font-medium">JSON Input</span>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={formatJson} title="Format">Format</Button>
              <Button size="sm" variant="ghost" onClick={minifyJson} title="Minify">Minify</Button>
              <Button size="sm" variant="ghost" onClick={clearAll} title="Clear">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 relative">
            <JsonEditor value={input} onChange={handleInputChange} />
            {/* Error Message Display */}
            {error && (
              <div className="absolute bottom-0 left-0 right-0 bg-red-500/10 text-red-500 p-2 text-xs border-t border-red-500/20">
                Error: {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Output Viewer */}
        <div className="flex-1 flex flex-col w-1/2">
          <div className="p-2 border-b flex items-center justify-between bg-muted/20">
            {/* View Mode Switcher */}
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant={mode === "tree" ? "secondary" : "ghost"} 
                onClick={() => setMode("tree")}
              >
                Tree View
              </Button>
              <Button 
                size="sm" 
                variant={mode === "xml" ? "secondary" : "ghost"} 
                onClick={convertToXml}
              >
                XML
              </Button>
              <Button 
                size="sm" 
                variant={mode === "string" ? "secondary" : "ghost"} 
                onClick={convertToString}
              >
                String
              </Button>
            </div>
            {/* Action Buttons (Copy/Download) */}
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => copyToClipboard(mode === "tree" ? JSON.stringify(parsed, null, 2) : converted)}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => downloadFile(mode === "tree" ? JSON.stringify(parsed, null, 2) : converted, mode === "tree" ? "json" : mode)}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="flex-1 overflow-auto bg-muted/10 relative">
            {mode === "tree" ? (
              parsed ? (
                <div className="h-full">
                  <JsonViewer src={parsed} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Valid JSON will appear here
                </div>
              )
            ) : (
              <pre className="p-4 text-sm font-mono whitespace-pre-wrap h-full overflow-auto">
                {converted}
              </pre>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JsonViewerApp />
    </Suspense>
  );
}
