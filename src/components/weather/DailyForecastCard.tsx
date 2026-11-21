// One day in the 7-day list: day, icon, rain chance and a high/low range bar.
import { Droplets } from "lucide-react";

import { formatDayLabel } from "@/lib/time";
import { formatPrecipitation, formatTemperature } from "@/lib/units";
import { getWeatherInfo } from "@/lib/weatherCodes";
import type { DailyPoint, TemperatureUnit } from "@/types/weather";
import { WeatherIcon } from "./WeatherIcon";

interface DailyForecastCardProps {
  day: DailyPoint;
  index: number;
  unit: TemperatureUnit;
  /** Week-wide min/max (°C) used to position the range bar. */
  weekMin: number;
  weekMax: number;
}

export function DailyForecastCard({ day, index, unit, weekMin, weekMax }: DailyForecastCardProps) {
  const span = Math.max(weekMax - weekMin, 1);
  const left = ((day.minTemperature - weekMin) / span) * 100;
  const width = ((day.maxTemperature - day.minTemperature) / span) * 100;
  const condition = getWeatherInfo(day.weatherCode).label;
  const dayLabel = formatDayLabel(day.date, index);

  return (
    <li
      className="grid grid-cols-[3.5rem_2rem_3rem_1fr] items-center gap-3 rounded-2xl bg-glass-strong/50 px-3 py-2.5 transition-transform hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-2 sm:flex sm:flex-col sm:gap-2 sm:py-4 sm:text-center"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
    >
      <p className="font-display text-sm font-semibold">{dayLabel}</p>
      <WeatherIcon code={day.weatherCode} className="size-8" label={condition} />
      <p className="flex items-center gap-0.5 text-xs font-medium text-rain" title="Chance and amount of precipitation">
        <Droplets className="size-3" aria-hidden />
        {day.precipitationChance}%<span className="sr-only"> chance of rain</span>
        <span className="text-muted-foreground">· {formatPrecipitation(day.precipitationAmount, "kmh")}</span>
      </p>
      <div className="flex items-center gap-2 text-sm sm:w-full sm:flex-col sm:gap-1">
        <span className="w-9 text-right text-muted-foreground sm:hidden">
          <span className="sr-only">Low </span>
          {formatTemperature(day.minTemperature, unit)}
        </span>
        <div className="relative h-1.5 flex-1 rounded-full bg-muted sm:hidden" aria-hidden>
          <div
            className="absolute inset-y-0 rounded-full bg-gradient-to-r from-rain to-sun"
            style={{ left: `${left}%`, width: `${Math.max(width, 6)}%` }}
          />
        </div>
        <span className="w-9 font-semibold sm:w-auto">
          <span className="sr-only">High </span>
          {formatTemperature(day.maxTemperature, unit)}
        </span>
        <span className="hidden text-muted-foreground sm:inline">
          <span className="sr-only">Low </span>
          {formatTemperature(day.minTemperature, unit)}
        </span>
      </div>
    </li>
  );
}
