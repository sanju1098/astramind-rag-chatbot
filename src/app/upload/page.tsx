"use client";

import { useCallback, useEffect, useState } from "react";
import {
  processPdfFile,
  getUploadedFiles,
  deleteUploadedFile,
} from "./actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

type UploadedFile = {
  id: number;
  name: string;
  type: string;
  size: number;
  formattedSize: string;
  chunkCount: number;
  createdAt: Date;
};

type Notice = { type: "error" | "success"; text: string };

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

const PAGE_SIZE = 5;

type PageItem = number | "start-ellipsis" | "end-ellipsis";

const getPageItems = (current: number, total: number): PageItem[] => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const items: PageItem[] = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  if (left > 2) items.push("start-ellipsis");
  for (let i = left; i <= right; i++) items.push(i);
  if (right < total - 1) items.push("end-ellipsis");
  items.push(total);

  return items;
};

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/* Shared panel shell, same look as the chat preview and chat page */
function Panel({
  title,
  meta,
  children,
  footer,
}: {
  title: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <header className="flex items-center justify-between gap-3 border-b bg-muted/40 px-4 py-2.5 sm:px-5">
        <h2 className="text-sm font-medium">{title}</h2>
        {meta}
      </header>
      {children}
      {footer}
    </section>
  );
}

