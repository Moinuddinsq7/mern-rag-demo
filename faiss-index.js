import pkg from "faiss-node";
const { Index, IndexFlatIP } = pkg;
import { readFileSync, writeFileSync, existsSync } from "fs";

const INDEX_PATH = "./faiss_store.index";
const META_PATH = "./faiss_store.json";
const IVF_THRESHOLD = 0;

let index = null;
let metadata = [];

export function buildIndex(chunks, vectors) {
  const dimension = vectors[0].length;
  const totalVectors = vectors.length;

  const flat = new Float32Array(totalVectors * dimension);
  for (let i = 0; i < totalVectors; i++) {
    flat.set(vectors[i], i * dimension);
  }

  if (totalVectors >= IVF_THRESHOLD) {
    const nlist = Math.max(2, Math.floor(Math.sqrt(totalVectors)));
    index = new Index(dimension, `IVF${nlist},Flat`);
    index.train(Array.from(flat));
    console.log(`IVFFlat index trained: nlist=${nlist}`);
  } else {
    index = new IndexFlatIP(dimension);
  }

  metadata = chunks.map((c) => ({
    docId: c.docId,
    chunkId: c.chunkId,
    content: c.content,
  }));

  for (const vec of vectors) {
    index.add(vec);
  }

  writeFileSync(INDEX_PATH, index.toBuffer());
  writeFileSync(META_PATH, JSON.stringify(metadata));

  const indexType = totalVectors >= IVF_THRESHOLD ? "IVFFlat" : "FlatIP";
  console.log(`FAISS index built (${indexType}): ${index.ntotal()} vectors, ${dimension} dimensions`);
}

export function loadIndex() {
  if (index) return true;

  if (!existsSync(INDEX_PATH) || !existsSync(META_PATH)) {
    return false;
  }

  const buffer = readFileSync(INDEX_PATH);
  index = Index.fromBuffer(buffer);
  metadata = JSON.parse(readFileSync(META_PATH, "utf-8"));

  console.log(`FAISS index loaded: ${index.ntotal()} vectors`);
  return true;
}

export function searchIndex(queryVector, topK = 5) {
  if (!index) {
    throw new Error("FAISS index not loaded. Pehle ingest karo.");
  }

  const result = index.search(queryVector, topK);

  return result.labels.map((id, i) => ({
    ...metadata[id],
    score: result.distances[i],
  }));
}
