// Markdown-aware chunking. Splits on H1/H2/H3 headers; if a section is too
// large, falls back to paragraph-then-sentence splits. Target ~500 tokens
// (~2000 chars) per chunk with ~100-char overlap to preserve context across
// boundaries.

const TARGET_CHARS = 2000;
const OVERLAP_CHARS = 200;
const MAX_CHARS = 3000;

export interface RawChunk {
  ord: number;
  content: string;
}

function splitOnHeaders(text: string): string[] {
  // Split before any line starting with one or more #'s, keeping the header.
  const parts = text.split(/\n(?=#{1,3} )/);
  return parts.map((s) => s.trim()).filter(Boolean);
}

function splitParagraphs(text: string): string[] {
  return text.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);
}

function splitSentences(text: string): string[] {
  // Cheap sentence splitter — good enough for chunking.
  return text.split(/(?<=[.!?])\s+(?=[A-Z(])/).map((s) => s.trim()).filter(Boolean);
}

function packPieces(pieces: string[]): string[] {
  const out: string[] = [];
  let buf = "";
  for (const piece of pieces) {
    if (piece.length > MAX_CHARS) {
      // recursively break overly-large pieces by paragraph then sentence
      if (buf) {
        out.push(buf);
        buf = "";
      }
      const subs = splitParagraphs(piece);
      const subsToPack = subs.length > 1 ? subs : splitSentences(piece);
      for (const c of packPieces(subsToPack)) out.push(c);
      continue;
    }
    if (buf.length + piece.length + 2 > TARGET_CHARS && buf) {
      out.push(buf);
      // keep tail overlap to preserve context across chunk boundaries
      buf = buf.slice(-OVERLAP_CHARS) + "\n\n" + piece;
    } else {
      buf = buf ? buf + "\n\n" + piece : piece;
    }
  }
  if (buf) out.push(buf);
  return out;
}

export function chunkText(text: string, title: string): RawChunk[] {
  const cleaned = text.replace(/\r\n/g, "\n").trim();
  if (!cleaned) return [];

  // First pass: headers. If no headers found, fall back to paragraphs.
  const sections = cleaned.includes("\n#") || cleaned.startsWith("#")
    ? splitOnHeaders(cleaned)
    : splitParagraphs(cleaned);

  const packed = packPieces(sections);

  // Prefix each chunk with title so retrieval surfaces source context.
  return packed.map((content, i) => ({
    ord: i,
    content: `# ${title}\n\n${content}`,
  }));
}
