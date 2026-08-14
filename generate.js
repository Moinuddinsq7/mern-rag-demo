export async function generateAnswer(query, retrievedChunks) {
  if (retrievedChunks.length === 0 || retrievedChunks[0].score < 0.05) {
    return "Mujhe iske baare me relevant information nahi mili knowledge base me.";
  }

  const relevantChunks = retrievedChunks.filter((c) => c.score > 0.2);
  if (relevantChunks.length === 0) {
    return "Mujhe iske baare me relevant information nahi mili knowledge base me.";
  }

  const context = relevantChunks
    .map((c, i) => `[${i + 1}] ${c.content}`)
    .join("\n\n");

  const prompt = `You are a helpful assistant. Answer the user's question based ONLY on the context below. Read ALL context items carefully before answering.

Context:
${context}

Question: ${query}

Instructions:
- Answer in Hindi/Hinglish
- Be concise and direct
- If the question asks for a count, count from the context and give the number
- If the question asks for a list, list all relevant items from context
- Use ONLY information from the context above

Answer:`;

  const res = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2",
      prompt,
      stream: false,
    }),
  });

  if (!res.ok) {
    throw new Error("Ollama se response nahi aaya. Kya Ollama chal raha hai?");
  }

  const data = await res.json();
  return data.response.trim();
}
