import { config } from "../config.js";

const VOYAGE_URL = "https://api.voyageai.com/v1/embeddings";

export interface VoyageEmbeddingResponse {
  data: { embedding: number[]; index: number }[];
  model: string;
  usage: { total_tokens: number };
}

async function embedBatch(
  inputs: string[],
  inputType: "document" | "query",
): Promise<number[][]> {
  const res = await fetch(VOYAGE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.voyageApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.voyageModel,
      input: inputs,
      input_type: inputType,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Voyage error ${res.status}: ${body}`);
  }
  const json = (await res.json()) as VoyageEmbeddingResponse;
  // Voyage returns objects in input order, but sort by index defensively.
  return json.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
}

const BATCH_SIZE = 32; // voyage-3-lite handles 128, but smaller batches keep memory predictable

export async function embedDocuments(texts: string[]): Promise<number[][]> {
  const out: number[][] = [];
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const vecs = await embedBatch(batch, "document");
    out.push(...vecs);
  }
  return out;
}

export async function embedQuery(text: string): Promise<number[]> {
  const [vec] = await embedBatch([text], "query");
  return vec;
}
