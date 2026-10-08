import { streamText, UIMessage, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";
import { searchDocuments } from "@/lib/search";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const lastMessage = messages[messages.length - 1];
    const userQuery =
      lastMessage?.parts?.find((p) => p.type === "text")?.text || "";

    let systemPrompt = "You are a helpful assistant.";

    if (userQuery) {
      const relevantDocs = await searchDocuments(userQuery, 5, 0.3);

      if (relevantDocs.length > 0) {
        const context = relevantDocs.map((doc) => doc.content).join("\n\n");

        systemPrompt = `You are a helpful assistant. Use the following context from the uploaded documents to answer the user's question. If the answer is not in the context, say so. 
        Context: ${context}
        Answer the user's question based on this context.`;
      }
    }

    const result = streamText({
      model: google("gemini-3.8-flash"),
      messages: convertToModelMessages(messages),
      system: systemPrompt,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error in chat route:", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
