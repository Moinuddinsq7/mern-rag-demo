/**
 * RETRIEVAL
 * ----------
 * User ki query ko embed karo, phir MongoDB me stored saare chunks ke
 * vectors se compare karo (cosine similarity), aur top-K sabse similar
 * chunks return karo.
 *
 * NOTE: Production me lakhon chunks hone par pura table scan slow hoga.
 * Tab tum MongoDB Atlas Vector Search ya dedicated vector DB (Pinecone,
 * Chroma, Qdrant) use karoge jo ye search bahut fast (ANN algorithm se)
 * karte hain. Chhote projects (hazaron chunks) ke liye ye brute-force
 * approach bilkul theek chalta hai.
 */

import { Chunk } from "./db.js";
import { embed, cosineSimilarity } from "./embedding.js";

export async function retrieve(query, topK = 2) {
  const queryVector = await embed(query);

  const allChunks = await Chunk.find({});

  const scored = allChunks.map((chunk) => ({
    content: chunk.content,
    docId: chunk.docId,
    score: cosineSimilarity(queryVector, chunk.vector),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK);
}
