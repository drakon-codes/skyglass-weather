// Forecast for a location, cached per coordinates by TanStack Query.
import { useQuery } from "@tanstack/react-query";

import { APP_CONFIG } from "@/config";
import { fetchForecast } from "@/services/weatherApi";
import type { GeoLocation } from "@/types/weather";

export function useForecast(location: GeoLocation) {
  const { latitude, longitude } = location;
  return useQuery({
    queryKey: ["forecast", latitude.toFixed(3), longitude.toFixed(3)],
    queryFn: ({ signal }) => fetchForecast(latitude, longitude, signal),
    staleTime: APP_CONFIG.forecastStaleTimeMs,
    refetchInterval: APP_CONFIG.forecastStaleTimeMs,
  });
}
