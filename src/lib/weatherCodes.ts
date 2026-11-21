// WMO weather interpretation codes -> human label, condition group and sky theme.
import type { ConditionKind, SkyTheme } from "@/types/weather";

interface CodeInfo {
  label: string;
  kind: ConditionKind;
}

const CODES: Record<number, CodeInfo> = {
  0: { label: "Clear sky", kind: "clear" },
  1: { label: "Mainly clear", kind: "clear" },
  2: { label: "Partly cloudy", kind: "partly-cloudy" },
  3: { label: "Overcast", kind: "cloudy" },
  45: { label: "Fog", kind: "fog" },
  48: { label: "Rime fog", kind: "fog" },
  51: { label: "Light drizzle", kind: "drizzle" },
  53: { label: "Drizzle", kind: "drizzle" },
  55: { label: "Dense drizzle", kind: "drizzle" },
  56: { label: "Freezing drizzle", kind: "drizzle" },
  57: { label: "Freezing drizzle", kind: "drizzle" },
  61: { label: "Light rain", kind: "rain" },
  63: { label: "Rain", kind: "rain" },
  65: { label: "Heavy rain", kind: "rain" },
  66: { label: "Freezing rain", kind: "rain" },
  67: { label: "Freezing rain", kind: "rain" },
  71: { label: "Light snow", kind: "snow" },
  73: { label: "Snow", kind: "snow" },
  75: { label: "Heavy snow", kind: "snow" },
  77: { label: "Snow grains", kind: "snow" },
  80: { label: "Rain showers", kind: "rain" },
  81: { label: "Rain showers", kind: "rain" },
  82: { label: "Violent showers", kind: "rain" },
  85: { label: "Snow showers", kind: "snow" },
  86: { label: "Snow showers", kind: "snow" },
  95: { label: "Thunderstorm", kind: "storm" },
  96: { label: "Thunderstorm, hail", kind: "storm" },
  99: { label: "Thunderstorm, hail", kind: "storm" },
};

const UNKNOWN: CodeInfo = { label: "Unknown", kind: "cloudy" };

export function getWeatherInfo(code: number): CodeInfo {
  return CODES[code] ?? UNKNOWN;
}

/** Picks the background theme for a condition and time of day. */
export function getSkyTheme(code: number, isDay: boolean): SkyTheme {
  const { kind } = getWeatherInfo(code);
  switch (kind) {
    case "clear":
    case "partly-cloudy":
      return isDay ? "clear-day" : "clear-night";
    case "cloudy":
    case "fog":
      return isDay ? "cloudy-day" : "cloudy-night";
    case "drizzle":
    case "rain":
      return isDay ? "rain-day" : "rain-night";
    case "snow":
      return "snow";
    case "storm":
      return "storm";
  }
}
