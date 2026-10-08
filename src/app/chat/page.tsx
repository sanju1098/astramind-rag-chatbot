"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";
import { Loader } from "@/components/ai-elements/loader";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function RAGChatBot() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat();

  const busy = status === "submitted" || status === "streaming";

  const handleSubmit = (message: PromptInputMessage) => {
    const text = message.text?.trim();
    if (!text || busy) return;
    sendMessage({ text });
    setInput("");
  };

  return (
    <div className="container mx-auto h-[calc(100dvh-4rem)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex h-full max-w-4xl flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between border-b bg-muted/40 px-4 py-3 sm:px-5">
          <h1 className="text-sm font-medium">Chat</h1>
          <p className="text-xs text-muted-foreground">
            Answers use your uploaded documents when they are relevant
          </p>
        </header>

        {/* Messages */}
        <Conversation className="min-h-0 flex-1">
          <ConversationContent className="gap-4 p-4 sm:p-5">
            {messages.length === 0 && (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Ask a question about your documents to get started.
              </p>
            )}

            {messages.map((message) => {
              const text = message.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join("");
              if (!text) return null;

              return (
                <Message key={message.id} from={message.role}>
                  <MessageContent
                    className={
                      message.role === "user"
                        ? "group-[.is-user]:rounded-2xl group-[.is-user]:rounded-br-sm group-[.is-user]:bg-primary group-[.is-user]:px-4 group-[.is-user]:py-2.5 group-[.is-user]:text-primary-foreground"
                        : "rounded-2xl rounded-bl-sm border bg-background px-4 py-3 leading-relaxed"
                    }
                  >
                    <Response>{text}</Response>
                  </MessageContent>
                </Message>
              );
            })}

            {status === "submitted" && <Loader />}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {error.message || "Failed to send message. Please try again."}
                </AlertDescription>
              </Alert>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* Input */}
        <div className="shrink-0 border-t p-3 sm:p-4">
          <PromptInput
            onSubmit={handleSubmit}
            className="rounded-lg border bg-muted/50 shadow-none"
          >
            <PromptInputBody>
              <PromptInputTextarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What would you like to know?"
                className="min-h-14 resize-none bg-transparent px-4 py-3 text-sm sm:text-base"
              />
            </PromptInputBody>
            <PromptInputFooter className="flex items-center justify-end px-3 pb-3">
              <PromptInputSubmit
                status={status}
                disabled={!busy && !input.trim()}
                className="h-10 w-10 rounded-lg"
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}
