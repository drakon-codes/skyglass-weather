// Tiny localStorage-backed store used with useSyncExternalStore.
// Values are cached by raw string so snapshots stay referentially stable.

type Listener = () => void;

const listeners = new Map<string, Set<Listener>>();
const cache = new Map<string, { raw: string | null; value: unknown }>();

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null; // Storage disabled (private mode, SSR, etc.)
  }
}

export function readStored<T>(key: string, fallback: T, isValid?: (v: unknown) => v is T): T {
  const raw = readRaw(key);
  const cached = cache.get(key);
  if (cached && cached.raw === raw) return cached.value as T;

  let value: T = fallback;
  if (raw !== null) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!isValid || isValid(parsed)) value = parsed as T;
    } catch {
      // Corrupt value: fall back silently.
    }
  }
  cache.set(key, { raw, value });
  return value;
}

export function writeStored<T>(key: string, value: T): void {
  const raw = JSON.stringify(value);
  try {
    window.localStorage.setItem(key, raw);
  } catch {
    // Quota or disabled storage: keep the in-memory value anyway.
  }
  cache.set(key, { raw, value });
  listeners.get(key)?.forEach((listener) => listener());
}

export function subscribeStored(key: string, listener: Listener): () => void {
  const set = listeners.get(key) ?? new Set<Listener>();
  set.add(listener);
  listeners.set(key, set);
  // Keep tabs in sync.
  const onStorage = (event: StorageEvent) => {
    if (event.key === key) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    set.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
