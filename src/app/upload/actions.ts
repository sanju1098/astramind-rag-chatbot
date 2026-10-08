"use server";

import { db } from "@/lib/db-config";
import {
  documents,
  files,
  type InsertDocument,
  type InsertFile,
} from "@/lib/db-schema";
import { chunkContent } from "@/lib/chunking";
import { generateEmbeddings } from "@/lib/embeddings";
import { extractTextFromBuffer } from "@/lib/pdf-utils";
import { desc, eq } from "drizzle-orm";

function sanitizeText(text: string): string {
  return text
    .replace(/[\uD800-\uDFFF]/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .replace(/\uFFFD/g, "")
    .trim();
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

export async function processPdfFile(formData: FormData) {
  try {
    const file = formData.get("pdf") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Validate file type
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      return { success: false, error: "Only PDF files are allowed" };
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { success: false, error: "File size exceeds 10MB limit" };
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

    // Store file metadata first
    const fileRecord: InsertFile = {
      name: file.name,
      type: file.type || "application/pdf",
      size: file.size,
      chunkCount: chunks.length,
    };

    const [insertedFile] = await db
      .insert(files)
      .values(fileRecord)
      .returning();

    // Store document chunks with file reference
    const records: InsertDocument[] = chunks.map((chunk, i) => ({
      content: sanitizeText(chunk),
      embedding: Array.from(embeddings[i]),
      fileId: insertedFile.id,
    }));

    console.log(`Prepared ${records.length} records for DB insert`);

    await db.insert(documents).values(records);

    return {
      success: true,
      message: `Successfully processed "${file.name}" and stored ${records.length} searchable chunks.`,
      file: {
        id: insertedFile.id,
        name: insertedFile.name,
        type: insertedFile.type,
        size: insertedFile.size,
        formattedSize: formatFileSize(insertedFile.size),
        chunkCount: insertedFile.chunkCount,
        createdAt: insertedFile.createdAt,
      },
    };
  } catch (error) {
    console.error("PDF processing error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process PDF",
    };
  }
}

export async function getUploadedFiles() {
  try {
    const allFiles = await db
      .select()
      .from(files)
      .orderBy(desc(files.createdAt));

    return {
      success: true,
      files: allFiles.map((file) => ({
        ...file,
        formattedSize: formatFileSize(file.size),
      })),
    };
  } catch (error) {
    console.error("Error fetching uploaded files:", error);
    return {
      success: false,
      error: "Failed to fetch uploaded files",
      files: [],
    };
  }
}

export async function deleteUploadedFile(fileId: number) {
  try {
    // Delete will cascade to documents table due to foreign key constraint
    await db.delete(files).where(eq(files.id, fileId));

    return {
      success: true,
      message: "File deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting file:", error);
    return {
      success: false,
      error: "Failed to delete file",
    };
  }
}
