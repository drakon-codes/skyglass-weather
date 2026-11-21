// Light/dark mode. Falls back to the OS preference until the user picks one.
import { useCallback, useEffect, useSyncExternalStore } from "react";

import { STORAGE_KEYS } from "@/config";
import type { ThemeMode } from "@/types/weather";
import { usePersistentState } from "./usePersistentState";

const isThemeOrNull = (v: unknown): v is ThemeMode | null =>
  v === null || v === "light" || v === "dark";

const DARK_QUERY = "(prefers-color-scheme: dark)";

function subscribeSystem(cb: () => void) {
  const mql = window.matchMedia(DARK_QUERY);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
}

export function useTheme() {
  const [stored, setStored] = usePersistentState<ThemeMode | null>(
    STORAGE_KEYS.theme,
    null,
    isThemeOrNull,
  );
  const systemDark = useSyncExternalStore(
    subscribeSystem,
    () => window.matchMedia(DARK_QUERY).matches,
    () => false,
  );
  const theme: ThemeMode = stored ?? (systemDark ? "dark" : "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = useCallback(
    () => setStored(theme === "dark" ? "light" : "dark"),
    [theme, setStored],
  );

  return { theme, toggleTheme };
}

/** Inline script for <head>: applies the saved theme before first paint (no flash). */
export const THEME_INIT_SCRIPT = `(function(){try{var t=JSON.parse(localStorage.getItem(${JSON.stringify(
  STORAGE_KEYS.theme,
)}));if(t!=="light"&&t!=="dark"){t=matchMedia(${JSON.stringify(DARK_QUERY)}).matches?"dark":"light"}if(t==="dark")document.documentElement.classList.add("dark")}catch(e){}})()`;
