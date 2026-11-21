// Wraps the browser Geolocation API with friendly error messages.
import { useCallback, useState } from "react";

import { APP_CONFIG } from "@/config";

type Status = "idle" | "locating" | "error";

const MESSAGES: Record<number, string> = {
  1: "Location permission was denied. Enable it in your browser settings.",
  2: "Your location is unavailable right now.",
  3: "Finding your location took too long. Please try again.",
};

export function useGeolocation() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const locate = useCallback(
    (onSuccess: (latitude: number, longitude: number) => void, onError?: (msg: string) => void) => {
      const fail = (message: string) => {
        setStatus("error");
        setError(message);
        onError?.(message);
      };
      if (!("geolocation" in navigator)) {
        fail("Your browser doesn't support location access.");
        return;
      }
      setStatus("locating");
      setError(null);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setStatus("idle");
          const { latitude, longitude, accuracy } = pos.coords;
          console.info("[Geolocation]", {
            latitude,
            longitude,
            accuracyMeters: Math.round(accuracy),
            mapUrl: `https://www.google.com/maps?q=${latitude},${longitude}`,
          });
          onSuccess(latitude, longitude);
        },
        (err) => fail(MESSAGES[err.code] ?? "Couldn't get your location."),
        { enableHighAccuracy: true, timeout: APP_CONFIG.geolocationTimeoutMs, maximumAge: 0 },
      );
    },
    [],
  );

  return { status, error, locate, isLocating: status === "locating" };
}
