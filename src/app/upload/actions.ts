"use server";

import { db } from "@/lib/db-config";
import { documents, type InsertDocument } from "@/lib/db-schema";
import { chunkContent } from "@/lib/chunking";
import { generateEmbeddings } from "@/lib/embeddings";
import { extractTextFromBuffer } from "@/lib/pdf-utils";

export async function processPdfFile(formData: FormData) {
  try {
    const file = formData.get("pdf") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Convert File → Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text
    const text = await extractTextFromBuffer(buffer);
    console.log("Extracted text length:", text.length);

    if (!text.trim()) {
      return { success: false, error: "No text found in PDF" };
    }

    // 1️⃣ Chunk the text
    const chunks = await chunkContent(text);

    // 2️⃣ Generate embeddings
    const embeddings = await generateEmbeddings(chunks);

    // 3️⃣ Prepare DB records (type-safe)
    const records: InsertDocument[] = chunks.map((chunk, i) => ({
      content: chunk,
      embedding: Array.from(embeddings[i]), // Ensure plain number[]
    }));

    console.log(`📦 Prepared ${records.length} records for DB insert`);

    // 4️⃣ Store in database
    await db.insert(documents).values(records);

    return {
      success: true,
      message: `✅ Processed PDF and stored ${records.length} searchable chunks.`,
      records,
    };
  } catch (error) {
    console.error("❌ PDF processing error:", error);
    return {
      success: false,
      error: "Failed to process PDF",
    };
  }
}
