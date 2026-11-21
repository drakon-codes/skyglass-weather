// Debounced city autocomplete backed by the geocoding API.
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { APP_CONFIG } from "@/config";
import { searchCities } from "@/services/weatherApi";
import { useDebouncedValue } from "./useDebouncedValue";

export function useCitySearch(rawQuery: string) {
  const query = useDebouncedValue(rawQuery.trim(), APP_CONFIG.searchDebounceMs);
  const enabled = query.length >= APP_CONFIG.searchMinChars;

  const result = useQuery({
    queryKey: ["cities", query.toLowerCase()],
    queryFn: ({ signal }) => searchCities(query, signal),
    enabled,
    staleTime: 60 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  // True while the user is still typing (debounce pending) or a request is in flight.
  const isPending = rawQuery.trim() !== query || (enabled && result.isFetching);

  return { ...result, query, enabled, isPending };
}
