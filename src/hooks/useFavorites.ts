// Saved cities, persisted in localStorage.
import { useCallback } from "react";

import { STORAGE_KEYS } from "@/config";
import { isGeoLocationList, toggleFavorite } from "@/lib/location";
import type { GeoLocation } from "@/types/weather";
import { usePersistentState } from "./usePersistentState";

const EMPTY: GeoLocation[] = [];

export function useFavorites() {
  const [favorites, setFavorites] = usePersistentState(
    STORAGE_KEYS.favorites,
    EMPTY,
    isGeoLocationList,
  );

  const isFavorite = useCallback(
    (location: GeoLocation) => favorites.some((f) => f.id === location.id),
    [favorites],
  );
  const toggle = useCallback(
    (location: GeoLocation) => setFavorites((prev) => toggleFavorite(prev, location)),
    [setFavorites],
  );
  const remove = useCallback(
    (id: string) => setFavorites((prev) => prev.filter((f) => f.id !== id)),
    [setFavorites],
  );
  const reorder = useCallback(
    (draggedId: string, targetId: string) =>
      setFavorites((prev) => {
        const from = prev.findIndex((item) => item.id === draggedId);
        const to = prev.findIndex((item) => item.id === targetId);
        if (from < 0 || to < 0 || from === to) return prev;
        const next = [...prev];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        return next;
      }),
    [setFavorites],
  );

  return { favorites, isFavorite, toggle, remove, reorder };
}
