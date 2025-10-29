import { embed, embedMany } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google"; // ✅ add this import

// Create provider instance
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

export async function generateEmbedding(text: string): Promise<number[]> {
  const input = text.replaceAll("\n", " ");

  const { embedding } = await embed({
    model: google.textEmbeddingModel("text-embedding-004"), // ✅ note change here
    value: input,
  });

  return embedding;
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const inputs = texts.map((t) => t.replaceAll("\n", " "));

  const { embeddings } = await embedMany({
    model: google.textEmbeddingModel("text-embedding-004"),
    values: inputs,
  });

  return embeddings;
}
