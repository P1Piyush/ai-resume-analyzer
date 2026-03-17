import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Resume Analyzer — ATS Score & Gap Analysis",
  description:
    "Upload your resume and a job description. Get your ATS match score, missing keywords, rewrite suggestions, and a tailored cover letter — powered by AI.",
  keywords: [
    "ATS resume checker",
    "resume analyzer",
    "AI resume",
    "job description match",
    "cover letter generator",
  ],
  openGraph: {
    title: "AI Resume Analyzer",
    description: "Get your ATS score and keyword gap analysis in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-brand-bg text-brand-text antialiased">
        {children}
      </body>
    </html>
  );
}
