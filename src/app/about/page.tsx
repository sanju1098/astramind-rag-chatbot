import Link from "next/link";
import type { Metadata } from "next";
import { MessageSquare, Upload } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = { title: "About" };

const steps = [
  {
    title: "Upload",
    text: "Add a PDF up to 10 MB. The text is extracted and split into passages.",
  },
  {
    title: "Embed",
    text: "Each passage is converted into a 1536-dimension embedding and stored in Neon.",
  },
  {
    title: "Ask",
    text: "Your question is matched against the stored passages. The top 5 are sent to the model as context.",
  },
];

const stack = [
  {
    layer: "Framework",
    tool: "Next.js",
    use: "App Router and server actions for uploads",
  },
  { layer: "Chat", tool: "Vercel AI SDK + Gemini", use: "Streaming answers" },
  {
    layer: "Embeddings",
    tool: "Gemini embedding model",
    use: "1536 dimensions per passage",
  },
  {
    layer: "Database",
    tool: "Neon + Drizzle ORM",
    use: "Passages, embeddings, and cosine similarity search",
  },
  {
    layer: "UI",
    tool: "Tailwind CSS + shadcn/ui",
    use: "Components and styling",
  },
];

const limits = [
  "PDF files only, up to 10 MB each",
  "PDFs must contain selectable text. Scanned pages without text are not read.",
  "Answers depend on which passages are retrieved, so they can miss or misread details",
  "There are no user accounts. Uploaded documents are shared across this deployment.",
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 md:py-14 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            About AstraMind
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
            AstraMind is a chat app for your PDFs. It uses retrieval-augmented
            generation (RAG) to find the passages that match your question and
            answer from them.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/chat">
                <MessageSquare />
                Start Chatting
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/upload">
                <Upload />
                Upload Documents
              </Link>
            </Button>
          </div>
        </div>

        {/* How it works */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">How it works</h2>
          <ol className="grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title}>
                <Card className="h-full border-2">
                  <CardHeader className="space-y-2">
                    <span className="text-sm font-semibold tracking-widest text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <CardTitle className="text-lg">{s.title}</CardTitle>
                    <CardDescription className="text-base">
                      {s.text}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </li>
            ))}
          </ol>
        </section>

        {/* Stack */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Built with</h2>
          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-4 sm:px-5">Layer</TableHead>
                  <TableHead>Tool</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Used for
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stack.map((row) => (
                  <TableRow key={row.layer}>
                    <TableCell className="px-4 font-medium sm:px-5">
                      {row.layer}
                    </TableCell>
                    <TableCell>{row.tool}</TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {row.use}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Limits */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Good to know</h2>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            {limits.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
