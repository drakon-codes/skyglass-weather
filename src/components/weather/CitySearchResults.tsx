// Dropdown panel for CitySearch: results, loading, error and "no results" states.
import { MapPin, SearchX } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { formatRegion } from "@/lib/location";
import { cn } from "@/lib/utils";
import type { GeocodingResult } from "@/types/weather";
import { EmptyState } from "./EmptyState";

interface CitySearchResultsProps {
  listId: string;
  query: string;
  results: GeocodingResult[];
  activeIndex: number;
  isPending: boolean;
  isError: boolean;
  onChoose: (result: GeocodingResult) => void;
  onHover: (index: number) => void;
  onRetry: () => void;
}

export function CitySearchResults(props: CitySearchResultsProps) {
  const { listId, query, results, activeIndex, isPending, isError, onChoose, onHover, onRetry } =
    props;

  return (
    <div
      // Keep focus in the input when clicking inside the panel.
      onMouseDown={(e) => e.preventDefault()}
      className="glass-strong absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl p-1.5 animate-in fade-in slide-in-from-top-1 duration-200"
    >
      {isError ? (
        <div role="alert" className="flex items-center justify-between gap-3 p-3 text-sm">
          <span>Couldn't search cities.</span>
          <button type="button" onClick={onRetry} className="font-semibold text-primary underline">
            Retry
          </button>
        </div>
      ) : results.length === 0 && isPending ? (
        <div className="space-y-2 p-2" aria-live="polite" aria-label="Searching">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-9 w-full rounded-xl" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title={`No cities match “${query}”`}
          description="Check the spelling or try a nearby larger city."
          className="py-4"
        />
      ) : null}

      <ul
        id={listId}
        role="listbox"
        aria-label="City suggestions"
        className={cn(results.length === 0 && "hidden")}
      >
        {results.map((result, index) => (
          <li
            key={result.id}
            id={`${listId}-${index}`}
            role="option"
            aria-selected={index === activeIndex}
            onClick={() => onChoose(result)}
            onMouseEnter={() => onHover(index)}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
              index === activeIndex && "bg-primary text-primary-foreground",
            )}
          >
            <MapPin className="size-4 shrink-0 opacity-70" aria-hidden />
            <span className="min-w-0 flex-1 truncate">
              <span className="font-semibold">{result.name}</span>
              <span className={cn("ml-2", index !== activeIndex && "text-muted-foreground")}>
                {formatRegion(result)}
              </span>
            </span>
            {result.country_code && (
              <span className="text-xs font-semibold opacity-70">{result.country_code}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
