// Full-screen gradient that reflects the current condition and day/night.
import type { SkyTheme } from "@/types/weather";

export function WeatherBackground({ sky }: { sky: SkyTheme }) {
  const isNight = sky.endsWith("night") || sky === "storm";
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Re-keyed so each theme change fades in */}
      <div
        key={sky}
        data-sky={sky}
        className="sky absolute inset-0 animate-in fade-in duration-1000"
      />
      <div
        data-night={isNight}
        className="sky-glow absolute -right-[20%] -top-[25%] size-[70vmax] rounded-full"
      />
    </div>
  );
}
