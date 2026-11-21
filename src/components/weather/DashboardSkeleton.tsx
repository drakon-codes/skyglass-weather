import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder that mirrors the dashboard layout while the forecast loads. */
export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3" aria-busy="true" aria-label="Loading weather">
      <div className="glass space-y-5 rounded-3xl p-6">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-28" />
        <div className="flex items-center gap-4">
          <Skeleton className="size-20 rounded-full" />
          <Skeleton className="h-16 w-28" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="h-16 rounded-2xl" />
          ))}
        </div>
      </div>
      <div className="glass space-y-4 rounded-3xl p-6 lg:col-span-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
      <div className="glass grid gap-2 rounded-3xl p-6 sm:grid-cols-4 lg:col-span-3 lg:grid-cols-7">
        {Array.from({ length: 7 }, (_, i) => (
          <Skeleton key={i} className="h-14 rounded-2xl sm:h-36" />
        ))}
      </div>
    </div>
  );
}