export default function PDFUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [page, setPage] = useState(1);

  const fetchUploadedFiles = useCallback(async () => {
    setIsLoadingFiles(true);
    try {
      const result = await getUploadedFiles();
      if (result.success) setUploadedFiles(result.files as UploadedFile[]);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setIsLoadingFiles(false);
    }
  }, []);

  useEffect(() => {
    fetchUploadedFiles();
  }, [fetchUploadedFiles]);

  const handleFileUpload = async (file: File) => {
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setNotice({ type: "error", text: "Please choose a PDF file." });
      return;
    }
    if (file.size > MAX_SIZE) {
      setNotice({ type: "error", text: "That file is larger than 10 MB." });
      return;
    }

    setIsLoading(true);
    setNotice(null);

    try {
      const formData = new FormData();
      formData.append("pdf", file);
      const result = await processPdfFile(formData);

      if (result.success) {
        setNotice({
          type: "success",
          text: result.message || "PDF processed successfully.",
        });
        await fetchUploadedFiles();
        setPage(1);
      } else {
        setNotice({
          type: "error",
          text: result.error || "Failed to process PDF.",
        });
      }
    } catch {
      setNotice({
        type: "error",
        text: "An error occurred while processing the PDF.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
    e.target.value = ""; // allows re-selecting the same file
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    // ignore leave events fired when moving over child elements
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDelete = async (fileId: number) => {
    try {
      const result = await deleteUploadedFile(fileId);
      if (result.success) {
        setNotice({ type: "success", text: "File deleted." });
        await fetchUploadedFiles();
      } else {
        setNotice({
          type: "error",
          text: result.error || "Failed to delete file.",
        });
      }
    } catch {
      setNotice({
        type: "error",
        text: "An error occurred while deleting the file.",
      });
    }
  };

  const totalChunks = uploadedFiles.reduce((acc, f) => acc + f.chunkCount, 0);

  const totalPages = Math.max(1, Math.ceil(uploadedFiles.length / PAGE_SIZE));
  const paginatedFiles = uploadedFiles.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 md:py-14 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Upload documents
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
            Add a PDF and it becomes searchable in chat.
          </p>
        </div>

        {/* Upload */}
        <Panel
          title="Upload a PDF"
          meta={
            <span className="font-mono text-xs text-muted-foreground">
              PDF, up to 10 MB
            </span>
          }
        >
          <div className="space-y-4 p-4 sm:p-5">
            <Label
              htmlFor="pdf-upload"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border border-dashed px-6 py-12 text-center transition-colors md:py-16",
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50",
                isLoading && "pointer-events-none opacity-50",
              )}
            >
              <div className="space-y-1.5">
                <p className="text-base font-medium md:text-lg">
                  {isDragActive
                    ? "Drop your PDF here"
                    : "Choose a file or drag it here"}
                </p>
                <p className="text-sm font-normal text-muted-foreground">
                  Text is extracted, split into passages, and embedded
                </p>
              </div>
              <span
                className={cn(
                  "inline-flex h-9 items-center rounded-md border bg-background px-4 text-sm font-medium shadow-xs",
                  isLoading && "opacity-50",
                )}
              >
                Browse files
              </span>
            </Label>
            <Input
              id="pdf-upload"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleInputChange}
              disabled={isLoading}
              className="sr-only"
            />

            {isLoading && (
              <div
                role="status"
                className="flex items-center gap-3 rounded-lg border bg-muted/40 px-4 py-3"
              >
                <div className="size-4 shrink-0 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <div className="text-sm">
                  <p className="font-medium">Processing your PDF</p>
                  <p className="mt-0.5 text-muted-foreground">
                    Extracting text, chunking, and generating embeddings. Large
                    files can take a few minutes.{" "}
                  </p>
                </div>
              </div>
            )}

            {notice && (
              <Alert
                role={notice.type === "error" ? "alert" : "status"}
                variant={notice.type === "error" ? "destructive" : "default"}
                className={cn(
                  notice.type === "success" && "border-primary/30 bg-primary/5",
                )}
              >
                <AlertTitle>
                  {notice.type === "error" ? "Error" : "Done"}
                </AlertTitle>
                <AlertDescription>{notice.text}</AlertDescription>
              </Alert>
            )}
          </div>
        </Panel>

        {/* Documents */}
        <Panel
          title="Uploaded documents"
          meta={
            <div className="flex items-center gap-3">
              {!isLoadingFiles && uploadedFiles.length > 0 && (
                <span className="font-mono text-xs text-muted-foreground">
                  {uploadedFiles.length} file{uploadedFiles.length !== 1 && "s"}
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={fetchUploadedFiles}
                disabled={isLoadingFiles}
              >
                {isLoadingFiles ? "Refreshing" : "Refresh"}
              </Button>
            </div>
          }
          footer={
            uploadedFiles.length > 0 ? (
              <footer className="flex items-center justify-between border-t bg-muted/40 px-4 py-2.5 text-xs text-muted-foreground sm:px-5">
                <span>
                  Total chunks:{" "}
                  <span className="font-mono text-foreground">
                    {totalChunks.toLocaleString()}
                  </span>
                </span>
              </footer>
            ) : null
          }
        >
          {isLoadingFiles ? (
            <div className="space-y-3 p-4 sm:p-5">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : uploadedFiles.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <h3 className="font-medium">No documents yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Upload your first PDF to start asking questions.
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="px-4 sm:px-5">File name</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Chunks</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Uploaded
                    </TableHead>
                    <TableHead className="px-4 text-right sm:px-5">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedFiles.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="px-4 font-medium sm:px-5">
                        <span className="block max-w-[180px] truncate sm:max-w-xs md:max-w-md">
                          {file.name}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {file.formattedSize}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm tabular-nums">
                        {file.chunkCount}
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                        {formatDate(file.createdAt)}
                      </TableCell>
                      <TableCell className="px-4 text-right sm:px-5">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="max-w-md">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete this file?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                &ldquo;{file.name}&rdquo; and its{" "}
                                {file.chunkCount} chunks and embeddings will be
                                removed. This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(file.id)}
                                className="bg-destructive text-white hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {totalPages > 1 && (
                <div className="border-t px-4 py-3 sm:px-5">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          aria-disabled={page === 1}
                          className={cn(
                            page === 1 && "pointer-events-none opacity-50",
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage((p) => Math.max(1, p - 1));
                          }}
                        />
                      </PaginationItem>

                      {getPageItems(page, totalPages).map((item) =>
                        typeof item === "number" ? (
                          <PaginationItem key={item}>
                            <PaginationLink
                              href="#"
                              isActive={item === page}
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(item);
                              }}
                            >
                              {item}
                            </PaginationLink>
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={item}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ),
                      )}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          aria-disabled={page === totalPages}
                          className={cn(
                            page === totalPages &&
                              "pointer-events-none opacity-50",
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage((p) => Math.min(totalPages, p + 1));
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Panel>
      </div>
    </div>
  );
}
