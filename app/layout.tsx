import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HackDSA — DSA Visualizer",
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
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: `
          (() => {
            try {
              const theme = localStorage.getItem('theme');
              if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              } else if (theme === 'light') {
                document.documentElement.classList.remove('dark');
              } else {
                document.documentElement.classList.add('dark');
              }
            } catch {}
          })();
        `}} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
