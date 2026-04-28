// CLI: walks knowledge/ and upserts every supported file.
//   npx tsx src/rag/ingest.ts [knowledge_dir]

import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { extractFromFile } from "./extract.js";
import { upsertDocument } from "./store.js";

const SUPPORTED = new Set([".md", ".markdown", ".txt", ".pdf", ".docx"]);

async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir)) {
    if (entry.startsWith(".")) continue;
    const full = path.join(dir, entry);
    const s = await stat(full);
    if (s.isDirectory()) yield* walk(full);
    else if (SUPPORTED.has(path.extname(entry).toLowerCase())) yield full;
  }
}

async function main() {
  const root = path.resolve(process.argv[2] ?? "knowledge");
  console.log(`Ingesting from ${root}`);

  let total = 0;
  let changed = 0;
  let chunks = 0;
  for await (const file of walk(root)) {
    const rel = path.relative(root, file).replace(/\\/g, "/");
    try {
      const ext = await extractFromFile(file);
      const result = await upsertDocument({
        source: rel,
        title: ext.title,
        mime: ext.mime,
        content: ext.text,
      });
      total++;
      chunks += result.chunkCount;
      if (result.changed) {
        changed++;
        console.log(`  [embed] ${rel} (${result.chunkCount} chunks)`);
      } else {
        console.log(`  [skip ] ${rel} (unchanged)`);
      }
    } catch (e) {
      console.error(`  [fail ] ${rel}: ${(e as Error).message}`);
    }
  }
  console.log(`Done. ${total} docs scanned, ${changed} re-embedded, ${chunks} total chunks.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
