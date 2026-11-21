import { CloudOff, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title = "Couldn't load the weather", message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="glass flex flex-col items-center gap-3 rounded-3xl px-6 py-12 text-center animate-in fade-in"
    >
      <span className="grid size-14 place-items-center rounded-full bg-glass-strong">
        <CloudOff className="size-7 text-destructive" aria-hidden />
      </span>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} size="pill" className="mt-2">
          <RotateCw /> Try again
        </Button>
      )}
    </div>
  );
}
