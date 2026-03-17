/**
 * Extracts plain text from uploaded resume files.
 * Supports: .pdf, .docx, .txt
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith(".pdf")) {
    return extractFromPdf(buffer);
  } else if (fileName.endsWith(".docx")) {
    return extractFromDocx(buffer);
  } else if (fileName.endsWith(".txt")) {
    return buffer.toString("utf-8");
  } else {
    throw new Error(
      "Unsupported file format. Please upload a .pdf, .docx, or .txt file."
    );
  }
}

async function extractFromPdf(buffer: Buffer): Promise<string> {
  try {
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(buffer);
    const text = data.text.trim();
    if (!text || text.length < 50) {
      throw new Error(
        "Could not extract text from this PDF. It may be image-based. Please try a text-based PDF or .docx."
      );
    }
    return text;
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("Could not extract")) {
      throw err;
    }
    throw new Error("Failed to parse PDF. Please try a .docx or .txt file.");
  }
}

async function extractFromDocx(buffer: Buffer): Promise<string> {
  try {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value.trim();
    if (!text || text.length < 50) {
      throw new Error("Could not extract text from this DOCX file.");
    }
    return text;
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("Could not extract")) {
      throw err;
    }
    throw new Error("Failed to parse DOCX. Please try a .pdf or .txt file.");
  }
}
