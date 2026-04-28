import "dotenv/config";

function required(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Missing env var ${key}`);
  return v;
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
};
