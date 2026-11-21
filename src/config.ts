// Central app configuration. Swap API base URLs or tweak behaviour here.
import type { GeoLocation } from "@/types/weather";

export const API_CONFIG = {
  /** Open-Meteo geocoding (city search). */
  geocodingBaseUrl: "https://geocoding-api.open-meteo.com/v1",
  /** Nominatim fills smaller-place gaps that may be absent from the primary geocoder. */
  placeSearchBaseUrl: "https://nominatim.openstreetmap.org",
  /** Open-Meteo forecast. */
  forecastBaseUrl: "https://api.open-meteo.com/v1",
  airQualityBaseUrl: "https://air-quality-api.open-meteo.com/v1",
  reverseGeocodingBaseUrl: "https://nominatim.openstreetmap.org",
} as const;

export const APP_CONFIG = {
  appName: "Nimbus",
  searchDebounceMs: 300,
  searchMinChars: 2,
  searchResultLimit: 12,
  forecastDays: 7,
  hourlyHours: 24,
  /** How long fetched forecasts are considered fresh. */
  forecastStaleTimeMs: 10 * 60 * 1000,
  geolocationTimeoutMs: 10_000,
} as const;

/** Shown on first visit, before the user picks a city. */
export const DEFAULT_LOCATION: GeoLocation = {
  id: "2643743",
  name: "London",
  admin1: "England",
  country: "United Kingdom",
  latitude: 51.50853,
  longitude: -0.12574,
};

export const STORAGE_KEYS = {
  units: "nimbus.units",
  favorites: "nimbus.favorites",
  theme: "nimbus.theme",
  lastLocation: "nimbus.lastLocation",
} as const;
