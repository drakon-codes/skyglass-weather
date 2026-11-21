import type { DailyPoint, TemperatureUnit } from "@/types/weather";
import { DailyForecastCard } from "./DailyForecastCard";
import { SectionCard } from "./SectionCard";

export function DailyForecast({ days, unit }: { days: DailyPoint[]; unit: TemperatureUnit }) {
  const weekMin = Math.min(...days.map((d) => d.minTemperature));
  const weekMax = Math.max(...days.map((d) => d.maxTemperature));
  return (
    <SectionCard title={`${days.length}-day forecast`}>
      <ul className="grid gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {days.map((day, i) => (
          <DailyForecastCard
            key={day.date}
            day={day}
            index={i}
            unit={unit}
            weekMin={weekMin}
            weekMax={weekMax}
          />
        ))}
      </ul>
    </SectionCard>
  );
}
