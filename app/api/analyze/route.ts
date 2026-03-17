import { NextRequest, NextResponse } from "next/server";
import { extractTextFromFile } from "@/lib/parser";
import { callLLM, buildAnalysisPrompt } from "@/lib/llm";
import type { AnalysisResult } from "@/lib/types";

export const maxDuration = 60; // Vercel function timeout

export async function POST(req: NextRequest) {
  try {
    // ── 1. Parse form data ──────────────────────────────────────────
    const formData = await req.formData();
    const resumeFile = formData.get("resume") as File | null;
    const jobDescription = formData.get("jobDescription") as string | null;

    // ── 2. Validate inputs ──────────────────────────────────────────
    if (!resumeFile) {
      return NextResponse.json(
        { error: "No resume file uploaded." },
        { status: 400 }
      );
    }

    if (!jobDescription || jobDescription.trim().length < 50) {
      return NextResponse.json(
        { error: "Job description is too short. Please paste the full JD." },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowedTypes.includes(resumeFile.type) && 
        !resumeFile.name.match(/\.(pdf|docx|txt)$/i)) {
      return NextResponse.json(
        { error: "Only .pdf, .docx, and .txt files are supported." },
        { status: 400 }
      );
    }

    if (resumeFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be under 5MB." },
        { status: 400 }
      );
    }

    // ── 3. Extract text from resume ─────────────────────────────────
    let resumeText: string;
    try {
      resumeText = await extractTextFromFile(resumeFile);
    } catch (parseErr: unknown) {
      return NextResponse.json(
        {
          error:
            parseErr instanceof Error
              ? parseErr.message
              : "Failed to read resume file.",
        },
        { status: 422 }
      );
    }

    // ── 4. Call LLM ─────────────────────────────────────────────────
    const prompt = buildAnalysisPrompt(resumeText, jobDescription);
    let rawResponse: string;

    try {
      rawResponse = await callLLM(prompt);
    } catch (llmErr: unknown) {
      console.error("LLM call failed:", llmErr);
      return NextResponse.json(
        {
          error:
            "AI analysis failed. Please check your API key configuration and try again.",
        },
        { status: 503 }
      );
    }

    // ── 5. Parse JSON response ──────────────────────────────────────
    let result: AnalysisResult;
    try {
      // Strip any accidental markdown fences
      const clean = rawResponse
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();

      result = JSON.parse(clean) as AnalysisResult;

      // Validate critical fields
      if (
        typeof result.atsScore !== "number" ||
        result.atsScore < 0 ||
        result.atsScore > 100
      ) {
        throw new Error("Invalid atsScore in response");
      }
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr, "\nRaw:", rawResponse);
      return NextResponse.json(
        {
          error:
            "Failed to parse AI response. Please try again — this is usually a temporary issue.",
        },
        { status: 500 }
      );
    }

    // ── 6. Return result ────────────────────────────────────────────
    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    console.error("Unhandled error in /api/analyze:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
