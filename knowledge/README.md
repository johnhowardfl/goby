# LeadSpeed knowledge base

Drop markdown, PDF, DOCX, or TXT files in this directory (or subdirectories) and run:

```bash
npm run ingest
```

Each file becomes a document. Documents are chunked, embedded with Voyage AI, and stored in SQLite. The chat bot retrieves the top-5 most relevant chunks for every user question.

Tips for good tribal-knowledge docs:

- **One topic per file.** Easier to update; better retrieval.
- **Use H1/H2 headers.** The chunker splits on them; headers also serve as natural section titles.
- **Be specific.** "When customer X complains about Y, check Z" is far more useful than "we have a customer dashboard."
- **Cite ticket numbers, dates, names.** This is exactly the context that walks out the door when employees leave.

You can also add documents through the admin UI at `/admin` — useful for one-off notes or for non-engineers contributing knowledge.
