// All network calls to Open-Meteo live here. Components never call fetch directly.
import { API_CONFIG, APP_CONFIG } from "@/config";
import type {
  ForecastResponse,
  GeocodingResponse,
  GeocodingResult,
  OpenMeteoErrorResponse,
} from "@/types/weather";

export class WeatherApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "WeatherApiError";
  }
}

const CURRENT_FIELDS = [
  "temperature_2m",
  "apparent_temperature",
  "relative_humidity_2m",
  "is_day",
  "weather_code",
  "wind_speed_10m",
  "wind_direction_10m",
  "pressure_msl",
  "uv_index",
  "visibility",
];
const HOURLY_FIELDS = ["temperature_2m", "precipitation_probability", "weather_code", "is_day"];
const DAILY_FIELDS = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "precipitation_probability_max",
  "sunrise",
  "sunset",
  "uv_index_max",
];

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, { signal: signal ?? null });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new WeatherApiError("Network error. Check your connection and try again.");
  }
  const body = (await response.json().catch(() => null)) as T | OpenMeteoErrorResponse | null;
  if (!response.ok || body === null || (typeof body === "object" && "error" in body)) {
    const reason =
      body && typeof body === "object" && "reason" in body ? body.reason : response.statusText;
    throw new WeatherApiError(reason || "Weather service unavailable", response.status);
  }
  return body as T;
}

/** Search cities by name for autocomplete. Returns [] when nothing matches. */
export async function searchCities(query: string, signal?: AbortSignal): Promise<GeocodingResult[]> {
  const params = new URLSearchParams({
    name: query,
    count: String(APP_CONFIG.searchResultLimit),
    language: "en",
    format: "json",
  });
  const data = await getJson<GeocodingResponse>(
    `${API_CONFIG.geocodingBaseUrl}/search?${params}`,
    signal,
  );
  return data.results ?? [];
}

/** Fetch current, hourly and daily forecast in metric units, local timezone. */
export async function fetchForecast(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<ForecastResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toFixed(4),
    longitude: longitude.toFixed(4),
    current: CURRENT_FIELDS.join(","),
    hourly: HOURLY_FIELDS.join(","),
    daily: DAILY_FIELDS.join(","),
    timezone: "auto",
    forecast_days: String(APP_CONFIG.forecastDays),
  });
  return getJson<ForecastResponse>(`${API_CONFIG.forecastBaseUrl}/forecast?${params}`, signal);
}
