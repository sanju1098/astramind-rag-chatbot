import {
  BookOpenCheck,
  Boxes,
  Code2,
  Cpu,
  Crosshair,
  FileText,
  FlaskConical,
  FolderOpen,
  GraduationCap,
  LucideIcon,
  MessageSquare,
  RefreshCw,
  Search,
  ShieldCheck,
  Target,
  Upload,
  Zap,
} from "lucide-react";

export const demos = [
  {
    file: "contract.pdf",
    q: "What is the termination notice period?",
    a: "Either party can terminate with 30 days of written notice. Termination for cause needs a written breach notice and a 14-day cure period.",
  },
  {
    file: "research-paper.pdf",
    q: "What were the main findings?",
    a: "The treatment group improved on every primary measure. The effect was strongest in the first eight weeks and held through follow-up.",
  },
  {
    file: "biology-notes.pdf",
    q: "Explain photosynthesis in simple terms.",
    a: "Plants use sunlight to turn water and carbon dioxide into sugar for energy, and release oxygen as a by-product.",
  },
];

export const stats: {
  end: number;
  suffix: string;
  label: string;
  icon: LucideIcon;
}[] = [
  { end: 10, suffix: " MB", label: "Maximum file size", icon: FileText },
  { end: 1536, suffix: "", label: "Embedding dimensions", icon: Boxes },
  { end: 5, suffix: "", label: "Top matches per query", icon: Target },
  { end: 3, suffix: "", label: "Steps to first answer", icon: Zap },
];

export const steps: { title: string; text: string; icon: LucideIcon }[] = [
  {
    icon: Upload,
    title: "Upload documents",
    text: "Add PDFs up to 10 MB. Text is extracted automatically.",
  },
  {
    icon: Cpu,
    title: "AI processing",
    text: "Content is chunked and converted to vector embeddings for semantic search.",
  },
  {
    icon: MessageSquare,
    title: "Ask questions",
    text: "Chat naturally and get answers grounded in your uploaded content.",
  },
];

export const features: { title: string; text: string; icon: LucideIcon }[] = [
  {
    icon: Search,
    title: "Semantic search",
    text: "Find information by meaning, not just keywords.",
  },
  {
    icon: Boxes,
    title: "Vector embeddings",
    text: "1536-dimensional Gemini embeddings for semantic passage matching.",
  },
  {
    icon: MessageSquare,
    title: "Real-time responses",
    text: "Streaming answers for a smooth conversational experience.",
  },
  {
    icon: FolderOpen,
    title: "Document management",
    text: "Upload, list, and delete your PDFs from one page.",
  },
  {
    icon: ShieldCheck,
    title: "Shared Neon document library",
    text: "Documents uploaded to this deployment are stored in Neon and shared with its users.",
  },
  {
    icon: Code2,
    title: "Built on Next.js",
    text: "Server actions for uploads and a streaming API route for chat.",
  },
];

export const capabilities: { title: string; text: string; icon: LucideIcon }[] =
  [
    {
      icon: BookOpenCheck,
      title: "Grounded responses",
      text: "Relevant passages from your documents are added to the prompt before the AI answers.",
    },
    {
      icon: RefreshCw,
      title: "Add documents anytime",
      text: "New uploads are searchable in chat as soon as processing finishes.",
    },
    {
      icon: Crosshair,
      title: "Precise retrieval",
      text: "Similarity search surfaces the most relevant passages before the AI answers.",
    },
  ];

export const useCases: { title: string; text: string; icon: LucideIcon }[] = [
  {
    icon: FlaskConical,
    title: "Research papers",
    text: "Ask questions about findings and methods in your papers.",
  },
  {
    icon: FileText,
    title: "Product documentation",
    text: "Find answers across guides, manuals, and reference PDFs.",
  },
  {
    icon: GraduationCap,
    title: "Course materials",
    text: "Review textbooks and notes with document-grounded answers.",
  },
];

export const quickStartContent = [
  "Open the Upload page",
  "Drag and drop your PDF or click to browse",
  "Wait for processing to finish",
  "Head to Chat and start asking",
];
