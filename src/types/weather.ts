// Types for Open-Meteo API responses and the app's derived view models.

/* ---------- Geocoding API ---------- */

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string;
  admin2?: string;
  timezone?: string;
  population?: number;
}

export interface GeocodingResponse {
  /** Omitted by the API when nothing matches. */
  results?: GeocodingResult[];
  generationtime_ms: number;
}

/* ---------- Forecast API ---------- */

export interface ForecastCurrent {
  time: string;
  interval: number;
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  is_day: 0 | 1;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  pressure_msl: number;
  uv_index: number | null;
  visibility: number | null;
}

export interface ForecastHourly {
  time: string[];
  temperature_2m: number[];
  precipitation_probability: (number | null)[];
  weather_code: number[];
  is_day: (0 | 1)[];
}

export interface ForecastDaily {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: (number | null)[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: (number | null)[];
}

export interface ForecastResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  utc_offset_seconds: number;
  elevation: number;
  current: ForecastCurrent;
  hourly: ForecastHourly;
  daily: ForecastDaily;
}

/** Error body returned by Open-Meteo on bad requests. */
export interface OpenMeteoErrorResponse {
  error: true;
  reason: string;
}

/* ---------- App models ---------- */

/** A place the user can view weather for (search result, favourite or GPS). */
export interface GeoLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  admin1?: string;
  country?: string;
}

export type TemperatureUnit = "celsius" | "fahrenheit";
export type WindUnit = "kmh" | "mph";

export interface UnitPreferences {
  temperature: TemperatureUnit;
  wind: WindUnit;
}

export type ThemeMode = "light" | "dark";

/** Broad condition group derived from a WMO weather code. */
export type ConditionKind =
  | "clear"
  | "partly-cloudy"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "storm";

export type SkyTheme =
  | "clear-day"
  | "clear-night"
  | "cloudy-day"
  | "cloudy-night"
  | "rain-day"
  | "rain-night"
  | "snow"
  | "storm";

export interface HourlyPoint {
  time: string;
  /** Temperature in °C (convert for display). */
  temperature: number;
  precipitationChance: number;
  weatherCode: number;
  isDay: boolean;
}

export interface DailyPoint {
  date: string;
  weatherCode: number;
  maxTemperature: number;
  minTemperature: number;
  precipitationChance: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number | null;
}
