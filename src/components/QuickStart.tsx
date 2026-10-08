import { quickStartContent } from "@/content";
import { cn } from "@/lib/utils";
import { Check, Upload } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";

export function QuickStart() {
  const [done, setDone] = useState<boolean[]>(() =>
    quickStartContent.map(() => false),
  );

  const toggle = (i: number) =>
    setDone((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  return (
    <div className="space-y-5 px-6 pb-6">
      <ol className="space-y-1 text-sm text-foreground/90">
        {quickStartContent.map((q, i) => (
          <li key={q}>
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-pressed={done[i]}
              className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-accent"
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  done[i]
                    ? "bg-primary text-primary-foreground"
                    : "border border-primary text-primary",
                )}
              >
                {done[i] ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span
                className={cn(done[i] && "text-muted-foreground line-through")}
              >
                {q}
              </span>
            </button>
          </li>
        ))}
      </ol>
      <Button asChild className="w-full" size="lg">
        <Link href="/upload">
          <Upload />
          Upload Your First Document
        </Link>
      </Button>
    </div>
  );
}
