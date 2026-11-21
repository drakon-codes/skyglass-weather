import { describe, expect, it } from "vitest";

import type { ForecastResponse } from "@/types/weather";
import { selectUpcomingHours } from "./forecast";

/** Minimal forecast with `count` hourly slots starting 2026-11-21T00:00. */
function forecastWithHours(count: number, currentTime: string): ForecastResponse {
  const time = Array.from({ length: count }, (_, i) => {
    const day = 21 + Math.floor(i / 24);
    return `2026-11-${day}T${String(i % 24).padStart(2, "0")}:00`;
  });
  return {
    current: { time: currentTime },
    hourly: {
      time,
      temperature_2m: time.map((_, i) => i),
      precipitation_probability: time.map(() => 10),
      weather_code: time.map(() => 0),
      is_day: time.map(() => 1),
    },
  } as unknown as ForecastResponse;
}

describe("24-hour forecast", () => {
  it("starts at the current local hour and returns 24 entries", () => {
    const hours = selectUpcomingHours(forecastWithHours(72, "2026-11-21T11:15"), 24);
    expect(hours).toHaveLength(24);
    expect(hours[0]?.time).toBe("2026-11-21T11:00");
    expect(hours[23]?.time).toBe("2026-11-22T10:00");
  });
});
