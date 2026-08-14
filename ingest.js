/**
 * INGESTION PIPELINE (ek baar chalane wala setup step)
 * ------------------------------------------------------
 * 1. Documents lo
 * 2. Chunk karo
 * 3. Har chunk ko embed karo (vector banao)
 * 4. MongoDB me store karo
 *
 * Chalane ka tareeka:  node ingest.js
 */

import { connectDB, disconnectDB, Chunk } from "./db.js";
import { chunkDocuments } from "./chunking.js";
import { embed } from "./embedding.js";
import { documents } from "./data/documents.js";

async function ingest() {
  await connectDB();

  // Purana data saaf karo (fresh ingest ke liye)
  await Chunk.deleteMany({});

  const chunks = chunkDocuments(documents);
  console.log(`${documents.length} documents se ${chunks.length} chunks bane.`);

  for (const chunk of chunks) {
    const vector = await embed(chunk.content);
    await Chunk.create({
      docId: chunk.docId,
      chunkId: chunk.chunkId,
      content: chunk.content,
      vector,
    });
    console.log(`Stored: ${chunk.chunkId} -> "${chunk.content.slice(0, 50)}..."`);
  }

  console.log("\nIngestion complete! Ab retrieval/query kar sakte ho.");
  await disconnectDB();
}

ingest().catch((err) => {
  console.error("Ingestion failed:", err.message);
  process.exit(1);
});
