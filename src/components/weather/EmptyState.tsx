import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

/** Friendly placeholder for "nothing here yet" situations. */
export function EmptyState({ icon: Icon, title, description, children, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2 px-4 py-6 text-center", className)}>
      <span className="grid size-11 place-items-center rounded-full bg-glass-strong">
        <Icon className="size-5 text-muted-foreground" aria-hidden />
      </span>
      <p className="font-display text-sm font-semibold">{title}</p>
      {description && <p className="max-w-xs text-sm text-muted-foreground">{description}</p>}
      {children}
    </div>
  );
}
