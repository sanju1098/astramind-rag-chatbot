"use client";

import { Fragment, useState } from "react";
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
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  //   PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";
import { Loader } from "@/components/ai-elements/loader";

export default function RAGChatBot() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text) {
      return;
    }
    sendMessage({
      text: message.text,
    });
    setInput("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-[calc(100vh-4rem)]">
      <div className="flex flex-col h-full">
        <Conversation className="h-full">
          <ConversationContent>
            {messages.map((message) => (
              <div key={message.id}>
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <Fragment key={`${message.id}-${i}`}>
                          <Message from={message.role}>
                            <MessageContent>
                              <Response>{part.text}</Response>
                            </MessageContent>
                          </Message>
                        </Fragment>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            ))}
            {(status === "submitted" || status === "streaming") && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput onSubmit={handleSubmit}>
          <div className="relative flex items-center w-full mt-4">
            <PromptInputBody className="flex-1">
              <PromptInputTextarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What would you like to know?"
                className="
          w-full resize-none rounded-2xl border border-gray-300 dark:border-gray-700
          bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
          px-4 py-3 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-blue-500
          shadow-sm transition-all duration-200
        "
              />
            </PromptInputBody>

            <PromptInputSubmit
              className="
              absolute right-2 h-9 w-9 flex items-center justify-center rounded-xl
            text-white shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
            "
              disabled={!input && !status}
              status={status}
            />
          </div>
        </PromptInput>
      </div>
    </div>
  );
}
