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

  return { favorites, isFavorite, toggle, remove };
}
