// Helpers for building and describing GeoLocation objects.
import type { GeocodingResult, GeoLocation } from "@/types/weather";

export function fromGeocodingResult(result: GeocodingResult): GeoLocation {
  return {
    id: String(result.id),
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    ...(result.admin1 ? { admin1: result.admin1 } : {}),
    ...(result.country ? { country: result.country } : {}),
  };
}

export function fromCoordinates(latitude: number, longitude: number): GeoLocation {
  return {
    id: `gps:${latitude.toFixed(3)},${longitude.toFixed(3)}`,
    name: "My location",
    latitude,
    longitude,
  };
}

/** "Tamil Nadu, India" — region line under the city name. */
export function formatRegion(location: Pick<GeoLocation, "admin1" | "country">): string {
  return [location.admin1, location.country].filter(Boolean).join(", ");
}

export function isGeoLocation(value: unknown): value is GeoLocation {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v["id"] === "string" &&
    typeof v["name"] === "string" &&
    typeof v["latitude"] === "number" &&
    typeof v["longitude"] === "number"
  );
}

export function isGeoLocationList(value: unknown): value is GeoLocation[] {
  return Array.isArray(value) && value.every(isGeoLocation);
}

/** Adds the location if missing, removes it if already saved. */
export function toggleFavorite(favorites: GeoLocation[], location: GeoLocation): GeoLocation[] {
  return favorites.some((f) => f.id === location.id)
    ? favorites.filter((f) => f.id !== location.id)
    : [...favorites, location];
}
