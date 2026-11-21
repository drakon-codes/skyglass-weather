// Unit conversion + display formatting. API data is always metric; convert at display time.
import type { TemperatureUnit, UnitPreferences, WindUnit } from "@/types/weather";

export const DEFAULT_UNITS: UnitPreferences = { temperature: "celsius", wind: "kmh" };

export const celsiusToFahrenheit = (celsius: number) => (celsius * 9) / 5 + 32;
export const kmhToMph = (kmh: number) => kmh * 0.621371;

export function convertTemperature(celsius: number, unit: TemperatureUnit): number {
  return unit === "fahrenheit" ? celsiusToFahrenheit(celsius) : celsius;
}

export function convertWindSpeed(kmh: number, unit: WindUnit): number {
  return unit === "mph" ? kmhToMph(kmh) : kmh;
}

/** e.g. "22°" — rounded, unit symbol shown by the toggle. */
export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  return `${Math.round(convertTemperature(celsius, unit))}°`;
}

export function formatWindSpeed(kmh: number, unit: WindUnit): string {
  return `${Math.round(convertWindSpeed(kmh, unit))} ${unit === "mph" ? "mph" : "km/h"}`;
}

/** Visibility follows the distance unit implied by the wind unit (km or miles). */
export function formatVisibility(meters: number | null, unit: WindUnit): string {
  if (meters === null) return "—";
  if (unit === "mph") return `${(meters / 1609.344).toFixed(1)} mi`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export const formatPressure = (hPa: number) => `${Math.round(hPa)} hPa`;

export function formatPrecipitation(mm: number, unit: WindUnit): string {
  if (unit === "mph") return `${(mm / 25.4).toFixed(mm < 1 ? 2 : 1)} in`;
  return `${mm.toFixed(mm < 1 ? 1 : 0)} mm`;
}

export function airQualityLabel(aqi: number | null | undefined): string {
  if (aqi == null) return "Unavailable";
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Sensitive";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very unhealthy";
  return "Hazardous";
}

const COMPASS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
export function windDirectionLabel(degrees: number): string {
  return COMPASS[Math.round((((degrees % 360) + 360) % 360) / 45) % 8] ?? "N";
}

export function uvIndexLabel(uv: number | null): string {
  if (uv === null) return "—";
  if (uv < 3) return "Low";
  if (uv < 6) return "Moderate";
  if (uv < 8) return "High";
  if (uv < 11) return "Very high";
  return "Extreme";
}

export function isUnitPreferences(value: unknown): value is UnitPreferences {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    (v["temperature"] === "celsius" || v["temperature"] === "fahrenheit") &&
    (v["wind"] === "kmh" || v["wind"] === "mph")
  );
}
