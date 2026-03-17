"use client";

import { useState } from "react";
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Copy,
  Check,
  TrendingUp,
  FileText,
} from "lucide-react";
import ScoreRing from "./ScoreRing";
import type { AnalysisResult } from "@/lib/types";

interface ResultsPanelProps {
  result: AnalysisResult;
  onReset: () => void;
}

type Tab = "overview" | "keywords" | "rewrites" | "cover";

export default function ResultsPanel({ result, onReset }: ResultsPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [copied, setCopied] = useState(false);

  const copyCoverLetter = async () => {
    await navigator.clipboard.writeText(result.coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "keywords", label: "Keywords" },
    { key: "rewrites", label: "Rewrites" },
    { key: "cover", label: "Cover Letter" },
  ];

  const importanceColor = (imp: string) => {
    if (imp === "critical") return "text-brand-red";
    if (imp === "important") return "text-brand-yellow";
    return "text-brand-muted";
  };

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="font-display text-3xl font-700 text-brand-text">
            Analysis Complete
          </h2>
          <p className="text-brand-muted text-sm mt-1">
            Here&apos;s a full breakdown of your resume vs. the job description.
          </p>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-brand-border hover:border-brand-accent/40 text-brand-muted hover:text-brand-text transition-all text-sm"
        >
          <RotateCcw size={14} />
          Analyze another
        </button>
      </div>

      {/* Score + Breakdown */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Score Ring */}
        <div className="md:col-span-1 p-6 rounded-xl border border-brand-border bg-brand-surface flex flex-col items-center gap-4">
          <p className="font-display font-600 text-xs uppercase tracking-widest text-brand-muted">
            ATS Match Score
          </p>
          <ScoreRing score={result.atsScore} />
        </div>

        {/* Score Breakdown */}
        <div className="md:col-span-2 p-6 rounded-xl border border-brand-border bg-brand-surface">
          <p className="font-display font-600 text-xs uppercase tracking-widest text-brand-muted mb-5">
            Score Breakdown
          </p>
          <div className="space-y-4">
            {Object.entries(result.scoreBreakdown).map(([key, val]) => {
              const label = key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (s) => s.toUpperCase());
              const color =
                val >= 75
                  ? "bg-brand-green"
                  : val >= 50
                  ? "bg-brand-yellow"
                  : "bg-brand-red";
              return (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-brand-text text-sm font-500">
                      {label}
                    </span>
                    <span className="font-mono text-sm text-brand-muted">
                      {val}/100
                    </span>
                  </div>
                  <div className="h-1.5 bg-brand-border rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color} rounded-full transition-all duration-1000`}
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-brand-surface rounded-xl border border-brand-border w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-display font-600 transition-all ${
              activeTab === tab.key
                ? "bg-brand-accent text-white"
                : "text-brand-muted hover:text-brand-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="space-y-4">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="p-5 rounded-xl border border-brand-border bg-brand-surface">
              <p className="text-xs font-mono text-brand-muted mb-3 uppercase tracking-widest">
                Summary
              </p>
              <p className="text-brand-text leading-relaxed">{result.summary}</p>
            </div>

            {/* Strengths + Issues */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-brand-green/20 bg-brand-green/3">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={14} className="text-brand-green" />
                  <p className="text-xs font-mono text-brand-green uppercase tracking-widest">
                    Top Strengths
                  </p>
                </div>
                <ul className="space-y-2">
                  {result.topStrengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2
                        size={14}
                        className="text-brand-green mt-0.5 flex-shrink-0"
                      />
                      <span className="text-brand-text text-sm">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-xl border border-brand-red/20 bg-brand-red/3">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle size={14} className="text-brand-red" />
                  <p className="text-xs font-mono text-brand-red uppercase tracking-widest">
                    Critical Issues
                  </p>
                </div>
                <ul className="space-y-2">
                  {result.criticalIssues.map((issue, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <XCircle
                        size={14}
                        className="text-brand-red mt-0.5 flex-shrink-0"
                      />
                      <span className="text-brand-text text-sm">{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* KEYWORDS TAB */}
        {activeTab === "keywords" && (
          <div className="space-y-4">
            {/* Missing Keywords */}
            <div className="p-5 rounded-xl border border-brand-border bg-brand-surface">
              <p className="text-xs font-mono text-brand-red uppercase tracking-widest mb-4">
                Missing Keywords ({result.keywordAnalysis.missing.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {result.keywordAnalysis.missing.map((kw, i) => (
                  <span
                    key={i}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border font-mono ${
                      kw.importance === "critical"
                        ? "border-brand-red/30 bg-brand-red/5 text-brand-red"
                        : kw.importance === "important"
                        ? "border-brand-yellow/30 bg-brand-yellow/5 text-brand-yellow"
                        : "border-brand-border bg-brand-bg text-brand-muted"
                    }`}
                  >
                    <XCircle size={10} />
                    {kw.keyword}
                    <span className="opacity-60 text-[10px]">
                      {kw.importance === "critical"
                        ? "⚠"
                        : kw.importance === "important"
                        ? "!"
                        : ""}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* Matched Keywords */}
            <div className="p-5 rounded-xl border border-brand-border bg-brand-surface">
              <p className="text-xs font-mono text-brand-green uppercase tracking-widest mb-4">
                Matched Keywords ({result.keywordAnalysis.matched.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {result.keywordAnalysis.matched.map((kw, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-brand-green/20 bg-brand-green/5 text-brand-green font-mono"
                  >
                    <CheckCircle2 size={10} />
                    {kw.keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* REWRITES TAB */}
        {activeTab === "rewrites" && (
          <div className="space-y-4">
            {result.bulletRewrites.map((rewrite, i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-brand-border bg-brand-surface"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-mono text-brand-red uppercase tracking-widest mb-2">
                      Before
                    </p>
                    <p className="text-brand-muted text-sm leading-relaxed line-through decoration-brand-red/40">
                      {rewrite.original}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-brand-green uppercase tracking-widest mb-2">
                      After
                    </p>
                    <p className="text-brand-text text-sm leading-relaxed">
                      {rewrite.improved}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-brand-border flex items-start gap-2">
                  <ArrowRight size={12} className="text-brand-accent mt-0.5" />
                  <p className="text-brand-muted text-xs">{rewrite.reason}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* COVER LETTER TAB */}
        {activeTab === "cover" && (
          <div className="p-6 rounded-xl border border-brand-border bg-brand-surface">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-brand-accent" />
                <p className="text-xs font-mono text-brand-accent uppercase tracking-widest">
                  Tailored Cover Letter
                </p>
              </div>
              <button
                onClick={copyCoverLetter}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-brand-border hover:border-brand-accent/40 text-brand-muted hover:text-brand-text text-xs transition-all"
              >
                {copied ? (
                  <>
                    <Check size={12} className="text-brand-green" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="prose max-w-none">
              {result.coverLetter.split("\n\n").map((para, i) => (
                <p
                  key={i}
                  className="text-brand-text leading-relaxed text-sm mb-4 last:mb-0"
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
