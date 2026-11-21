// Top bar: brand, city search, "my location", unit toggles and theme toggle.
import { CloudSun } from "lucide-react";

import { APP_CONFIG } from "@/config";
import type { GeoLocation, TemperatureUnit, UnitPreferences, WindUnit } from "@/types/weather";
import { CitySearch } from "./CitySearch";
import { ThemeToggle } from "./ThemeToggle";
import { UnitToggle } from "./UnitToggle";
import { UseLocationButton } from "./UseLocationButton";

interface AppHeaderProps {
  units: UnitPreferences;
  onTemperatureChange: (unit: TemperatureUnit) => void;
  onWindChange: (unit: WindUnit) => void;
  onSelectLocation: (location: GeoLocation) => void;
}

export function AppHeader({ units, onTemperatureChange, onWindChange, onSelectLocation }: AppHeaderProps) {
  return (
    <header className="relative z-20 grid gap-3 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <span className="glass grid size-10 place-items-center rounded-2xl">
            <CloudSun className="size-5 text-sun" aria-hidden />
          </span>
          {APP_CONFIG.appName}
        </h1>
        <div className="lg:hidden">
          <ThemeToggle />
        </div>
      </div>

      <div className="flex gap-2">
        <CitySearch onSelect={onSelectLocation} />
        <UseLocationButton onLocate={onSelectLocation} />
      </div>

      <div className="flex items-center justify-between gap-2 lg:justify-end">
        <UnitToggle
          units={units}
          onTemperatureChange={onTemperatureChange}
          onWindChange={onWindChange}
        />
        <div className="hidden lg:block">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
