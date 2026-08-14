import express from "express";
import cors from "cors";
import { connectDB, disconnectDB, Chunk } from "./db.js";
import { chunkDocuments } from "./chunking.js";
import { embed } from "./embedding.js";
import { retrieve } from "./retrieve.js";
import { generateAnswer } from "./generate.js";
import { documents } from "./data/documents.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

await connectDB();

app.post("/api/ingest", async (req, res) => {
  try {
    await Chunk.deleteMany({});
    const chunks = chunkDocuments(documents);

    for (const chunk of chunks) {
      const vector = await embed(chunk.content);
      await Chunk.create({
        docId: chunk.docId,
        chunkId: chunk.chunkId,
        content: chunk.content,
        vector,
      });
    }

    res.json({
      message: "Ingestion complete!",
      documentsCount: documents.length,
      chunksCount: chunks.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/query", async (req, res) => {
  try {
    const { query, topK = 5 } = req.body;
    if (!query) {
      return res.status(400).json({ error: "query field is required" });
    }

    const results = await retrieve(query, topK);
    const answer = await generateAnswer(query, results);

    res.json({ query, answer, chunks: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/chunks", async (req, res) => {
  try {
    const chunks = await Chunk.find({}, { vector: 0 });
    res.json(chunks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/documents", (req, res) => {
  res.json(documents);
});

app.listen(PORT, () => {
  console.log(`Server chal raha hai: http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  await disconnectDB();
  process.exit(0);
});
