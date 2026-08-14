# Mini RAG System — Node.js + MongoDB

Ye ek chota, poora-chalne-wala RAG (Retrieval-Augmented Generation) system hai.
E-commerce data (orders, policies, products) ko knowledge base bana ke,
questions ke real answers deta hai.

## Pipeline

```
documents.js  -->  chunking.js  -->  embedding.js  -->  MongoDB (db.js)
                                                              |
                                                       retrieve.js
                                                              |
                                                       generate.js
```

## Files

| File | Kaam |
|---|---|
| `data/documents.js` | Sample knowledge base (orders, policies, products) |
| `chunking.js` | Documents ko chhote chunks me todta hai |
| `embedding.js` | Text ko vector (numbers) me convert karta hai + cosine similarity |
| `db.js` | MongoDB connection + Chunk schema (content + vector store karta hai) |
| `ingest.js` | Ek-baar-chalane-wala script: chunk + embed + MongoDB me save |
| `retrieve.js` | Query ke liye sabse relevant chunks dhoondta hai |
| `generate.js` | Retrieved chunks se final answer banata hai |
| `index.js` | Sab kuch jodta hai — query do, answer milega |

## Kaise Chalayein

1. **MongoDB chalu karo** (local ya Atlas). Agar local hai:
   ```bash
   mongod
   ```
   Agar Atlas use kar rahe ho, `.env` me `MONGO_URI` set karo ya `db.js` me
   directly URI daalo.

2. **Dependencies install karo:**
   ```bash
   npm install
   ```

3. **Data ingest karo (ek baar):**
   ```bash
   npm run ingest
   ```
   Ye documents ko chunk karega, embed karega, aur MongoDB me store karega.

4. **Question poocho:**
   ```bash
   node index.js "mera order kab aayega"
   node index.js "return policy kya hai"
   node index.js "return karne ke liye kitna time milta hai"
   ```

## Important Note — Ye Demo Embedding Hai

`embedding.js` me jo `embed()` function hai wo ek **offline, bina-API-key wali
demo embedding** hai (hashing bag-of-words based) — taaki tum poora system bina
kisi paid API ke turant chala sako.

**Production me** isse replace karoge kisi real embedding model se:
- OpenAI: `text-embedding-3-small`
- Google: `text-embedding-004`
- Free/local: `@xenova/transformers` (all-MiniLM-L6-v2 model)

Baaki poora pipeline (chunking → MongoDB storage → retrieval → generation)
same hi rahega — sirf `embed()` function ke andar ka code badlega. Yahi RAG
architecture ki khoobsurati hai: components alag-alag, swap karna aasan.

Similarly `generate.js` me production me real LLM call hoga (Claude API,
GPT, etc.) retrieved context ke sath prompt banake.
