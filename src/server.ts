import express from "express";
import cookieParser from "cookie-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "./config.js";
import { globalLimiter } from "./middleware/rateLimit.js";
import { authRouter } from "./routes/auth.js";
import { chatRouter } from "./routes/chat.js";
import { adminRouter } from "./routes/admin.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, "..", "public");

const app = express();

// Behind Apache/nginx reverse proxy on Pluto.
app.set("trust proxy", 1);

// Coarse per-IP flood protection ahead of body parsing so abusive volume is
// shed as cheaply as possible.
app.use(globalLimiter);

app.use(express.json({ limit: "2mb" }));
app.use(cookieParser(config.sessionSecret));

app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);
app.use("/api/admin", adminRouter);

app.get("/health", (_req, res) => {
  res.json({ ok: true, model: config.anthropicModel });
});

app.use(express.static(PUBLIC_DIR));

// SPA-ish: serve index.html for unknown non-API routes so deep links work.
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  if (req.method !== "GET") return next();
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

app.listen(config.port, () => {
  console.log(`Goby listening on http://localhost:${config.port}`);
});
