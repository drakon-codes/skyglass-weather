// Page-level container: wires hooks (location, units, favourites, forecast) to the UI.
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { APP_CONFIG } from "@/config";
import { useFavorites } from "@/hooks/useFavorites";
import { useForecast } from "@/hooks/useForecast";
import { useSelectedLocation } from "@/hooks/useSelectedLocation";
import { useUnits } from "@/hooks/useUnits";
import { selectDailyForecast, selectUpcomingHours } from "@/lib/forecast";
import { getSkyTheme, isDarkSky } from "@/lib/weatherCodes";
import { fetchAirQuality, reverseGeocode } from "@/services/weatherApi";
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
  const { favorites, isFavorite, toggle, remove, reorder } = useFavorites();
  const { data: forecast, isPending, isError, error, refetch } = useForecast(location);
  const [placeName, setPlaceName] = useState(location.name);
  const airQualityQuery = useQuery({
    queryKey: ["air-quality", location.latitude.toFixed(3), location.longitude.toFixed(3)],
    queryFn: ({ signal }) => fetchAirQuality(location.latitude, location.longitude, signal),
    staleTime: APP_CONFIG.forecastStaleTimeMs,
  });

  useEffect(() => {
    setPlaceName(location.name);
  }, [location]);

  useEffect(() => {
    if (!location.id.startsWith("gps:")) return;
    const controller = new AbortController();
    void reverseGeocode(location.latitude, location.longitude, controller.signal)
      .then((place) => {
        if (!place) return;
        setPlaceName(place.name);
        setLocation({
          ...location,
          name: place.name,
          admin1: place.admin1,
          country: place.country,
        });
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [location.id, location.latitude, location.longitude, setLocation]);

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
      <WeatherBackground sky={sky} effectKey={location.id} />
      <a
        href="#forecast"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to forecast
      </a>
      {/* Dark skies switch this subtree to the dark palette so text stays readable. */}
      <div
        data-sky-tone={isDarkSky(sky) ? "dark" : "light"}
        className="mx-auto flex min-h-screen max-w-7xl flex-col gap-4 px-3 py-4 text-foreground sm:px-6 sm:py-8"
      >
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
          onReorder={reorder}
        />

        <main id="forecast" tabIndex={-1} className="flex-1 outline-none">
          <p className="sr-only" aria-live="polite">
            {isPending ? `Loading weather for ${placeName}` : isError ? "Weather could not be loaded" : `Weather loaded for ${placeName}`}
          </p>
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
                airQuality={{
                  aqi: airQualityQuery.data?.current?.us_aqi ?? null,
                  pm25: airQualityQuery.data?.current?.pm2_5 ?? null,
                }}
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

        <footer className="sky-text-muted pb-2 text-center text-xs">
          Weather data by{" "}
          <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-2">
            Open-Meteo
          </a>
          {" · "}
          Place search by{" "}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-2">
            OpenStreetMap
          </a>
        </footer>
      </div>
    </>
  );
}
