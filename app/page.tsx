"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, Zap, ChevronRight, Github, X } from "lucide-react";
import ResultsPanel from "@/components/ResultsPanel";
import DropZone from "@/components/DropZone";
import ScoreRing from "@/components/ScoreRing";
import type { AnalysisResult } from "@/lib/types";

export default function Home() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!resumeFile || !jobDescription.trim()) {
      setError("Please upload your resume and paste a job description.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jobDescription", jobDescription);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Analysis failed. Please try again.");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [resumeFile, jobDescription]);

  const reset = () => {
    setResumeFile(null);
    setJobDescription("");
    setResult(null);
    setError(null);
  };

  return (
    <main className="relative min-h-screen z-10">
      {/* Background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-brand-accent/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-brand-green/3 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-brand-border/50 backdrop-blur-sm sticky top-0 z-50 bg-brand-bg/80">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center">
              <Zap size={14} className="text-brand-accent" />
            </div>
            <span className="font-display font-700 text-lg text-brand-text tracking-tight">
              ResumeAI
            </span>
          </div>
          <a
            href="https://github.com/P1Piyush/ai-resume-analyzer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-brand-muted hover:text-brand-text transition-colors text-sm font-mono"
          >
            <Github size={15} />
            <span className="hidden sm:inline">View on GitHub</span>
          </a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {!result ? (
          <>
            {/* Hero */}
            <div className="text-center mb-16 animate-fade-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-accent/20 bg-brand-accent/5 text-brand-accent text-xs font-mono mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse-slow" />
                Powered by Groq · Llama 3.3 70B
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-800 text-brand-text leading-[0.95] tracking-tight mb-6">
                Beat the
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-green">
                  ATS Filter.
                </span>
              </h1>
              <p className="text-brand-muted text-lg max-w-xl mx-auto leading-relaxed">
                Upload your resume, paste a job description, and get your ATS
                match score, keyword gaps, rewrite suggestions, and a tailored
                cover letter — in seconds.
              </p>
            </div>

            {/* Input Section */}
            <div
              className="grid md:grid-cols-2 gap-6 mb-8"
              style={{ animationDelay: "0.1s" }}
            >
              {/* Resume Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-display font-600 text-brand-text tracking-wide uppercase text-xs">
                  Your Resume
                </label>
                {resumeFile ? (
                  <div className="relative flex items-center gap-3 p-4 rounded-xl border border-brand-green/30 bg-brand-green/5">
                    <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center flex-shrink-0">
                      <FileText size={18} className="text-brand-green" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-brand-text font-500 text-sm truncate">
                        {resumeFile.name}
                      </p>
                      <p className="text-brand-muted text-xs mt-0.5">
                        {(resumeFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => setResumeFile(null)}
                      className="p-1.5 rounded-lg hover:bg-brand-border transition-colors"
                    >
                      <X size={14} className="text-brand-muted" />
                    </button>
                  </div>
                ) : (
                  <DropZone onFile={setResumeFile} />
                )}
              </div>

              {/* Job Description */}
              <div className="space-y-3">
                <label className="block text-sm font-display font-600 text-brand-text tracking-wide uppercase text-xs">
                  Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here — include requirements, responsibilities, and any keywords you see..."
                  className="w-full h-[180px] p-4 rounded-xl border border-brand-border bg-brand-surface text-brand-text placeholder-brand-muted text-sm resize-none focus:outline-none focus:border-brand-accent/60 transition-colors font-body leading-relaxed"
                />
                <p className="text-brand-muted text-xs">
                  {jobDescription.length} characters
                  {jobDescription.length > 0 &&
                    jobDescription.length < 200 && (
                      <span className="text-brand-yellow ml-2">
                        — Add more context for better results
                      </span>
                    )}
                </p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 rounded-xl border border-brand-red/20 bg-brand-red/5 text-brand-red text-sm flex items-center gap-2">
                <X size={14} />
                {error}
              </div>
            )}

            {/* Analyze Button */}
            <div className="flex justify-center">
              <button
                onClick={handleAnalyze}
                disabled={loading || !resumeFile || !jobDescription.trim()}
                className="group relative flex items-center gap-3 px-8 py-4 rounded-xl bg-brand-accent hover:bg-brand-accentHover disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 font-display font-600 text-white text-base shadow-[0_0_30px_rgba(108,99,255,0.3)] hover:shadow-[0_0_40px_rgba(108,99,255,0.5)]"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing your resume...
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    Analyze Resume
                    <ChevronRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="mt-8 p-6 rounded-xl border border-brand-border bg-brand-surface">
                <div className="flex flex-col gap-3">
                  {[
                    "Parsing resume content...",
                    "Extracting job requirements...",
                    "Calculating ATS match score...",
                    "Generating keyword gap analysis...",
                    "Writing cover letter...",
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse-slow"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                      <span className="text-brand-muted text-sm font-mono">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features row */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "ATS Score", desc: "0–100 match rating" },
                { label: "Keyword Gaps", desc: "Missing must-haves" },
                { label: "Rewrites", desc: "Bullet-by-bullet fixes" },
                { label: "Cover Letter", desc: "Tailored in seconds" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="p-4 rounded-xl border border-brand-border bg-brand-surface/50"
                >
                  <p className="font-display font-600 text-brand-text text-sm mb-1">
                    {f.label}
                  </p>
                  <p className="text-brand-muted text-xs">{f.desc}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <ResultsPanel result={result} onReset={reset} />
        )}
      </div>
    </main>
  );
}
