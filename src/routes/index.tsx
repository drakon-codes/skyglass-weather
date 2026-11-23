import { createFileRoute } from "@tanstack/react-router";

import { WeatherDashboard } from "@/components/weather/WeatherDashboard";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Nimbus — Live Weather Dashboard" },
      {
        name: "description",
        content:
          "Current conditions, a 24-hour chart and a 7-day forecast for any city, with saved places and °C/°F units.",
      },
      { property: "og:title", content: "Nimbus — Live Weather Dashboard" },
      {
        property: "og:description",
        content: "Search any city for current weather, hourly trends and a 7-day forecast.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WeatherDashboard,
});
