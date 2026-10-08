import { FileText, Send } from "lucide-react";
import { Card } from "./ui/card";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useState } from "react";
import { demos } from "@/content";
import { cn } from "@/lib/utils";

export function ChatDemo() {
  const [index, setIndex] = useState(0);
  const demo = demos[index];
  const answer = useTypewriter(demo.a);

  return (
    <Card className="gap-0 overflow-hidden border-2 p-0 shadow-xl">
      <div className="flex items-center justify-between border-b bg-muted/50 px-5 py-3">
        <span className="text-sm font-medium">Example conversation</span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <FileText className="size-3.5" />
          {demo.file}
        </span>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex flex-wrap gap-2" role="tablist">
          {demos.map((d, i) => (
            <button
              key={d.file}
              type="button"
              role="tab"
              aria-selected={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                "rounded-md border px-3 py-1 text-xs font-medium transition-colors",
                i === index
                  ? "border-primary bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {d.file.replace(".pdf", "")}
            </button>
          ))}
        </div>

        <div className="min-h-32 space-y-4">
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
              {demo.q}
            </div>
          </div>
          <div className="flex">
            <div className="max-w-[90%] rounded-2xl rounded-bl-sm border bg-card px-4 py-2.5 text-sm leading-relaxed">
              {answer}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border bg-muted/50 px-4 py-2.5 text-sm text-muted-foreground">
          Ask a question about your documents
          <Send className="size-4" />
        </div>
      </div>
    </Card>
  );
}
