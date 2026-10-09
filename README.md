# AstraMind

A chat app for your PDFs. Upload a document, and AstraMind answers questions from it using retrieval-augmented generation (RAG).

## How it works

1. **Upload**: a PDF (up to 10 MB) is parsed, the text is split into chunks, and each chunk is converted into a 1536-dimension embedding with Gemini.
2. **Store**: chunks and embeddings are saved in Neon, and file metadata goes in a separate `files` table.
3. **Ask**: your question is embedded and matched against stored chunks using cosine similarity. The top 5 chunks (similarity above 0.3) are added to the system prompt, and the model streams its answer.

If no chunk passes the threshold, the model answers without document context.

<img width="4731" height="6133" alt="diagram" src="https://github.com/user-attachments/assets/09ee1a54-349d-4334-8e98-d3658d5540d8" />

## Features

- Streaming chat with Google Gemini through the Vercel AI SDK
- PDF upload with text extraction, chunking, and embedding
- Vector similarity search with an HNSW index (cosine distance)
- Document library with pagination (5 per page) and delete
- Deleting a file also removes its chunks and embeddings (cascade)
- Home, About, Privacy Policy, and Terms of Use pages

## Tech stack

| Layer          | Tool                                                                 |
| -------------- | -------------------------------------------------------------------- |
| Framework      | Next.js 16 (App Router, server actions), React 19                    |
| UI             | Tailwind CSS, shadcn/ui (Radix UI), AI Elements, Lucide, react-icons |
| AI             | Vercel AI SDK, Google Gemini (chat and `gemini-embedding-001`)       |
| Database       | Neon with the pgvector extension                                     |
| ORM            | Drizzle ORM, Neon serverless driver                                  |
| PDF processing | pdf2json, LangChain text splitters                                   |

## Prerequisites

- Node.js 20 or higher
- npm, yarn, pnpm, or bun
- A [Neon](https://neon.tech) database
- A [Google AI Studio](https://aistudio.google.com/app/apikey) API key

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/sanju1098/astramind-rag-chatbot.git
cd rag-chatbot
npm install
```

### 2. Environment variables

Create `.env.local` in the project root:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key
NEON_DATABASE_URL=your_neon_connection_string
```

| Variable                       | Where to get it                                            |
| ------------------------------ | ---------------------------------------------------------- |
| `GOOGLE_GENERATIVE_AI_API_KEY` | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `NEON_DATABASE_URL`            | Neon dashboard, project, connection string                 |

### 3. Run migrations

Run the committed migrations before starting the app, or uploads and the library page will fail. The migrations enable the pgvector extension and create the required tables and index.

```bash
npx drizzle-kit migrate
```

This creates:

| Table       | Purpose                                                                             |
| ----------- | ----------------------------------------------------------------------------------- |
| `files`     | Name, type, size, chunk count, upload time                                          |
| `documents` | Chunk text, 1536-dimension embedding, `file_id` (cascade delete), HNSW cosine index |

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

| Route      | Description                            |
| ---------- | -------------------------------------- |
| `/`        | Landing page                           |
| `/upload`  | Upload PDFs, view and delete documents |
| `/chat`    | Ask questions about your documents     |
| `/about`   | How it works, stack, limits            |
| `/privacy` | Privacy Policy                         |
| `/terms`   | Terms of Use                           |

---
Issues and pull requests are welcome on [GitHub](https://github.com/sanju1098/astramind-rag-chatbot).
