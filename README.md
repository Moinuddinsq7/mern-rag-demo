# MERN RAG Embedding System

Ye ek full-stack RAG (Retrieval-Augmented Generation) system hai with React frontend.
E-commerce data (orders, policies, products) ko knowledge base bana ke,
real embedding model + local LLM se intelligent answers deta hai.

## Tech Stack

- **Embedding**: all-MiniLM-L6-v2 via @xenova/transformers
- **LLM**: Ollama (llama3.2) — free, local, no API key
- **Backend**: Express.js + MongoDB (Mongoose)
- **Frontend**: React (Vite)

## Kaise Chalayein

1. **MongoDB chalu karo**
2. **Ollama install karo** aur model pull karo: `ollama pull llama3.2`
3. **Dependencies install karo:**
   ```bash
   npm install
   cd client && npm install
   ```
4. **Backend start karo:** `npm run server`
5. **Frontend start karo:** `cd client && npm run dev`
6. Browser me `http://localhost:5173` kholo
7. "Ingest Documents" click karo, phir sawaal poocho!
