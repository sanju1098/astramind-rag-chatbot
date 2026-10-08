import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  innerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <section className={className}>
      <div
        className={cn(
          "container mx-auto px-4 py-12 sm:px-6 md:py-16 lg:px-8",
          innerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
