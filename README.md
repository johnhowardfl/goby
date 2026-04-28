# Goby — LeadSpeed support chatbot

Internal support bot for LeadSpeed. RAG over tribal-knowledge docs that grow over time, so the bot retains institutional context as employees cycle through.

## Stack

- Node.js 20+ / TypeScript / Express
- SQLite (`better-sqlite3`) — single-file DB
- Anthropic Claude (chat) + Voyage AI (embeddings)
- Vanilla HTML/CSS/JS frontend, SSE streaming

## Quick start (local)

```bash
cp .env.example .env
# fill in ANTHROPIC_API_KEY, VOYAGE_API_KEY, SESSION_SECRET
npm install
npm run init-admin   # creates the first admin user interactively
npm run dev          # http://localhost:3001
```

Drop `.md`, `.pdf`, `.docx`, or `.txt` files into `knowledge/` then:

```bash
npm run ingest       # chunk, embed, upsert
```

Or upload via the admin UI at `/admin`.

## Deployment

Currently runs on Pluto at https://goby.softwerks.pro. See `deploy/README.md`.

Eventual target: LeadSpeed Azure ecosystem (App Service + Azure SQL/Postgres).
