import { unpackEmbedding } from "../db.js";
import { embedQuery } from "./voyage.js";
import { getAllChunks } from "./store.js";

export interface RetrievedChunk {
  documentId: number;
  documentTitle: string;
  documentSource: string;
  ord: number;
  content: string;
  score: number;
}

function cosine(a: Float32Array, b: Float32Array): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

export async function retrieve(query: string, k = 5): Promise<RetrievedChunk[]> {
  const chunks = getAllChunks();
  if (chunks.length === 0) return [];

  const qVec = Float32Array.from(await embedQuery(query));
  const scored = chunks.map((c) => ({
    documentId: c.document_id,
    documentTitle: c.document_title,
    documentSource: c.document_source,
    ord: c.ord,
    content: c.content,
    score: cosine(qVec, unpackEmbedding(c.embedding)),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}
