import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AstraMind - Chat with your PDFs",
    template: "%s | AstraMind",
  },
  description:
    "Upload PDFs and ask questions answered with relevant passages from your documents using Gemini-powered retrieval-augmented generation.",
  keywords: [
    "AI",
    "Knowledge Base",
    "RAG",
    "Retrieval Augmented Generation",
    "Chatbot",
    "Document Search",
    "PDF Upload",
    "AI Assistant",
  ],
  authors: [{ name: "AstraMind Team" }],
  creator: "AstraMind",
  publisher: "AstraMind",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
