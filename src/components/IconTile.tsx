import { LucideIcon } from "lucide-react";

export function IconTile({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
      <Icon className="size-5" />
    </span>
  );
}
