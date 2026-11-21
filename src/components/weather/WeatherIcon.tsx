// Maps a WMO weather code (+ day/night) to a lucide icon with a fitting tint.
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Moon,
  Sun,
  type LucideIcon,
} from "lucide-react";

import { getWeatherInfo } from "@/lib/weatherCodes";
import { cn } from "@/lib/utils";
import type { ConditionKind } from "@/types/weather";

const ICONS: Record<ConditionKind, { day: LucideIcon; night: LucideIcon; tint: string }> = {
  clear: { day: Sun, night: Moon, tint: "text-sun" },
  "partly-cloudy": { day: CloudSun, night: CloudMoon, tint: "text-sun" },
  cloudy: { day: Cloud, night: Cloud, tint: "text-muted-foreground" },
  fog: { day: CloudFog, night: CloudFog, tint: "text-muted-foreground" },
  drizzle: { day: CloudDrizzle, night: CloudDrizzle, tint: "text-rain" },
  rain: { day: CloudRain, night: CloudRain, tint: "text-rain" },
  snow: { day: CloudSnow, night: CloudSnow, tint: "text-primary" },
  storm: { day: CloudLightning, night: CloudLightning, tint: "text-primary" },
};

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  className?: string;
  /** When set, the icon is announced; otherwise it is decorative. */
  label?: string;
}

export function WeatherIcon({ code, isDay = true, className, label }: WeatherIconProps) {
  const { kind } = getWeatherInfo(code);
  const entry = ICONS[kind];
  const Icon = isDay ? entry.day : entry.night;
  const tint = !isDay && kind === "clear" ? "text-foreground" : entry.tint;
  return (
    <Icon
      className={cn("shrink-0", tint, className)}
      strokeWidth={1.6}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    />
  );
}
