// Extract plain text from supported document formats.
import { readFile } from "node:fs/promises";
import path from "node:path";
import mammoth from "mammoth";

export interface ExtractedDoc {
  title: string;
  text: string;
  mime: string;
}

export async function extractFromBuffer(buf: Buffer, filename: string, mime?: string): Promise<ExtractedDoc> {
  const ext = path.extname(filename).toLowerCase();
  const title = path.basename(filename, ext);

  if (ext === ".md" || ext === ".markdown" || ext === ".txt" || mime === "text/plain" || mime === "text/markdown") {
    return { title, text: buf.toString("utf-8"), mime: mime ?? "text/markdown" };
  }

  if (ext === ".docx" || mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const result = await mammoth.extractRawText({ buffer: buf });
    return { title, text: result.value, mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" };
  }

  if (ext === ".pdf" || mime === "application/pdf") {
    // pdf-parse is CJS; dynamic import to keep ESM happy.
    const mod = await import("pdf-parse");
    const pdfParse = (mod.default ?? mod) as (b: Buffer) => Promise<{ text: string }>;
    const result = await pdfParse(buf);
    return { title, text: result.text, mime: "application/pdf" };
  }

  throw new Error(`Unsupported file type: ${ext || mime || "unknown"}`);
}

export async function extractFromFile(filepath: string): Promise<ExtractedDoc> {
  const buf = await readFile(filepath);
  return extractFromBuffer(buf, filepath);
}
