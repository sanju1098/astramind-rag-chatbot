-- Drop existing index
DROP INDEX IF EXISTS "embeddingIndex";

-- Drop and recreate the table with new dimensions
DROP TABLE IF EXISTS "documents";

CREATE TABLE IF NOT EXISTS "documents" (
  "id" serial PRIMARY KEY,
  "content" text NOT NULL,
  "embedding" vector(768)
);

-- Recreate the index
CREATE INDEX IF NOT EXISTS "embeddingIndex" ON "documents" USING hnsw ("embedding" vector_cosine_ops);