import { useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ingesting, setIngesting] = useState(false);
  const [ingestMsg, setIngestMsg] = useState("");
  const [chunks, setChunks] = useState([]);
  const [showChunks, setShowChunks] = useState(false);

  async function handleQuery(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, topK: 5 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleIngest() {
    setIngesting(true);
    setIngestMsg("");
    try {
      const res = await fetch("/api/ingest", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setIngestMsg(
        `${data.documentsCount} documents se ${data.chunksCount} chunks bane aur store ho gaye!`
      );
    } catch (err) {
      setIngestMsg(`Error: ${err.message}`);
    } finally {
      setIngesting(false);
    }
  }

  async function handleShowChunks() {
    if (showChunks) {
      setShowChunks(false);
      return;
    }
    try {
      const res = await fetch("/api/chunks");
      const data = await res.json();
      setChunks(data);
      setShowChunks(true);
    } catch (err) {
      setChunks([]);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>RAG Embedding System</h1>
        <p className="subtitle">
          MERN Stack - Retrieval Augmented Generation Demo
        </p>
      </header>

      <div className="controls">
        <button
          className="btn btn-ingest"
          onClick={handleIngest}
          disabled={ingesting}
        >
          {ingesting ? "Ingesting..." : "Ingest Documents"}
        </button>
        <button className="btn btn-secondary" onClick={handleShowChunks}>
          {showChunks ? "Hide Chunks" : "Show Stored Chunks"}
        </button>
      </div>

      {ingestMsg && (
        <div
          className={`alert ${ingestMsg.startsWith("Error") ? "alert-error" : "alert-success"}`}
        >
          {ingestMsg}
        </div>
      )}

      {showChunks && chunks.length > 0 && (
        <div className="chunks-section">
          <h3>Stored Chunks ({chunks.length})</h3>
          <div className="chunks-grid">
            {chunks.map((chunk) => (
              <div key={chunk.chunkId} className="chunk-card">
                <span className="chunk-id">{chunk.chunkId}</span>
                <p>{chunk.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <form className="query-form" onSubmit={handleQuery}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Apna sawaal yahan likho... (e.g. Mera order kab aayega?)"
          className="query-input"
        />
        <button className="btn btn-query" type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {result && !result.error && (
        <div className="results">
          <div className="answer-section">
            <h3>Answer</h3>
            <p className="answer-text">{result.answer}</p>
          </div>

          <div className="retrieved-section">
            <h3>Retrieved Chunks</h3>
            {result.chunks.map((chunk, i) => (
              <div key={i} className="result-card">
                <div className="result-header">
                  <span className="result-rank">#{i + 1}</span>
                  <span className="result-doc">{chunk.docId}</span>
                  <span className="result-score">
                    Score: {chunk.score.toFixed(3)}
                  </span>
                </div>
                <div className="score-bar-container">
                  <div
                    className="score-bar"
                    style={{ width: `${Math.max(chunk.score * 100, 2)}%` }}
                  />
                </div>
                <p className="result-content">{chunk.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {result?.error && <div className="alert alert-error">{result.error}</div>}
    </div>
  );
}

export default App;
