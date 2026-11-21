// React state persisted to localStorage. SSR-safe: server render uses `fallback`.
// `fallback` and `isValid` must be stable (module-level) references.
import { useCallback, useSyncExternalStore } from "react";

import { readStored, subscribeStored, writeStored } from "@/lib/storage";

export function usePersistentState<T>(
  key: string,
  fallback: T,
  isValid?: (value: unknown) => value is T,
) {
  const subscribe = useCallback((cb: () => void) => subscribeStored(key, cb), [key]);
  const value = useSyncExternalStore(
    subscribe,
    () => readStored(key, fallback, isValid),
    () => fallback,
  );

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = readStored(key, fallback, isValid);
      const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      writeStored(key, resolved);
    },
    [key, fallback, isValid],
  );

  return [value, setValue] as const;
}
