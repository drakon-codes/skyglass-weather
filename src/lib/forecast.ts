// Pure selectors that turn raw API arrays into chart/card friendly rows.
import type { DailyPoint, ForecastResponse, HourlyPoint } from "@/types/weather";

/** The next `hours` hourly entries starting at the current local hour. */
export function selectUpcomingHours(forecast: ForecastResponse, hours: number): HourlyPoint[] {
  const { hourly, current } = forecast;
  const currentHour = current.time.slice(0, 13); // "YYYY-MM-DDTHH"
  const start = Math.max(
    0,
    hourly.time.findIndex((t) => t.slice(0, 13) >= currentHour),
  );
  return hourly.time.slice(start, start + hours).map((time, offset) => {
    const i = start + offset;
    return {
      time,
      temperature: hourly.temperature_2m[i] ?? 0,
      precipitationChance: hourly.precipitation_probability[i] ?? 0,
      weatherCode: hourly.weather_code[i] ?? 0,
      isDay: hourly.is_day[i] === 1,
    };
  });
}

export function selectDailyForecast(forecast: ForecastResponse): DailyPoint[] {
  const { daily } = forecast;
  return daily.time.map((date, i) => ({
    date,
    weatherCode: daily.weather_code[i] ?? 0,
    maxTemperature: daily.temperature_2m_max[i] ?? 0,
    minTemperature: daily.temperature_2m_min[i] ?? 0,
    precipitationChance: daily.precipitation_probability_max[i] ?? 0,
    sunrise: daily.sunrise[i] ?? "",
    sunset: daily.sunset[i] ?? "",
    uvIndexMax: daily.uv_index_max[i] ?? null,
  }));
}
