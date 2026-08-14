/**
 * MAIN PIPELINE - RAG in action
 * -------------------------------
 * Chalane se pehle ek baar `node ingest.js` chala lena (data store karne ke liye).
 * Phir: node index.js "tumhara sawaal yahan"
 */

import { connectDB, disconnectDB } from "./db.js";
import { retrieve } from "./retrieve.js";
import { generateAnswer } from "./generate.js";

const query = process.argv.slice(2).join(" ") || "Mera order kab deliver hoga?";

async function main() {
  await connectDB();

  console.log(`\nQuery: "${query}"\n`);

  // STEP 1: Retrieval - relevant chunks dhoondo
  const results = await retrieve(query, 2);
  console.log("--- Retrieved Chunks ---");
  results.forEach((r, i) =>
    console.log(`${i + 1}. [score: ${r.score.toFixed(3)}] ${r.content}`)
  );

  // STEP 2: Generation - un chunks se answer banao
  const answer = await generateAnswer(query, results);
  console.log("\n--- Final Answer ---");
  console.log(answer);

  await disconnectDB();
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
