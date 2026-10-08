import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "AstraMind Privacy Policy - Learn how we collect, use, and protect your data.",
};

const sections: { title: string; body: ReactNode }[] = [
  {
    title: "What AstraMind does",
    body: (
      <p>
        AstraMind lets you upload PDF files and ask questions about them. To do
        that, it extracts the text, splits it into passages, and turns each
        passage into a numeric embedding that can be searched.
      </p>
    ),
  },
  {
    title: "What we store",
    body: (
      <>
        <p>When you upload a PDF, the following is saved in our database:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>File name, type, size, number of passages, and upload time</li>
          <li>The extracted text, split into passages</li>
          <li>An embedding for each passage</li>
        </ul>
        <p>
          The original PDF file is not stored. Chat messages are not saved to
          our database.
        </p>
      </>
    ),
  },
  {
    title: "Who processes your data",
    body: (
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <span className="font-medium text-foreground">
            Google (Gemini API):
          </span>{" "}
          passages are sent to Google to create embeddings when you upload. When
          you ask a question, your message and the most relevant passages are
          sent to Google to generate the answer. Google handles this data under
          its own terms, which depend on the API plan in use.
        </li>
        <li>
          <span className="font-medium text-foreground">Neon:</span> hosts the
          database that holds your passages and embeddings.
        </li>
        <li>
          <span className="font-medium text-foreground">Hosting provider:</span>{" "}
          runs the application and may keep standard server logs.
        </li>
      </ul>
    ),
  },
  {
    title: "No accounts, shared library",
    body: (
      <p>
        AstraMind does not have user accounts. Documents uploaded to this
        deployment are available to everyone who uses it, and anyone can delete
        them. Do not upload confidential, personal, or sensitive documents.
      </p>
    ),
  },
  {
    title: "Retention and deletion",
    body: (
      <p>
        You can delete a file from the Upload page. This removes the file
        record, its passages, and its embeddings from the database. Database
        backups kept by Neon may hold copies for a limited time after deletion.
      </p>
    ),
  },
  {
    title: "Cookies and analytics",
    body: (
      <p>
        AstraMind does not set its own cookies and does not run analytics. Your
        hosting provider may collect basic technical data such as IP address and
        request logs.
      </p>
    ),
  },
  {
    title: "Changes",
    body: (
      <p>
        We may update this policy as the app changes. The date at the top shows
        when it was last revised.
      </p>
    ),
  },
  {
    title: "Contact",
    body: (
      <p>
        Questions about this policy? Open an issue on{" "}
        <a
          href="https://github.com/sanju1098/astramind-rag-chatbot/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline underline-offset-4"
        >
          GitHub
        </a>
        .
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 md:py-14 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-base text-muted-foreground md:text-lg">
            What AstraMind stores, who processes it, and how to remove it.
          </p>
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            Last updated: 8 October 2026
          </p>
        </div>

        <div className="divide-y rounded-xl border bg-card shadow-sm">
          {sections.map((s) => (
            <section key={s.title} className="space-y-2 p-4 sm:p-5">
              <h2 className="text-base font-medium">{s.title}</h2>
              <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
