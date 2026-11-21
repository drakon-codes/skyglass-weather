// Two segmented controls: temperature (°C/°F) and wind speed (km/h/mph).
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TemperatureUnit, UnitPreferences, WindUnit } from "@/types/weather";

interface UnitToggleProps {
  units: UnitPreferences;
  onTemperatureChange: (unit: TemperatureUnit) => void;
  onWindChange: (unit: WindUnit) => void;
}

const groupClass = "glass rounded-full p-1";

export function UnitToggle({ units, onTemperatureChange, onWindChange }: UnitToggleProps) {
  const controls = (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div>
        <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Temperature</p>
        <ToggleGroup
          type="single"
          variant="segment"
          size="sm"
          value={units.temperature}
          onValueChange={(v) => v && onTemperatureChange(v as TemperatureUnit)}
          aria-label="Temperature unit"
          className={groupClass}
        >
          <ToggleGroupItem value="celsius" aria-label="Celsius">°C</ToggleGroupItem>
          <ToggleGroupItem value="fahrenheit" aria-label="Fahrenheit">°F</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div>
        <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Wind and distance</p>
        <ToggleGroup
          type="single"
          variant="segment"
          size="sm"
          value={units.wind}
          onValueChange={(v) => v && onWindChange(v as WindUnit)}
          aria-label="Wind speed unit"
          className={groupClass}
        >
          <ToggleGroupItem value="kmh" aria-label="Kilometres per hour">km/h</ToggleGroupItem>
          <ToggleGroupItem value="mph" aria-label="Miles per hour">mph</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden items-center gap-2 sm:flex">{controls}</div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="glass" size="icon-pill" className="sm:hidden" aria-label="Open unit settings">
            <SlidersHorizontal />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="glass-strong w-64 rounded-2xl sm:hidden">
          {controls}
        </PopoverContent>
      </Popover>
    </>
  );
}
