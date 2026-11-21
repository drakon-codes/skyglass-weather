// Two segmented controls: temperature (°C/°F) and wind speed (km/h/mph).
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { TemperatureUnit, UnitPreferences, WindUnit } from "@/types/weather";

interface UnitToggleProps {
  units: UnitPreferences;
  onTemperatureChange: (unit: TemperatureUnit) => void;
  onWindChange: (unit: WindUnit) => void;
}

const groupClass = "glass rounded-full p-1";

export function UnitToggle({ units, onTemperatureChange, onWindChange }: UnitToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <ToggleGroup
        type="single"
        variant="segment"
        size="sm"
        value={units.temperature}
        onValueChange={(v) => v && onTemperatureChange(v as TemperatureUnit)}
        aria-label="Temperature unit"
        className={groupClass}
      >
        <ToggleGroupItem value="celsius" aria-label="Celsius">
          °C
        </ToggleGroupItem>
        <ToggleGroupItem value="fahrenheit" aria-label="Fahrenheit">
          °F
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup
        type="single"
        variant="segment"
        size="sm"
        value={units.wind}
        onValueChange={(v) => v && onWindChange(v as WindUnit)}
        aria-label="Wind speed unit"
        className={groupClass}
      >
        <ToggleGroupItem value="kmh" aria-label="Kilometres per hour">
          km/h
        </ToggleGroupItem>
        <ToggleGroupItem value="mph" aria-label="Miles per hour">
          mph
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
