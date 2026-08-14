import mongoose from "mongoose";

// Apna MongoDB URI yahan daalo (local ya MongoDB Atlas)
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/rag_demo";

const chunkSchema = new mongoose.Schema({
  docId: { type: String, required: true },
  chunkId: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  vector: { type: [Number], required: true }, // yahi hamara "embedding" store hota hai
});

export const Chunk = mongoose.model("Chunk", chunkSchema);

export async function connectDB() {
  await mongoose.connect(MONGO_URI);
  console.log(`MongoDB se connect ho gaya: ${MONGO_URI}`);
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
