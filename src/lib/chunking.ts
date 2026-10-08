import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 800,
  chunkOverlap: 200,
  separators: ["\n\n", "\n", ". ", " ", ""],
});

export async function chunkContent(content: string) {
  return await textSplitter.splitText(content.trim());
}
