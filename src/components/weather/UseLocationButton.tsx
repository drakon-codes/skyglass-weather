// "Use my location" — asks the browser for coordinates and selects them.
import { Loader2, LocateFixed } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/useGeolocation";
import { fromCoordinates } from "@/lib/location";
import type { GeoLocation } from "@/types/weather";

export function UseLocationButton({ onLocate }: { onLocate: (location: GeoLocation) => void }) {
  const { locate, isLocating } = useGeolocation();

  const handleClick = () =>
    locate(
      (lat, lon) => onLocate(fromCoordinates(lat, lon)),
      (message) => toast.error(message),
    );

  return (
    <Button
      variant="glass"
      size="pill"
      onClick={handleClick}
      disabled={isLocating}
      aria-label="Use my location"
      className="shrink-0 px-3 sm:px-4"
    >
      {isLocating ? <Loader2 className="animate-spin" /> : <LocateFixed />}
      <span className="hidden sm:inline">{isLocating ? "Locating…" : "My location"}</span>
    </Button>
  );
}
