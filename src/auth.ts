import bcrypt from "bcrypt";
import crypto from "node:crypto";
import type { Request, Response, NextFunction } from "express";
import { db, type User } from "./db.js";

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const COOKIE_NAME = "goby_session";

export interface AuthedRequest extends Request {
  user?: User;
}

function newToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export interface CreateUserInput {
  email: string;
  password: string;
  display_name?: string;
  is_admin?: boolean;
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const password_hash = await hashPassword(input.password);
  const now = Date.now();
  const stmt = db.prepare(`
    INSERT INTO users (email, password_hash, display_name, is_admin, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    input.email.toLowerCase(),
    password_hash,
    input.display_name ?? null,
    input.is_admin ? 1 : 0,
    now,
  );
  return db.prepare("SELECT * FROM users WHERE id = ?").get(info.lastInsertRowid) as User;
}

export function getUserByEmail(email: string): User | undefined {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase()) as User | undefined;
}

export function getUserById(id: number): User | undefined {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as User | undefined;
}

export function userCount(): number {
  const row = db.prepare("SELECT COUNT(*) as n FROM users").get() as { n: number };
  return row.n;
}

export function createSession(userId: number): string {
  const token = newToken();
  const now = Date.now();
  db.prepare(`
    INSERT INTO sessions (token, user_id, expires_at, created_at)
    VALUES (?, ?, ?, ?)
  `).run(token, userId, now + SESSION_TTL_MS, now);
  return token;
}

export function getSessionUser(token: string): User | undefined {
  const row = db.prepare(`
    SELECT u.* FROM users u
    JOIN sessions s ON s.user_id = u.id
    WHERE s.token = ? AND s.expires_at > ?
  `).get(token, Date.now()) as User | undefined;
  return row;
}

export function destroySession(token: string): void {
  db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

export function setSessionCookie(res: Response, token: string): void {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    maxAge: SESSION_TTL_MS,
    path: "/",
  });
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

export function readSessionCookie(req: Request): string | undefined {
  return req.cookies?.[COOKIE_NAME];
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const token = readSessionCookie(req);
  if (!token) {
    res.status(401).json({ error: "not authenticated" });
    return;
  }
  const user = getSessionUser(token);
  if (!user) {
    res.status(401).json({ error: "session expired" });
    return;
  }
  req.user = user;
  next();
}

export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction): void {
  requireAuth(req, res, () => {
    if (!req.user?.is_admin) {
      res.status(403).json({ error: "admin only" });
      return;
    }
    next();
  });
}

// --- Invites ---

export interface Invite {
  token: string;
  email: string | null;
  is_admin: number;
  created_by: number | null;
  used_at: number | null;
  created_at: number;
}

export function createInvite(opts: { createdBy: number; email?: string; isAdmin?: boolean }): Invite {
  const token = newToken();
  const now = Date.now();
  db.prepare(`
    INSERT INTO invites (token, email, is_admin, created_by, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(token, opts.email?.toLowerCase() ?? null, opts.isAdmin ? 1 : 0, opts.createdBy, now);
  return db.prepare("SELECT * FROM invites WHERE token = ?").get(token) as Invite;
}

export function getInvite(token: string): Invite | undefined {
  return db.prepare("SELECT * FROM invites WHERE token = ?").get(token) as Invite | undefined;
}

export function consumeInvite(token: string): void {
  db.prepare("UPDATE invites SET used_at = ? WHERE token = ?").run(Date.now(), token);
}

export function listInvites(): Invite[] {
  return db.prepare("SELECT * FROM invites ORDER BY created_at DESC LIMIT 100").all() as Invite[];
}
