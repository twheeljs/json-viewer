import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://json-viewer-online.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Modern JSON Viewer - Validate, Format & Convert JSON",
    template: "%s | Modern JSON Viewer",
  },
  description: "A powerful online JSON viewer, validator, and converter. Format JSON, convert to XML/CSV, and share data securely. Built with Next.js for speed and performance.",
  keywords: [
    "json viewer",
    "json formatter",
    "json validator",
    "json editor",
    "json to xml",
    "json to csv",
    "json beautifier",
    "online json tool",
    "developer tools",
  ],
  authors: [{ name: "niexia", url: "https://github.com/niexia" }],
  creator: "niexia",
  publisher: "niexia",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Modern JSON Viewer - The Best Online JSON Tool",
    description: "Visualize, validate, and convert your JSON data instantly. Features include tree view, XML/CSV conversion, and secure sharing.",
    url: APP_URL,
    siteName: "Modern JSON Viewer",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png", // Ensure you have this image in public folder
        width: 1200,
        height: 630,
        alt: "Modern JSON Viewer Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Modern JSON Viewer",
    description: "The ultimate JSON tool for developers. Validate, format, and convert JSON with ease.",
    images: ["/og-image.png"],
    creator: "@yourhandle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: APP_URL,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
