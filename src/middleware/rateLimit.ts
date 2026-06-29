import rateLimit, { type RateLimitRequestHandler } from "express-rate-limit";
import type { RequestHandler } from "express";
import { config } from "../config.js";
import type { AuthedRequest } from "../auth.js";

// Application-layer rate limiting to blunt DDoS / abuse. This complements (does
// not replace) upstream protection at the OVH edge and Apache reverse proxy —
// it's the last line of defense and the one that understands per-user cost.
//
// `trust proxy` is set in server.ts, so `req.ip` resolves to the real client
// address from X-Forwarded-For rather than the Apache loopback.

const rl = config.rateLimit;

// 429 body shared by every limiter so the frontend can detect it uniformly.
function limitMessage(retryHint: string) {
  return { error: "rate_limited", message: `Too many requests. ${retryHint}` };
}

// When disabled (e.g. local dev), hand back a pass-through so call sites stay
// identical whether limiting is on or off.
const passthrough: RequestHandler = (_req, _res, next) => next();

function make(opts: Parameters<typeof rateLimit>[0]): RateLimitRequestHandler | RequestHandler {
  if (rl.disabled) return passthrough;
  return rateLimit({
    standardHeaders: "draft-7", // emit RateLimit-* headers so clients can back off
    legacyHeaders: false,
    ...opts,
  });
}

// Coarse per-IP ceiling on everything. First wall against volumetric floods.
// /health is exempt so uptime monitors never trip it.
export const globalLimiter = make({
  windowMs: rl.globalWindowMs,
  max: rl.globalMax,
  message: limitMessage("Please slow down."),
  skip: (req) => req.path === "/health",
});

// Tight limit on unauthenticated auth endpoints. Each hit can run bcrypt, so
// this caps both credential-stuffing and CPU exhaustion. Don't count the
// requests that succeed — a legitimately logging-in user shouldn't be punished.
export const authLimiter = make({
  windowMs: rl.authWindowMs,
  max: rl.authMax,
  skipSuccessfulRequests: true,
  message: limitMessage("Too many attempts; wait a few minutes and try again."),
});

// Per-user limit on the money-spending chat endpoint (Anthropic + Voyage on
// every call). Keyed by user id rather than IP so a single authenticated
// account can't fan out cost across many source addresses.
export const chatMessageLimiter = make({
  windowMs: rl.chatWindowMs,
  max: rl.chatMax,
  keyGenerator: (req) => {
    const userId = (req as AuthedRequest).user?.id;
    return userId !== undefined ? `u:${userId}` : `ip:${req.ip}`;
  },
  message: limitMessage("You're sending messages too quickly."),
});
