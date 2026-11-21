import type { LucideIcon } from "lucide-react";

interface WeatherStatProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
}

/** One labelled metric tile (humidity, wind, …). Render inside a <dl>. */
export function WeatherStat({ icon: Icon, label, value, hint }: WeatherStatProps) {
  return (
    <div className="rounded-2xl bg-glass-strong/60 p-3 transition-transform hover:-translate-y-0.5">
      <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon className="size-3.5" aria-hidden />
        {label}
      </dt>
      <dd className="mt-1 font-display text-base font-semibold">
        {value}
        {hint && <span className="ml-1.5 text-xs font-medium text-muted-foreground">{hint}</span>}
      </dd>
    </div>
  );
}
