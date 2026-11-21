// 24-hour chart: temperature (area) + chance of precipitation (bars).
import { Area, Bar, CartesianGrid, ComposedChart, Tooltip, XAxis, YAxis } from "recharts";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { formatHour } from "@/lib/time";
import { convertTemperature } from "@/lib/units";
import { getWeatherInfo } from "@/lib/weatherCodes";
import type { HourlyPoint, TemperatureUnit } from "@/types/weather";
import { HourlyIconStrip } from "./HourlyIconStrip";
import { SectionCard } from "./SectionCard";

const chartConfig = {
  temperature: { label: "Temperature", color: "var(--chart-1)" },
  precipitation: { label: "Rain chance", color: "var(--chart-2)" },
} satisfies ChartConfig;

interface Row {
  label: string;
  temperature: number;
  precipitation: number;
  condition: string;
}

interface TooltipBodyProps {
  active?: boolean;
  payload?: { payload: Row }[];
}

function HourTooltip({ active, payload }: TooltipBodyProps) {
  const row = payload?.[0]?.payload;
  if (!active || !row) return null;
  return (
    <div className="glass-strong rounded-xl px-3 py-2 text-xs">
      <p className="font-semibold">{row.label}</p>
      <p className="text-muted-foreground">{row.condition}</p>
      <p className="mt-1">
        <span className="font-semibold text-chart-1">{row.temperature}°</span> ·{" "}
        <span className="font-semibold text-chart-2">{row.precipitation}% rain</span>
      </p>
    </div>
  );
}

interface HourlyForecastChartProps {
  hours: HourlyPoint[];
  unit: TemperatureUnit;
}

export function HourlyForecastChart({ hours, unit }: HourlyForecastChartProps) {
  const data: Row[] = hours.map((h) => ({
    label: formatHour(h.time),
    temperature: Math.round(convertTemperature(h.temperature, unit)),
    precipitation: h.precipitationChance,
    condition: getWeatherInfo(h.weatherCode).label,
  }));
  const temps = data.map((d) => d.temperature);
  const summary = data.length
    ? `Next 24 hours: high ${Math.max(...temps)}°, low ${Math.min(...temps)}°, up to ${Math.max(
        ...data.map((d) => d.precipitation),
      )}% chance of rain.`
    : "No hourly data available.";

  return (
    <SectionCard
      title="Next 24 hours"
      className="flex h-full flex-col"
      action={
        <div className="flex gap-3 text-xs text-muted-foreground" aria-hidden>
          <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-chart-1" />Temp</span>
          <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-chart-2" />Rain %</span>
        </div>
      }
    >
      <p className="sr-only">{summary}</p>
      <div className="-mx-2 min-h-64 flex-1 overflow-x-auto px-2" aria-hidden>
        <ChartContainer config={chartConfig} className="aspect-auto h-full min-h-64 w-full min-w-[560px]">
          <ComposedChart data={data} margin={{ top: 10, right: 4, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-temperature)" stopOpacity={0.45} />
                <stop offset="100%" stopColor="var(--color-temperature)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 6" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} interval={2} tickMargin={8} />
            <YAxis yAxisId="temp" tickLine={false} axisLine={false} tickFormatter={(v) => `${v}°`} domain={["dataMin - 2", "dataMax + 2"]} />
            <YAxis yAxisId="rain" orientation="right" hide domain={[0, 100]} />
            <Tooltip content={<HourTooltip />} cursor={{ stroke: "var(--border)" }} />
            <Bar yAxisId="rain" dataKey="precipitation" fill="var(--color-precipitation)" fillOpacity={0.35} radius={[4, 4, 0, 0]} barSize={10} />
            <Area
              yAxisId="temp"
              type="monotone"
              dataKey="temperature"
              stroke="var(--color-temperature)"
              strokeWidth={2.5}
              fill="url(#tempFill)"
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ChartContainer>
      </div>
      <div className="mt-4">
        <HourlyIconStrip hours={hours} unit={unit} />
      </div>
    </SectionCard>
  );
}
