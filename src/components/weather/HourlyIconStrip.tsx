// Compact row of hourly conditions (every few hours) shown under the chart.
import { formatHour } from "@/lib/time";
import { formatTemperature } from "@/lib/units";
import { getWeatherInfo } from "@/lib/weatherCodes";
import type { HourlyPoint, TemperatureUnit } from "@/types/weather";
import { WeatherIcon } from "./WeatherIcon";

interface HourlyIconStripProps {
  hours: HourlyPoint[];
  unit: TemperatureUnit;
  /** Show every n-th hour. */
  step?: number;
}

export function HourlyIconStrip({ hours, unit, step = 3 }: HourlyIconStripProps) {
  const picks = hours.filter((_, i) => i % step === 0);
  return (
    <ol className="grid grid-cols-4 gap-2 sm:grid-cols-8">
      {picks.map((h, i) => (
        <li
          key={h.time}
          className="flex flex-col items-center gap-1 rounded-2xl bg-glass-strong/50 py-2.5 text-xs"
        >
          <span className="font-medium text-muted-foreground">{i === 0 ? "Now" : formatHour(h.time)}</span>
          <WeatherIcon code={h.weatherCode} isDay={h.isDay} className="size-6" label={getWeatherInfo(h.weatherCode).label} />
          <span className="font-display text-sm font-semibold">{formatTemperature(h.temperature, unit)}</span>
        </li>
      ))}
    </ol>
  );
}
