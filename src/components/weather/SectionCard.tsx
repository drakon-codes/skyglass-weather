import { useId, type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Glass panel with an accessible heading; used for every dashboard section. */
export function SectionCard({ title, action, children, className }: SectionCardProps) {
  const headingId = useId();
  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "glass rounded-3xl p-4 sm:p-6 animate-in fade-in slide-in-from-bottom-2 duration-500",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 id={headingId} className="text-base font-semibold tracking-tight">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}
