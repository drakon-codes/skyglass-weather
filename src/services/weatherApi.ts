// All network calls to Open-Meteo live here. Components never call fetch directly.
import { API_CONFIG, APP_CONFIG } from "@/config";
import type {
  ForecastResponse,
  GeocodingResponse,
  GeocodingResult,
  OpenMeteoErrorResponse,
} from "@/types/weather";

export interface AirQualityResponse {
  current?: {
    us_aqi?: number | null;
    pm2_5?: number | null;
  };
}

export interface ReverseLocation {
  name: string;
  admin1?: string;
  country?: string;
}

interface NominatimSearchResult {
  place_id: number;
  lat: string;
  lon: string;
  name?: string;
  display_name: string;
  addresstype?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    hamlet?: string;
    suburb?: string;
    state?: string;
    country?: string;
  };
}

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
const HOURLY_FIELDS = [
  "temperature_2m",
  "precipitation_probability",
  "precipitation",
  "weather_code",
  "is_day",
];
const DAILY_FIELDS = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "precipitation_probability_max",
  "precipitation_sum",
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

/** Search cities, towns and villages for autocomplete. */
export async function searchCities(query: string, signal?: AbortSignal): Promise<GeocodingResult[]> {
  const params = new URLSearchParams({
    name: query,
    count: "100",
    language: "en",
    format: "json",
  });
  const data = await getJson<GeocodingResponse>(
    `${API_CONFIG.geocodingBaseUrl}/search?${params}`,
    signal,
  );
  const primary = data.results ?? [];

  const exactNameMatches = primary.filter(
    (result) => result.name.toLowerCase() === query.trim().toLowerCase()
  );
  const orderedPrimary = [
    ...exactNameMatches,
    ...primary.filter((result) => !exactNameMatches.includes(result)),
  ];

  if (orderedPrimary.length >= APP_CONFIG.searchResultLimit) {
    return orderedPrimary.slice(0, APP_CONFIG.searchResultLimit);
  }

  try {
    const fallbackParams = new URLSearchParams({
      q: query,
      format: "jsonv2",
      addressdetails: "1",
      namedetails: "1",
      limit: String(APP_CONFIG.searchResultLimit),
    });
    const fallback = await getJson<NominatimSearchResult[]>(
      `${API_CONFIG.placeSearchBaseUrl}/search?${fallbackParams}`,
      signal,
    );

    const fallbackResults: GeocodingResult[] = fallback
      .map((place) => {
        const address = place.address;
        const name =
          address?.city ||
          address?.town ||
          address?.village ||
          address?.municipality ||
          address?.hamlet ||
          address?.suburb ||
          place.name ||
          place.display_name.split(",")[0];
        const latitude = Number(place.lat);
        const longitude = Number(place.lon);
        if (!name || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

        return {
          id: place.place_id,
          name,
          latitude,
          longitude,
          feature_code: place.addresstype,
          admin1: address?.state,
          country: address?.country,
        } satisfies GeocodingResult;
      })
      .filter((place): place is GeocodingResult => place !== null);

    const combined = [...orderedPrimary];
    for (const place of fallbackResults) {
      const duplicate = combined.some(
        (result) =>
          result.name.toLowerCase() === place.name.toLowerCase() &&
          Math.abs(result.latitude - place.latitude) < 0.01 &&
          Math.abs(result.longitude - place.longitude) < 0.01,
      );
      if (!duplicate) combined.push(place);
    }
    return combined.slice(0, APP_CONFIG.searchResultLimit);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    return orderedPrimary.slice(0, APP_CONFIG.searchResultLimit);
  }
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

export async function fetchAirQuality(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<AirQualityResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toFixed(4),
    longitude: longitude.toFixed(4),
    current: "us_aqi,pm2_5",
  });
  return getJson<AirQualityResponse>(
    `${API_CONFIG.airQualityBaseUrl}/air-quality?${params}`,
    signal,
  );
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<ReverseLocation | null> {
  const params = new URLSearchParams({
    lat: latitude.toFixed(4),
    lon: longitude.toFixed(4),
    format: "jsonv2",
  });
  const data = await getJson<{
    name?: string;
    address?: { city?: string; town?: string; village?: string; municipality?: string; state?: string; country?: string };
  }>(`${API_CONFIG.reverseGeocodingBaseUrl}/reverse?${params}`, signal);
  const name =
    data.address?.city ||
    data.address?.town ||
    data.address?.village ||
    data.address?.municipality ||
    data.name;
  if (!name) return null;
  return {
    name,
    admin1: data.address?.state,
    country: data.address?.country,
  };
}
