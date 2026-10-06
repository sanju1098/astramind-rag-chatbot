"use server";

import { db } from "@/lib/db-config";
import { documents, type InsertDocument } from "@/lib/db-schema";
import { chunkContent } from "@/lib/chunking";
import { generateEmbeddings } from "@/lib/embeddings";
import { extractTextFromBuffer } from "@/lib/pdf-utils";

function sanitizeText(text: string): string {
  return text
    .replace(/[\uD800-\uDFFF]/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/\uFFFD/g, '')
    .trim();
}

export async function processPdfFile(formData: FormData) {
  try {
    const file = formData.get("pdf") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const rawText = await extractTextFromBuffer(buffer);
    const text = sanitizeText(rawText);
    console.log("Extracted text length:", text.length);

    if (!text.trim()) {
      return { success: false, error: "No text found in PDF" };
    }

    const chunks = await chunkContent(text);
    const embeddings = await generateEmbeddings(chunks);

    const records: InsertDocument[] = chunks.map((chunk, i) => ({
      content: sanitizeText(chunk),
      embedding: Array.from(embeddings[i]),
    }));

    console.log(`Prepared ${records.length} records for DB insert`);

    await db.insert(documents).values(records);

    return {
      success: true,
      message: `Processed PDF and stored ${records.length} searchable chunks.`,
      records,
    };
  } catch (error) {
    console.error("PDF processing error:", error);
    return {
      success: false,
      error: "Failed to process PDF",
    };
  }
}