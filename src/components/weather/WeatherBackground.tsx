// Full-screen gradient and short-lived precipitation effects for the current condition.
import { useEffect, useState, type CSSProperties } from "react";

import { isDarkSky } from "@/lib/weatherCodes";
import type { SkyTheme } from "@/types/weather";

export function WeatherBackground({ sky, effectKey }: { sky: SkyTheme; effectKey?: string }) {
  const isNight = isDarkSky(sky);
  const [effect, setEffect] = useState<"rain" | "snow" | null>(null);

  useEffect(() => {
    const nextEffect = sky.startsWith("rain") || sky === "storm"
      ? "rain"
      : sky === "snow"
        ? "snow"
        : null;
    setEffect(nextEffect);
    if (!nextEffect) return;

    const timeout = window.setTimeout(() => setEffect(null), 5000);
    return () => window.clearTimeout(timeout);
  }, [sky, effectKey]);

  return (
    <>
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
      {effect && (
        <div
          key={`${sky}-${effect}`}
          aria-hidden
          className={`weather-effect weather-effect-${effect} pointer-events-none fixed inset-0 z-40 overflow-hidden`}
        >
          {Array.from({ length: effect === "snow" ? 20 : 28 }, (_, index) => (
            <i
              key={index}
              style={{
                "--particle-left": `${(index * 37 + 11) % 100}%`,
                "--particle-delay": `${(index % 12) * -0.18}s`,
                "--particle-duration": `${(effect === "snow" ? 3.8 : 1.1) + (index % 7) * 0.16}s`,
                "--particle-drift": `${((index % 9) - 4) * 10}px`,
              } as CSSProperties}
            />
          ))}
        </div>
      )}
    </>
  );
}
