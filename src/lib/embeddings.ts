import { embedMany } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

const model = google.textEmbeddingModel("gemini-embedding-001");
const BATCH_SIZE = 90; // stay under the 100/min free-tier cap
const WINDOW_MS = 61_000; // wait out the minute between full batches

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const values = texts.map((t) => t.replaceAll("\n", " "));
  const all: number[][] = [];

  for (let i = 0; i < values.length; i += BATCH_SIZE) {
    if (i > 0) await sleep(WINDOW_MS);

    const { embeddings } = await embedMany({
      model,
      values: values.slice(i, i + BATCH_SIZE),
      maxRetries: 5,
      providerOptions: {
        google: {
          outputDimensionality: 1536, // match your vector(N) column
          taskType: "RETRIEVAL_DOCUMENT",
        },
      },
    });
    all.push(...embeddings);
  }

  return all;
}
