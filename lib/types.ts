export interface KeywordMatch {
  keyword: string;
  found: boolean;
  importance: "critical" | "important" | "nice-to-have";
}

export interface BulletRewrite {
  original: string;
  improved: string;
  reason: string;
}

export interface AnalysisResult {
  atsScore: number; // 0-100
  scoreBreakdown: {
    keywordMatch: number;
    formatting: number;
    experience: number;
    skills: number;
  };
  summary: string;
  keywordAnalysis: {
    matched: KeywordMatch[];
    missing: KeywordMatch[];
  };
  bulletRewrites: BulletRewrite[];
  coverLetter: string;
  topStrengths: string[];
  criticalIssues: string[];
}
