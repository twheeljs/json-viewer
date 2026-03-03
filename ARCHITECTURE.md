# Project Architecture: Modern JSON Viewer

## 1. Overview
**Modern JSON Viewer** is a web-based tool built with Next.js 14 for visualizing, validating, formatting, and converting JSON data. It features a dual-pane interface with a code editor for input and a tree view/text view for output.

## 2. Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: 
  - [Lucide React](https://lucide.dev/) (Icons)
  - Custom Button component (shadcn/ui inspired)
  - [Sonner](https://sonner.emilkowal.ski/) (Toast notifications)
- **Core Libraries**:
  - `@monaco-editor/react`: For the JSON input editor with validation.
  - `react-json-view`: For the interactive tree view visualization.
  - `fast-xml-parser`: For JSON to XML conversion.
  - `lz-string`: For compressing JSON data into shareable URLs.
  - `next-themes`: For Dark/Light mode support.
- **Testing**:
  - `Jest` + `React Testing Library`: Unit testing.
  - `Playwright`: End-to-End (E2E) testing.
- **Deployment**: [Vercel](https://vercel.com/) (Analytics & Speed Insights enabled).

## 3. Directory Structure

```
├── app/
│   ├── layout.tsx       # Root layout with ThemeProvider and Analytics
│   ├── page.tsx         # Main application logic (Client Component)
│   └── globals.css      # Global styles and Tailwind directives
├── components/
│   ├── ui/              # Reusable UI components (e.g., Button)
│   ├── json-editor.tsx  # Monaco Editor wrapper component
│   ├── json-viewer.tsx  # React JSON View wrapper component
│   └── theme-provider.tsx # Next-themes provider wrapper
├── lib/
│   ├── converter.ts     # Utilities for data conversion (XML, String)
│   ├── share.ts         # Utilities for URL data compression/decompression
│   └── utils.ts         # Class name merging utility (cn)
├── __tests__/           # Unit tests
├── e2e/                 # Playwright E2E tests
└── public/              # Static assets and Manifest file
```

## 4. Key Components

### 4.1. Main Page (`app/page.tsx`)
The `JsonViewerApp` component acts as the controller. It manages the global state:
- `input`: The raw string from the editor.
- `parsed`: The parsed JSON object (or null if invalid).
- `mode`: The current output mode (`tree`, `xml`, or `string`).
- `error`: Validation error messages.

**Key Workflows:**
- **Input Handling**: On every keystroke, the input is parsed. If valid, `parsed` state is updated and saved to `localStorage`.
- **Initialization**: On load, it checks for `?data=` in the URL (shared content) or falls back to `localStorage`.

### 4.2. JSON Editor (`components/json-editor.tsx`)
Wraps the Monaco Editor.
- Configures JSON schema validation settings.
- Adapts the editor theme (`vs-dark` vs `light`) based on the application's current theme.

### 4.3. JSON Viewer (`components/json-viewer.tsx`)
Wraps `react-json-view`.
- Displays the `parsed` object as an interactive tree.
- Supports expanding/collapsing nodes and copying values.

## 5. Feature Implementation Details

### 5.1. Data Persistence & Sharing
- **Local Storage**: The valid JSON input is automatically saved to `localStorage` under the key `json-input`.
- **URL Sharing**:
  - **Compress**: The `shareJson` function uses `lz-string` to compress the input string into a URL-safe Base64 string.
  - **Decompress**: On page load, if the `data` query param exists, it decompresses it and populates the editor.

### 5.2. Data Conversion
- **XML**: Uses `fast-xml-parser`'s `XMLBuilder` to transform the JSON object into an XML string.
- **Escaped String**: Double-stringifies the JSON object (`JSON.stringify(JSON.stringify(obj))`) to create an escaped string representation useful for coding.

### 5.3. Performance Optimization
- **Dynamic Imports**: Both `MonacoEditor` and `ReactJson` are imported dynamically with `ssr: false`. This prevents server-side rendering errors (since these libraries rely on `window`) and reduces the initial bundle size.
- **Debounced Validation**: (Implicitly handled by React state updates, could be optimized further for very large inputs).

## 6. Testing Strategy

### 6.1. Unit Tests (`__tests__/`)
- **`converter.test.ts`**: Verifies that JSON objects are correctly converted to XML and Escaped Strings.
- **`share.test.ts`**: Verifies that data can be compressed and decompressed losslessly.

### 6.2. E2E Tests (`e2e/`)
- **`home.spec.ts`**: Uses Playwright to load the page, verify the title, and check for the presence of key UI elements (buttons, headers).

## 7. Deployment & DevOps
- **CI/CD**: Configured for Vercel. Pushing to `main` triggers a build.
- **PWA**: `manifest.json` and viewport metadata are configured to allow the app to be installed on mobile devices.
- **Monitoring**: Vercel Analytics and Speed Insights are integrated in `layout.tsx` for real-time performance monitoring.
