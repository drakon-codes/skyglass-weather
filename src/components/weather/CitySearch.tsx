// City autocomplete combobox (WAI-ARIA pattern): arrows to move, Enter to pick, Esc to close.
import { Loader2, Search } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

import { APP_CONFIG } from "@/config";
import { useCitySearch } from "@/hooks/useCitySearch";
import { fromGeocodingResult } from "@/lib/location";
import type { GeocodingResult, GeoLocation } from "@/types/weather";
import { CitySearchResults } from "./CitySearchResults";

export function CitySearch({ onSelect }: { onSelect: (location: GeoLocation) => void }) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const listId = useId();

  const { data, isPending, isError, refetch } = useCitySearch(text);
  const results = data ?? [];
  const showPanel = open && text.trim().length >= APP_CONFIG.searchMinChars;

  // Reset highlight whenever a new result set arrives.
  useEffect(() => setActiveIndex(-1), [data]);

  const choose = (result: GeocodingResult) => {
    onSelect(fromGeocodingResult(result));
    setText("");
    setOpen(false);
    inputRef.current?.blur();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      const pick = results[activeIndex >= 0 ? activeIndex : 0];
      if (pick && showPanel) {
        e.preventDefault();
        choose(pick);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="relative w-full">
      <label htmlFor={inputId} className="sr-only">
        Search for a city
      </label>
      <Search
        className="pointer-events-none absolute left-4 z-10 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <input
        ref={inputRef}
        id={inputId}
        type="text"
        role="combobox"
        autoComplete="off"
        spellCheck={false}
        placeholder="Search city…"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
        aria-expanded={showPanel}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
        className="glass h-11 w-full rounded-full pl-10 pr-10 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
      />
      {isPending && showPanel && (
        <Loader2
          className="absolute right-4 z-10 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
          aria-hidden
        />
      )}
      {showPanel && (
        <CitySearchResults
          listId={listId}
          query={text.trim()}
          results={results}
          activeIndex={activeIndex}
          isPending={isPending}
          isError={isError}
          onChoose={choose}
          onHover={setActiveIndex}
          onRetry={() => void refetch()}
        />
      )}
    </div>
  );
}
