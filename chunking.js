/**
 * CHUNKING
 * ---------
 * Bade text ko chhote, meaningful pieces (chunks) me todte hain.
 * Isse embedding zyada accurate banti hai (poora paragraph ek vector me
 * dabane se meaning "dilute" ho jaata hai).
 *
 * Real projects me chunk size 200-500 words hoti hai. Yahan demo ke liye
 * hum sentence-level chunking kar rahe hain kyunki hamare documents chhote hain.
 */

export function chunkText(text, { maxWords = 40, overlapWords = 10 } = {}) {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const chunks = [];
  let current = [];
  let wordCount = 0;

  for (const sentence of sentences) {
    const words = sentence.split(/\s+/).length;
    if (wordCount + words > maxWords && current.length > 0) {
      chunks.push(current.join(" "));

      let overlapCount = 0;
      const overlap = [];
      for (let i = current.length - 1; i >= 0; i--) {
        const w = current[i].split(/\s+/).length;
        if (overlapCount + w > overlapWords) break;
        overlap.unshift(current[i]);
        overlapCount += w;
      }

      current = overlap;
      wordCount = overlapCount;
    }
    current.push(sentence);
    wordCount += sentence.split(/\s+/).length;
  }
  if (current.length > 0) chunks.push(current.join(" "));

  return chunks;
}

export function chunkDocuments(documents) {
  const allChunks = [];
  for (const doc of documents) {
    const pieces = chunkText(doc.text);
    pieces.forEach((chunkContent, idx) => {
      allChunks.push({
        docId: doc.id,
        chunkId: `${doc.id}-chunk-${idx}`,
        content: chunkContent,
      });
    });
  }
  return allChunks;
}
