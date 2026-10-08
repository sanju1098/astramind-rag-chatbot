import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

type Direction = "up" | "left" | "right";

const hidden: Record<Direction, string> = {
  up: "translate-y-6",
  left: "-translate-x-6",
  right: "translate-x-6",
};

export function Reveal({
  children,
  delay = 0,
  direction = "up",
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : undefined }}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-out",
        "motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
        shown
          ? "translate-x-0 translate-y-0 opacity-100"
          : cn("opacity-0", hidden[direction]),
        className,
      )}
    >
      {children}
    </div>
  );
}
