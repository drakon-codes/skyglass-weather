// The city currently shown on the dashboard; remembered between visits.
import { DEFAULT_LOCATION, STORAGE_KEYS } from "@/config";
import { isGeoLocation } from "@/lib/location";
import { usePersistentState } from "./usePersistentState";

export function useSelectedLocation() {
  return usePersistentState(STORAGE_KEYS.lastLocation, DEFAULT_LOCATION, isGeoLocation);
}
