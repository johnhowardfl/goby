import { Router } from "express";
import multer from "multer";
import { db } from "../db.js";
import {
  requireAdmin,
  createInvite,
  listInvites,
  type AuthedRequest,
} from "../auth.js";
import { config } from "../config.js";
import { extractFromBuffer } from "../rag/extract.js";
import { upsertDocument, listDocuments, deleteDocument } from "../rag/store.js";

export const adminRouter = Router();
adminRouter.use(requireAdmin);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB per file
});

// --- Users ---

adminRouter.get("/users", (_req, res) => {
  const rows = db.prepare(`
    SELECT id, email, display_name, is_admin, created_at FROM users ORDER BY created_at
  `).all();
  res.json(rows);
});

// --- Invites ---

adminRouter.get("/invites", (_req, res) => {
  res.json(listInvites());
});

adminRouter.post("/invites", (req: AuthedRequest, res) => {
  const { email, is_admin } = req.body ?? {};
  const inv = createInvite({
    createdBy: req.user!.id,
    email: typeof email === "string" && email ? email : undefined,
    isAdmin: !!is_admin,
  });
  res.json({
    ...inv,
    url: `${config.publicUrl}/signup.html?invite=${inv.token}`,
  });
});

// --- Documents ---

adminRouter.get("/documents", (_req, res) => {
  const docs = listDocuments().map((d) => {
    const row = db.prepare("SELECT COUNT(*) as n FROM chunks WHERE document_id = ?").get(d.id) as { n: number };
    return {
      id: d.id,
      source: d.source,
      title: d.title,
      mime: d.mime,
      updated_at: d.updated_at,
      chunk_count: row.n,
      char_count: d.content.length,
    };
  });
  res.json(docs);
});

adminRouter.post("/documents/upload", upload.array("files", 20), async (req: AuthedRequest, res) => {
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  if (!files.length) {
    res.status(400).json({ error: "no files" });
    return;
  }
  const results: Array<{ filename: string; ok: boolean; chunks?: number; changed?: boolean; error?: string }> = [];
  for (const f of files) {
    try {
      const ext = await extractFromBuffer(f.buffer, f.originalname, f.mimetype);
      const r = await upsertDocument({
        source: `upload/${f.originalname}`,
        title: ext.title,
        mime: ext.mime,
        content: ext.text,
        uploadedBy: req.user!.id,
      });
      results.push({ filename: f.originalname, ok: true, chunks: r.chunkCount, changed: r.changed });
    } catch (e) {
      results.push({ filename: f.originalname, ok: false, error: (e as Error).message });
    }
  }
  res.json({ results });
});

adminRouter.post("/documents/text", async (req: AuthedRequest, res) => {
  const { title, content } = req.body ?? {};
  if (typeof title !== "string" || !title.trim() || typeof content !== "string" || !content.trim()) {
    res.status(400).json({ error: "title and content required" });
    return;
  }
  try {
    const r = await upsertDocument({
      source: `text/${title.trim().replace(/[^a-zA-Z0-9._-]+/g, "_")}.md`,
      title: title.trim(),
      mime: "text/markdown",
      content,
      uploadedBy: req.user!.id,
    });
    res.json({ ok: true, document_id: r.documentId, chunks: r.chunkCount, changed: r.changed });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

adminRouter.delete("/documents/:id", (req, res) => {
  deleteDocument(Number(req.params.id));
  res.json({ ok: true });
});
