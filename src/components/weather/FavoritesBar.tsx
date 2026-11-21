// Horizontal list of saved cities. Click to view, ✕ to remove.
import { Star, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { GeoLocation } from "@/types/weather";

interface FavoritesBarProps {
  favorites: GeoLocation[];
  activeId: string;
  onSelect: (location: GeoLocation) => void;
  onRemove: (id: string) => void;
}

export function FavoritesBar({ favorites, activeId, onSelect, onRemove }: FavoritesBarProps) {
  return (
    <nav aria-label="Saved cities" className="flex items-center gap-3 overflow-x-auto pb-1">
      <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground/80">
        <Star className="size-3.5 fill-favorite text-favorite" aria-hidden />
        Saved
      </span>

      {favorites.length === 0 ? (
        <p className="glass rounded-full px-4 py-1.5 text-sm text-muted-foreground">
          Tap the star on a city to save it here.
        </p>
      ) : (
        <ul className="flex gap-2">
          {favorites.map((city) => {
            const active = city.id === activeId;
            return (
              <li
                key={city.id}
                className={cn(
                  "flex shrink-0 items-center rounded-full text-sm transition-colors animate-in fade-in zoom-in-95",
                  active ? "bg-primary text-primary-foreground" : "glass hover:bg-glass-strong",
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelect(city)}
                  aria-current={active ? "true" : undefined}
                  className="rounded-full py-1.5 pl-4 pr-2 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {city.name}
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(city.id)}
                  aria-label={`Remove ${city.name} from saved cities`}
                  className="mr-1 grid size-7 place-items-center rounded-full opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="size-3.5" aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
}
