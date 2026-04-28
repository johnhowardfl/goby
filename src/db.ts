import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const DB_PATH = process.env.DB_PATH ?? "data/goby.db";
mkdirSync(dirname(DB_PATH), { recursive: true });

export const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  is_admin INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS invites (
  token TEXT PRIMARY KEY,
  email TEXT,
  is_admin INTEGER NOT NULL DEFAULT 0,
  created_by INTEGER REFERENCES users(id),
  used_at INTEGER,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source TEXT UNIQUE NOT NULL,        -- relative path or upload identifier
  title TEXT NOT NULL,
  mime TEXT,
  content TEXT NOT NULL,              -- canonical text after extraction
  hash TEXT NOT NULL,                 -- sha256 of content; skip re-embed if unchanged
  uploaded_by INTEGER REFERENCES users(id),
  updated_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS chunks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  document_id INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  ord INTEGER NOT NULL,
  content TEXT NOT NULL,
  embedding BLOB NOT NULL,            -- packed Float32Array
  UNIQUE(document_id, ord)
);
CREATE INDEX IF NOT EXISTS idx_chunks_doc ON chunks(document_id);

CREATE TABLE IF NOT EXISTS conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,                 -- 'user' | 'assistant'
  content TEXT NOT NULL,
  citations TEXT,                     -- JSON array of source titles, optional
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id, id);
`);

export interface User {
  id: number;
  email: string;
  password_hash: string;
  display_name: string | null;
  is_admin: number;
  created_at: number;
}

export interface Document {
  id: number;
  source: string;
  title: string;
  mime: string | null;
  content: string;
  hash: string;
  uploaded_by: number | null;
  updated_at: number;
  created_at: number;
}

export interface Chunk {
  id: number;
  document_id: number;
  ord: number;
  content: string;
  embedding: Buffer;
}

export interface Conversation {
  id: number;
  user_id: number;
  title: string | null;
  created_at: number;
  updated_at: number;
}

export interface Message {
  id: number;
  conversation_id: number;
  role: "user" | "assistant";
  content: string;
  citations: string | null;
  created_at: number;
}

export function packEmbedding(vec: number[]): Buffer {
  const f32 = new Float32Array(vec);
  return Buffer.from(f32.buffer, f32.byteOffset, f32.byteLength);
}

export function unpackEmbedding(buf: Buffer): Float32Array {
  return new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
}
