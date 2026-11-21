// Page-level container: wires hooks (location, units, favourites, forecast) to the UI.
import { useMemo } from "react";

import { APP_CONFIG } from "@/config";
import { useFavorites } from "@/hooks/useFavorites";
import { useForecast } from "@/hooks/useForecast";
import { useSelectedLocation } from "@/hooks/useSelectedLocation";
import { useUnits } from "@/hooks/useUnits";
import { selectDailyForecast, selectUpcomingHours } from "@/lib/forecast";
import { getSkyTheme } from "@/lib/weatherCodes";
import { AppHeader } from "./AppHeader";
import { CurrentWeatherCard } from "./CurrentWeatherCard";
import { DailyForecast } from "./DailyForecast";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { ErrorState } from "./ErrorState";
import { FavoritesBar } from "./FavoritesBar";
import { HourlyForecastChart } from "./HourlyForecastChart";
import { WeatherBackground } from "./WeatherBackground";

export function WeatherDashboard() {
  const [location, setLocation] = useSelectedLocation();
  const { units, setTemperatureUnit, setWindUnit } = useUnits();
  const { favorites, isFavorite, toggle, remove } = useFavorites();
  const { data: forecast, isPending, isError, error, refetch } = useForecast(location);

  const hours = useMemo(
    () => (forecast ? selectUpcomingHours(forecast, APP_CONFIG.hourlyHours) : []),
    [forecast],
  );
  const days = useMemo(() => (forecast ? selectDailyForecast(forecast) : []), [forecast]);
  const sky = forecast
    ? getSkyTheme(forecast.current.weather_code, forecast.current.is_day === 1)
    : "clear-day";

  return (
    <>
      <WeatherBackground sky={sky} />
      <a
        href="#forecast"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to forecast
      </a>
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-4 px-3 py-4 sm:px-6 sm:py-8">
        <AppHeader
          units={units}
          onTemperatureChange={setTemperatureUnit}
          onWindChange={setWindUnit}
          onSelectLocation={setLocation}
        />
        <FavoritesBar
          favorites={favorites}
          activeId={location.id}
          onSelect={setLocation}
          onRemove={remove}
        />

        <main id="forecast" tabIndex={-1} className="flex-1 outline-none">
          {isPending ? (
            <DashboardSkeleton />
          ) : isError ? (
            <ErrorState message={error.message} onRetry={() => void refetch()} />
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <CurrentWeatherCard
                location={location}
                current={forecast.current}
                today={days[0]}
                timezone={forecast.timezone}
                units={units}
                isFavorite={isFavorite(location)}
                onToggleFavorite={() => toggle(location)}
              />
              <div className="lg:col-span-2">
                <HourlyForecastChart hours={hours} unit={units.temperature} />
              </div>
              <div className="lg:col-span-3">
                <DailyForecast days={days} unit={units.temperature} />
              </div>
            </div>
          )}
        </main>

        <footer className="pb-2 text-center text-xs text-foreground/80">
          Weather data by{" "}
          <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-2">
            Open-Meteo
          </a>
        </footer>
      </div>
    </>
  );
}
