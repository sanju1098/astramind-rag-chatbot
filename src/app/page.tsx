"use client";

import Link from "next/link";
import { MessageSquare, Upload } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { Section } from "@/components/Section";
import { ChatDemo } from "@/components/ChatDemo";
import { SectionHeading } from "@/components/SectionHeading";
import { IconTile } from "@/components/IconTile";
import { capabilities, features, stats, steps, useCases } from "@/content";
import { QuickStart } from "@/components/QuickStart";

const cardHover =
  "group h-full transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md";

export default function Home() {
  return (
    <main className="flex flex-col">
      {/* Hero */}
      <Section innerClassName="lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-6 text-center lg:text-left">
            <Reveal delay={100}>
              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl xl:text-6xl">
                Transform documents into
                <span className="mt-1 block text-primary">
                  intelligent conversations
                </span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
                AstraMind uses retrieval-augmented generation to make your PDFs
                searchable and answer questions using relevant passages from
                your documents.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="shadow-lg transition-shadow hover:shadow-xl"
                >
                  <Link href="/chat">
                    <MessageSquare />
                    Start Chatting
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/upload">
                    <Upload />
                    Upload Documents
                  </Link>
                </Button>
              </div>
            </Reveal>
            <Reveal delay={400}>
              <p className="text-sm text-muted-foreground">
                Built on Google Gemini embeddings and Neon
              </p>
            </Reveal>
          </div>

          <Reveal direction="right" delay={200}>
            <ChatDemo />
          </Reveal>
        </div>
      </Section>

      {/* Stats */}
      <section className="container mx-auto px-4 pb-12 sm:px-6 md:pb-16 lg:px-8">
        <Reveal>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col-reverse items-center bg-card p-6 text-center transition-colors hover:bg-accent"
              >
                <dt className="mt-1 text-sm text-muted-foreground">
                  {s.label}
                </dt>
                <dd className="flex flex-col items-center gap-2 text-3xl font-bold text-primary sm:text-4xl">
                  <s.icon className="size-5 text-muted-foreground" />
                  <CountUp end={s.end} suffix={s.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* How it works */}
      <Section className="border-y bg-muted/40">
        <SectionHeading
          title="How it works"
          text="Three steps to unlock the power of your documents"
        />
        <ol className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 120} className="h-full">
                <Card className={cn(cardHover, "border-2 hover:shadow-lg")}>
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                      <IconTile icon={s.icon} />
                      <span className="text-sm font-semibold tracking-widest text-primary">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{s.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {s.text}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      {/* Features */}
      <Section>
        <SectionHeading
          title="Powerful features"
          text="Everything you need for intelligent document management"
        />
        <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 100} className="h-full">
              <Card className={cardHover}>
                <CardHeader className="space-y-3">
                  <IconTile icon={f.icon} />
                  <CardTitle className="text-lg">{f.title}</CardTitle>
                  <CardDescription className="text-base">
                    {f.text}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Capabilities + quick start */}
      <Section className="border-y bg-muted/40">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="space-y-6">
            <Reveal direction="left">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                Advanced capabilities
              </h2>
            </Reveal>
            {capabilities.map((c, i) => (
              <Reveal key={c.title} direction="left" delay={(i + 1) * 120}>
                <div className="border-l-2 border-primary pl-4">
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <c.icon className="size-5 text-primary" />
                    {c.title}
                  </h3>
                  <p className="mt-1 leading-relaxed text-muted-foreground">
                    {c.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal direction="right" delay={150}>
            <Card className="card-content-bg border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">
                  Ready to get started?
                </CardTitle>
                <CardDescription className="text-base text-foreground/70">
                  Build your knowledge base in minutes
                </CardDescription>
              </CardHeader>
              <QuickStart />
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* Use cases */}
      <Section>
        <SectionHeading
          title="Explore your documents"
          text="Ask questions about research papers, product guides, and course materials"
        />
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {useCases.map((u, i) => (
            <Reveal key={u.title} delay={i * 120} className="h-full">
              <Card className={cn(cardHover, "border-2")}>
                <CardHeader className="space-y-3">
                  <IconTile icon={u.icon} />
                  <CardTitle className="text-lg">{u.title}</CardTitle>
                  <CardDescription className="text-base">
                    {u.text}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-12 sm:px-6 md:pb-16 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-5xl rounded-2xl bg-primary px-6 py-10 text-center text-primary-foreground sm:px-12 md:py-14">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
              Start building your knowledge base today
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-primary-foreground/80 md:text-lg">
              Turn your documents into intelligent, searchable knowledge.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-background text-foreground hover:bg-background/90"
              >
                <Link href="/upload">Get started</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <a
                  href="https://github.com/sanju1098/rag-chatbot"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub />
                  View Source Code
                </a>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
