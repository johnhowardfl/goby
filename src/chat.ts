import Anthropic from "@anthropic-ai/sdk";
import { config } from "./config.js";
import { db, type Conversation, type Message } from "./db.js";
import { retrieve, type RetrievedChunk } from "./rag/retrieve.js";

const anthropic = new Anthropic({ apiKey: config.anthropicApiKey });

const SYSTEM_PROMPT = `You are Goby, the LeadSpeed support assistant.

You help LeadSpeed employees and users by answering questions from a tribal-knowledge base of internal docs. Your job is to retain institutional knowledge as employees cycle through.

Rules:
- Ground answers in the supplied <knowledge> snippets. Quote or paraphrase as needed.
- If the snippets don't cover the question, say so plainly. Do not invent product behavior, ticket numbers, or people's names.
- When you use information from a snippet, cite it inline like [source: filename] using the source listed in the snippet.
- Be concise. Engineers and support staff are reading this — skip preamble.
- If the user is asking how to do something in LeadSpeed and you have steps, give numbered steps.
- For questions outside the LeadSpeed/support scope, answer briefly and note you're outside your knowledge base.`;

function formatChunks(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) return "<knowledge>\n(no relevant snippets found)\n</knowledge>";
  const blocks = chunks.map((c, i) => {
    return `<snippet index="${i + 1}" source="${c.documentSource}" title="${c.documentTitle}">
${c.content}
</snippet>`;
  });
  return `<knowledge>\n${blocks.join("\n\n")}\n</knowledge>`;
}

// --- Conversation persistence ---

export function createConversation(userId: number, title?: string): Conversation {
  const now = Date.now();
  const info = db.prepare(`
    INSERT INTO conversations (user_id, title, created_at, updated_at) VALUES (?, ?, ?, ?)
  `).run(userId, title ?? null, now, now);
  return db.prepare("SELECT * FROM conversations WHERE id = ?").get(info.lastInsertRowid) as Conversation;
}

export function listConversations(userId: number): Conversation[] {
  return db.prepare(`
    SELECT * FROM conversations WHERE user_id = ? ORDER BY updated_at DESC LIMIT 100
  `).all(userId) as Conversation[];
}

export function getConversation(userId: number, id: number): Conversation | undefined {
  return db.prepare("SELECT * FROM conversations WHERE id = ? AND user_id = ?")
    .get(id, userId) as Conversation | undefined;
}

export function listMessages(conversationId: number): Message[] {
  return db.prepare("SELECT * FROM messages WHERE conversation_id = ? ORDER BY id")
    .all(conversationId) as Message[];
}

export function appendMessage(
  conversationId: number,
  role: "user" | "assistant",
  content: string,
  citations?: string[],
): Message {
  const now = Date.now();
  const info = db.prepare(`
    INSERT INTO messages (conversation_id, role, content, citations, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    conversationId,
    role,
    content,
    citations && citations.length ? JSON.stringify(citations) : null,
    now,
  );
  db.prepare("UPDATE conversations SET updated_at = ? WHERE id = ?").run(now, conversationId);
  return db.prepare("SELECT * FROM messages WHERE id = ?").get(info.lastInsertRowid) as Message;
}

export function deleteConversation(userId: number, id: number): void {
  db.prepare("DELETE FROM conversations WHERE id = ? AND user_id = ?").run(id, userId);
}

function setConversationTitle(id: number, title: string): void {
  db.prepare("UPDATE conversations SET title = ? WHERE id = ?").run(title, id);
}

export interface SearchHit {
  id: number;
  title: string | null;
  updated_at: number;
  snippet: string | null;
  match_role: "user" | "assistant" | null;
}

function extractSnippet(text: string, query: string, ctx = 50): string {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text.slice(0, 120) + (text.length > 120 ? "…" : "");
  const start = Math.max(0, idx - ctx);
  const end = Math.min(text.length, idx + query.length + ctx);
  return (start > 0 ? "…" : "") + text.slice(start, end).replace(/\s+/g, " ") + (end < text.length ? "…" : "");
}

export function searchConversations(userId: number, query: string): SearchHit[] {
  const like = `%${query}%`;
  const titleHits = db.prepare(`
    SELECT id, title, updated_at FROM conversations
    WHERE user_id = ? AND title LIKE ?
  `).all(userId, like) as { id: number; title: string | null; updated_at: number }[];

  // Most recent matching message per conversation wins
  const msgHits = db.prepare(`
    SELECT c.id as cid, c.title, c.updated_at, m.content, m.role
    FROM messages m JOIN conversations c ON c.id = m.conversation_id
    WHERE c.user_id = ? AND m.content LIKE ?
    ORDER BY m.id DESC
  `).all(userId, like) as { cid: number; title: string | null; updated_at: number; content: string; role: "user" | "assistant" }[];

  const hits = new Map<number, SearchHit>();
  for (const r of titleHits) {
    hits.set(r.id, { id: r.id, title: r.title, updated_at: r.updated_at, snippet: null, match_role: null });
  }
  for (const r of msgHits) {
    const existing = hits.get(r.cid);
    if (existing && existing.snippet) continue;
    hits.set(r.cid, {
      id: r.cid,
      title: r.title,
      updated_at: r.updated_at,
      snippet: extractSnippet(r.content, query),
      match_role: r.role,
    });
  }
  return Array.from(hits.values()).sort((a, b) => b.updated_at - a.updated_at).slice(0, 50);
}

// --- Streaming chat with RAG ---

export interface StreamChunk {
  type: "context" | "delta" | "done" | "error";
  data: unknown;
}

export async function* streamReply(
  conversationId: number,
  userMessage: string,
): AsyncGenerator<StreamChunk> {
  const history = listMessages(conversationId);
  // Auto-title on first user message so the sidebar isn't full of "Conversation #N".
  if (history.length === 0) {
    const title = userMessage.trim().split("\n")[0].slice(0, 60);
    if (title) setConversationTitle(conversationId, title);
  }
  appendMessage(conversationId, "user", userMessage);

  let retrieved: RetrievedChunk[] = [];
  try {
    retrieved = await retrieve(userMessage, 5);
  } catch (e) {
    yield { type: "error", data: `retrieval failed: ${(e as Error).message}` };
    return;
  }
  yield {
    type: "context",
    data: retrieved.map((r) => ({
      title: r.documentTitle,
      source: r.documentSource,
      score: Number(r.score.toFixed(3)),
    })),
  };

  const system = `${SYSTEM_PROMPT}\n\n${formatChunks(retrieved)}`;
  const messages: Anthropic.MessageParam[] = [
    ...history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user", content: userMessage },
  ];

  let assembled = "";
  try {
    const stream = await anthropic.messages.stream({
      model: config.anthropicModel,
      max_tokens: 1500,
      system,
      messages,
    });
    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        assembled += event.delta.text;
        yield { type: "delta", data: event.delta.text };
      }
    }
  } catch (e) {
    yield { type: "error", data: `model error: ${(e as Error).message}` };
    return;
  }

  const citations = Array.from(new Set(retrieved.map((r) => r.documentSource)));
  appendMessage(conversationId, "assistant", assembled, citations);
  yield { type: "done", data: { citations } };
}
