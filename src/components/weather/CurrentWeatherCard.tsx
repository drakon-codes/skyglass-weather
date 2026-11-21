// Hero card: location, big temperature, condition and key metrics.
import {
  Droplets,
  Eye,
  Gauge,
  Star,
  Sun,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
  Leaf,
  Clock3,
} from "lucide-react";

import { formatRegion } from "@/lib/location";
import { formatClock, formatLocalDateTime } from "@/lib/time";
import {
  formatPressure,
  formatTemperature,
  formatVisibility,
  formatWindSpeed,
  uvIndexLabel,
  airQualityLabel,
  windDirectionLabel,
} from "@/lib/units";
import { getWeatherInfo } from "@/lib/weatherCodes";
import { cn } from "@/lib/utils";
import type { DailyPoint, ForecastCurrent, GeoLocation, UnitPreferences } from "@/types/weather";
import { WeatherIcon } from "./WeatherIcon";
import { WeatherStat } from "./WeatherStat";

interface CurrentWeatherCardProps {
  location: GeoLocation;
  current: ForecastCurrent;
  today: DailyPoint | undefined;
  timezone: string;
  units: UnitPreferences;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  airQuality?: { aqi: number | null; pm25: number | null };
}

export function CurrentWeatherCard(props: CurrentWeatherCardProps) {
  const { location, current, today, timezone, units, isFavorite, onToggleFavorite, airQuality } = props;
  const t = units.temperature;
  const condition = getWeatherInfo(current.weather_code).label;
  const region = formatRegion(location) || timezone.replace(/_/g, " ");

  return (
    <section
      aria-label={`Current weather in ${location.name}`}
      className="glass flex flex-col gap-5 rounded-3xl p-5 sm:p-6 animate-in fade-in slide-in-from-bottom-2 duration-500"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-2xl font-bold tracking-tight">{location.name}</h2>
          <p className="truncate text-sm text-muted-foreground">{region}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Clock3 className="size-3" aria-hidden />
            Updated {formatLocalDateTime(current.time)}
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `Remove ${location.name} from saved` : `Save ${location.name}`}
          className="grid size-10 shrink-0 place-items-center rounded-full bg-glass-strong transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Star
            className={cn("size-5", isFavorite ? "fill-favorite text-favorite" : "text-muted-foreground")}
            aria-hidden
          />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <WeatherIcon
          code={current.weather_code}
          isDay={current.is_day === 1}
          className="size-20 sm:size-24"
        />
        <div>
          <p className="font-display text-6xl font-semibold leading-none tracking-tighter sm:text-7xl">
            {formatTemperature(current.temperature_2m, t)}
            <span className="sr-only">{t === "celsius" ? "Celsius" : "Fahrenheit"}</span>
          </p>
          <p className="mt-2 font-medium">{condition}</p>
          {today && (
            <p className="text-sm text-muted-foreground">
              H {formatTemperature(today.maxTemperature, t)} · L{" "}
              {formatTemperature(today.minTemperature, t)}
            </p>
          )}
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
        <WeatherStat icon={Thermometer} label="Feels like" value={formatTemperature(current.apparent_temperature, t)} />
        <WeatherStat icon={Droplets} label="Humidity" value={`${current.relative_humidity_2m}%`} />
        <WeatherStat
          icon={Wind}
          label="Wind"
          value={formatWindSpeed(current.wind_speed_10m, units.wind)}
          hint={windDirectionLabel(current.wind_direction_10m)}
        />
        <WeatherStat icon={Gauge} label="Pressure" value={formatPressure(current.pressure_msl)} />
        <WeatherStat
          icon={Sun}
          label="UV index"
          value={current.uv_index === null ? "—" : String(Math.round(current.uv_index))}
          hint={uvIndexLabel(current.uv_index)}
        />
        <WeatherStat
          icon={Leaf}
          label="Air quality"
          value={airQuality?.aqi == null ? "—" : String(Math.round(airQuality.aqi))}
          hint={airQualityLabel(airQuality?.aqi)}
        />
        <WeatherStat icon={Eye} label="Visibility" value={formatVisibility(current.visibility, units.wind)} />
        <WeatherStat icon={Sunrise} label="Sunrise" value={today?.sunrise ? formatClock(today.sunrise) : "—"} />
        <WeatherStat icon={Sunset} label="Sunset" value={today?.sunset ? formatClock(today.sunset) : "—"} />
      </dl>
    </section>
  );
}
