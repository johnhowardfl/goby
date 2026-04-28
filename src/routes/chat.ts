import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../auth.js";
import {
  createConversation,
  listConversations,
  getConversation,
  listMessages,
  deleteConversation,
  streamReply,
} from "../chat.js";

export const chatRouter = Router();

chatRouter.use(requireAuth);

chatRouter.get("/conversations", (req: AuthedRequest, res) => {
  res.json(listConversations(req.user!.id));
});

chatRouter.post("/conversations", (req: AuthedRequest, res) => {
  const conv = createConversation(req.user!.id, req.body?.title);
  res.json(conv);
});

chatRouter.get("/conversations/:id", (req: AuthedRequest, res) => {
  const id = Number(req.params.id);
  const conv = getConversation(req.user!.id, id);
  if (!conv) {
    res.status(404).json({ error: "not found" });
    return;
  }
  res.json({ conversation: conv, messages: listMessages(conv.id) });
});

chatRouter.delete("/conversations/:id", (req: AuthedRequest, res) => {
  deleteConversation(req.user!.id, Number(req.params.id));
  res.json({ ok: true });
});

// Server-Sent Events for streaming responses.
chatRouter.post("/conversations/:id/message", async (req: AuthedRequest, res) => {
  const id = Number(req.params.id);
  const conv = getConversation(req.user!.id, id);
  if (!conv) {
    res.status(404).json({ error: "not found" });
    return;
  }
  const { content } = req.body ?? {};
  if (typeof content !== "string" || !content.trim()) {
    res.status(400).json({ error: "content required" });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();

  const send = (event: string, data: unknown) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    for await (const chunk of streamReply(conv.id, content.trim())) {
      send(chunk.type, chunk.data);
    }
  } catch (e) {
    send("error", (e as Error).message);
  }
  res.end();
});
