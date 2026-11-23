# Nimbus — Weather Dashboard

A responsive, client-side weather dashboard built with React, TypeScript, TanStack Start (Vite),
Tailwind CSS v4, shadcn/ui, Recharts and TanStack Query. Weather data comes from the free
[Open-Meteo](https://open-meteo.com/) API — no API key, backend or account needed.

## Features

- City, town and village search with debounced autocomplete (keyboard friendly)
- Current conditions: temperature, feels like, humidity, wind, pressure, UV, visibility, sunrise/sunset
- 24-hour temperature + rain-chance chart
- 7-day forecast cards
- °C/°F and km/h/mph toggles (saved in localStorage)
- Saved cities (localStorage)
- Light/dark mode (saved, defaults to OS preference)
- Background gradient that follows the weather and day/night
- "Use my location" via browser geolocation
- Reverse-geocoded place names for geolocation
- Air-quality index and precipitation amounts
- Reorderable saved cities
- Installable PWA shell with cached weather responses
- Loading skeletons, error state with retry, and empty states

## Getting started

Requires [Bun](https://bun.sh) (or Node 20+ with npm).

```bash
bun install
bun run dev        # http://localhost:8080
bun run test       # unit tests (Vitest)
bun run build      # production build
```

## Deploying to Vercel

The Vercel build automatically selects Nitro's Vercel preset; local and Lovable builds
continue using their existing deployment target.

1. Import `drakon-codes/skyglass-weather` in the Vercel dashboard.
2. Keep the project root set to the repository root.
3. Use `bun install --frozen-lockfile` as the install command and `bun run build` as the build command.
4. Leave the output directory unset so Nitro can provide Vercel's build output.
5. Deploy. No environment variables or API keys are required.

Vercel serves the app over HTTPS, which allows browsers to offer geolocation permission.

## Project structure

```text
src/
  config.ts                 API base URLs, timings, default city, storage keys
  types/weather.ts          API response types + app view models
  services/weatherApi.ts    All fetch calls (geocoding + forecast)
  hooks/                    useForecast, useCitySearch, useUnits, useFavorites, useTheme, ...
  lib/                      Pure helpers: units, time, weather codes, forecast selectors, storage
  components/weather/       Dashboard UI components
  components/ui/            shadcn/ui primitives
  routes/index.tsx          The dashboard page
  styles.css                Design tokens (colors, glass, sky gradients)
```

Notes:
- The API is always queried in metric units; conversion happens at display time (`src/lib/units.ts`),
  so toggling units is instant and doesn't refetch.
- Times from Open-Meteo are in the city's local timezone; `src/lib/time.ts` formats them without
  converting to the browser's timezone.
- To switch providers, change the URLs in `src/config.ts` and adapt `src/services/weatherApi.ts`.

## Future ideas

- Weather alerts
- Localisation (languages, 24-hour clock)
