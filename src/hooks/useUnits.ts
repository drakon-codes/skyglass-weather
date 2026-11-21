// °C/°F and km/h/mph preference, persisted in localStorage.
import { useCallback } from "react";

import { STORAGE_KEYS } from "@/config";
import { DEFAULT_UNITS, isUnitPreferences } from "@/lib/units";
import type { TemperatureUnit, WindUnit } from "@/types/weather";
import { usePersistentState } from "./usePersistentState";

export function useUnits() {
  const [units, setUnits] = usePersistentState(STORAGE_KEYS.units, DEFAULT_UNITS, isUnitPreferences);

  const setTemperatureUnit = useCallback(
    (temperature: TemperatureUnit) => setUnits((prev) => ({ ...prev, temperature })),
    [setUnits],
  );
  const setWindUnit = useCallback(
    (wind: WindUnit) => setUnits((prev) => ({ ...prev, wind })),
    [setUnits],
  );

  return { units, setTemperatureUnit, setWindUnit };
}
