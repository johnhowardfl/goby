import crypto from "node:crypto";
import { db, packEmbedding, type Document, type Chunk } from "../db.js";
import { chunkText } from "./chunk.js";
import { embedDocuments } from "./voyage.js";

function sha256(s: string): string {
  return crypto.createHash("sha256").update(s).digest("hex");
}

export interface UpsertInput {
  source: string;       // unique key — relative path or "upload:<id>"
  title: string;
  mime: string | null;
  content: string;      // extracted plain text
  uploadedBy?: number | null;
}

export interface UpsertResult {
  documentId: number;
  changed: boolean;     // false if content unchanged and embeddings reused
  chunkCount: number;
}

export async function upsertDocument(input: UpsertInput): Promise<UpsertResult> {
  const hash = sha256(input.content);
  const now = Date.now();
  const existing = db
    .prepare("SELECT * FROM documents WHERE source = ?")
    .get(input.source) as Document | undefined;

  if (existing && existing.hash === hash) {
    const row = db.prepare("SELECT COUNT(*) as n FROM chunks WHERE document_id = ?").get(existing.id) as { n: number };
    return { documentId: existing.id, changed: false, chunkCount: row.n };
  }

  const chunks = chunkText(input.content, input.title);
  if (chunks.length === 0) {
    throw new Error(`Document ${input.source} produced no chunks (empty after extraction?)`);
  }
  const vectors = await embedDocuments(chunks.map((c) => c.content));

  const tx = db.transaction(() => {
    let docId: number;
    if (existing) {
      db.prepare(`
        UPDATE documents
        SET title = ?, mime = ?, content = ?, hash = ?, updated_at = ?
        WHERE id = ?
      `).run(input.title, input.mime, input.content, hash, now, existing.id);
      docId = existing.id;
      db.prepare("DELETE FROM chunks WHERE document_id = ?").run(docId);
    } else {
      const info = db.prepare(`
        INSERT INTO documents (source, title, mime, content, hash, uploaded_by, updated_at, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        input.source,
        input.title,
        input.mime,
        input.content,
        hash,
        input.uploadedBy ?? null,
        now,
        now,
      );
      docId = Number(info.lastInsertRowid);
    }
    const insertChunk = db.prepare(`
      INSERT INTO chunks (document_id, ord, content, embedding) VALUES (?, ?, ?, ?)
    `);
    for (let i = 0; i < chunks.length; i++) {
      insertChunk.run(docId, chunks[i].ord, chunks[i].content, packEmbedding(vectors[i]));
    }
    return docId;
  });

  const docId = tx();
  return { documentId: docId, changed: true, chunkCount: chunks.length };
}

export function listDocuments(): Document[] {
  return db.prepare("SELECT * FROM documents ORDER BY updated_at DESC").all() as Document[];
}

export function getDocument(id: number): Document | undefined {
  return db.prepare("SELECT * FROM documents WHERE id = ?").get(id) as Document | undefined;
}

export function deleteDocument(id: number): void {
  db.prepare("DELETE FROM documents WHERE id = ?").run(id);
}

export function getAllChunks(): (Chunk & { document_title: string; document_source: string })[] {
  return db.prepare(`
    SELECT c.*, d.title as document_title, d.source as document_source
    FROM chunks c JOIN documents d ON d.id = c.document_id
  `).all() as (Chunk & { document_title: string; document_source: string })[];
}
