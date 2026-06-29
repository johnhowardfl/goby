import "dotenv/config";

function required(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Missing env var ${key}`);
  return v;
}

function num(key: string, fallback: number): number {
  const v = process.env[key];
  if (v === undefined || v === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export const config = {
  port: Number(process.env.PORT ?? 3001),
  anthropicApiKey: required("ANTHROPIC_API_KEY"),
  voyageApiKey: required("VOYAGE_API_KEY"),
  sessionSecret: required("SESSION_SECRET"),
  anthropicModel: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
  voyageModel: process.env.VOYAGE_MODEL ?? "voyage-3-lite",
  cookieSecure: process.env.COOKIE_SECURE === "true",
  publicUrl: process.env.PUBLIC_URL ?? "http://localhost:3001",

  // --- Rate limiting (DDoS / abuse mitigation) ---
  // Set RATE_LIMIT_DISABLED=true to turn off app-layer limiting (e.g. local dev).
  rateLimit: {
    disabled: process.env.RATE_LIMIT_DISABLED === "true",
    // Coarse per-IP ceiling across every request. Catches volumetric floods.
    globalWindowMs: num("RATE_LIMIT_GLOBAL_WINDOW_MS", 60_000),
    globalMax: num("RATE_LIMIT_GLOBAL_MAX", 300),
    // Strict per-IP limit on unauthenticated auth endpoints. Stops password
    // brute-forcing and bcrypt CPU-amplification.
    authWindowMs: num("RATE_LIMIT_AUTH_WINDOW_MS", 15 * 60_000),
    authMax: num("RATE_LIMIT_AUTH_MAX", 10),
    // Per-user limit on the chat endpoint, which spends money on every call
    // (Anthropic + Voyage). Keyed by user id, so one account can't amplify cost.
    chatWindowMs: num("RATE_LIMIT_CHAT_WINDOW_MS", 60_000),
    chatMax: num("RATE_LIMIT_CHAT_MAX", 20),
  },
};
