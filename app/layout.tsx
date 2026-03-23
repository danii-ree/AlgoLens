import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlgoLens — DSA Visualizer",
  description: "Interactive Data Structures & Algorithms visualizer for university students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Syne:wght@400..800&family=DM+Sans:ital,opsz,wght@0,9..40,100..900;1,9..40,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
