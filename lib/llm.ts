import Groq from "groq-sdk";

// Lazy — instantiated only at call time so builds pass without env vars set
function getGroqClient() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

export async function callLLM(prompt: string): Promise<string> {
  const provider = process.env.LLM_PROVIDER || "groq";

  if (provider === "anthropic") {
    // Anthropic Claude fallback
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await res.json();
    return data.content[0].text;
  }

  // Default: Groq (free tier, very fast)
  const completion = await getGroqClient().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 4000,
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content:
          "You are an expert ATS resume analyst and career coach. Always respond ONLY with valid JSON — no preamble, no markdown fences, no extra text.",
      },
      { role: "user", content: prompt },
    ],
  });

  return completion.choices[0].message.content || "";
}

export function buildAnalysisPrompt(
  resumeText: string,
  jobDescription: string
): string {
  return `You are an expert ATS (Applicant Tracking System) analyst and career coach with 10+ years of experience helping candidates pass automated screening and land interviews.

Analyze the resume against the job description below and return a SINGLE valid JSON object. Do NOT include any text before or after the JSON. Do NOT use markdown code blocks.

---
RESUME:
${resumeText.slice(0, 4000)}

---
JOB DESCRIPTION:
${jobDescription.slice(0, 3000)}

---
Return this exact JSON structure (fill all fields with real, specific analysis):

{
  "atsScore": <integer 0-100>,
  "scoreBreakdown": {
    "keywordMatch": <integer 0-100>,
    "formatting": <integer 0-100>,
    "experience": <integer 0-100>,
    "skills": <integer 0-100>
  },
  "summary": "<2-3 sentence honest overall assessment of resume-JD fit>",
  "keywordAnalysis": {
    "matched": [
      { "keyword": "<keyword>", "found": true, "importance": "critical|important|nice-to-have" }
    ],
    "missing": [
      { "keyword": "<keyword>", "found": false, "importance": "critical|important|nice-to-have" }
    ]
  },
  "bulletRewrites": [
    {
      "original": "<exact bullet from resume>",
      "improved": "<rewritten bullet with metrics and action verbs>",
      "reason": "<short reason for the change>"
    }
  ],
  "coverLetter": "<full tailored cover letter, 3 paragraphs, referencing specific JD requirements>",
  "topStrengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "criticalIssues": ["<issue 1>", "<issue 2>", "<issue 3>"]
}

Rules:
- atsScore must be an honest, calibrated 0-100 integer
- Include at least 5 matched keywords and 5 missing keywords
- Include at least 3 bullet rewrites (pick the weakest bullets)
- Cover letter must be personalized, not generic — reference specific technologies and requirements from the JD
- criticalIssues should be actionable (e.g. "Missing quantified metrics — add numbers to your impact statements")
`;
}
