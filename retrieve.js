import { embed } from "./embedding.js";
import { loadIndex, searchIndex } from "./faiss-index.js";

export async function retrieve(query, topK = 5) {
  if (!loadIndex()) {
    throw new Error("FAISS index nahi mila. Pehle 'Ingest Documents' karo.");
  }

  const queryVector = await embed(query);
  return searchIndex(queryVector, topK);
}
