import { Router } from "express";
import {
  createUser,
  getUserByEmail,
  verifyPassword,
  createSession,
  setSessionCookie,
  clearSessionCookie,
  readSessionCookie,
  destroySession,
  getSessionUser,
  getInvite,
  consumeInvite,
  userCount,
  requireAuth,
  type AuthedRequest,
} from "../auth.js";
import { authLimiter } from "../middleware/rateLimit.js";

export const authRouter = Router();

authRouter.post("/login", authLimiter, async (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string") {
    res.status(400).json({ error: "email and password required" });
    return;
  }
  const user = getUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    res.status(401).json({ error: "invalid credentials" });
    return;
  }
  const token = createSession(user.id);
  setSessionCookie(res, token);
  res.json({ id: user.id, email: user.email, display_name: user.display_name, is_admin: !!user.is_admin });
});

authRouter.post("/signup", authLimiter, async (req, res) => {
  const { email, password, display_name, invite } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string") {
    res.status(400).json({ error: "email and password required" });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: "password must be at least 8 characters" });
    return;
  }
  if (getUserByEmail(email)) {
    res.status(409).json({ error: "email already registered" });
    return;
  }

  // First user becomes admin without an invite. Everyone else needs one.
  let isAdmin = false;
  if (userCount() === 0) {
    isAdmin = true;
  } else {
    if (typeof invite !== "string") {
      res.status(400).json({ error: "invite token required" });
      return;
    }
    const inv = getInvite(invite);
    if (!inv || inv.used_at) {
      res.status(400).json({ error: "invalid or used invite" });
      return;
    }
    if (inv.email && inv.email !== email.toLowerCase()) {
      res.status(400).json({ error: "invite email mismatch" });
      return;
    }
    isAdmin = !!inv.is_admin;
    consumeInvite(invite);
  }

  const user = await createUser({ email, password, display_name, is_admin: isAdmin });
  const token = createSession(user.id);
  setSessionCookie(res, token);
  res.json({ id: user.id, email: user.email, display_name: user.display_name, is_admin: !!user.is_admin });
});

authRouter.post("/logout", (req, res) => {
  const token = readSessionCookie(req);
  if (token) destroySession(token);
  clearSessionCookie(res);
  res.json({ ok: true });
});

authRouter.get("/me", (req: AuthedRequest, res) => {
  const token = readSessionCookie(req);
  const user = token ? getSessionUser(token) : undefined;
  if (!user) {
    res.json({ user: null, needs_bootstrap: userCount() === 0 });
    return;
  }
  res.json({
    user: {
      id: user.id,
      email: user.email,
      display_name: user.display_name,
      is_admin: !!user.is_admin,
    },
  });
});

// Validate an invite token without consuming it (for the signup form to display context)
authRouter.get("/invite/:token", (req, res) => {
  const inv = getInvite(req.params.token);
  if (!inv) {
    res.status(404).json({ error: "invite not found" });
    return;
  }
  if (inv.used_at) {
    res.status(410).json({ error: "invite already used" });
    return;
  }
  res.json({ email: inv.email, is_admin: !!inv.is_admin });
});
