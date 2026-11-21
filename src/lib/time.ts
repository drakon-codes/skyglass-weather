// Open-Meteo returns local ISO strings without offset ("2026-11-21T06:30") when timezone=auto.
// We read the parts directly so times display in the *city's* timezone, not the browser's.

function parts(iso: string) {
  const [date = "", time = "00:00"] = iso.split("T");
  const [y = 1970, m = 1, d = 1] = date.split("-").map(Number);
  const [hh = 0, mm = 0] = time.split(":").map(Number);
  return { y, m, d, hh, mm };
}

/** "6:05 AM" */
export function formatClock(iso: string): string {
  const { hh, mm } = parts(iso);
  const suffix = hh < 12 ? "AM" : "PM";
  const hour12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${hour12}:${String(mm).padStart(2, "0")} ${suffix}`;
}

/** "6 AM" */
export function formatHour(iso: string): string {
  const { hh } = parts(iso);
  const suffix = hh < 12 ? "AM" : "PM";
  return `${hh % 12 === 0 ? 12 : hh % 12} ${suffix}`;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function weekdayIndex(iso: string): number {
  const { y, m, d } = parts(iso);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** "Today" for the first day, otherwise "Mon". */
export function formatDayLabel(isoDate: string, index: number): string {
  return index === 0 ? "Today" : (WEEKDAYS[weekdayIndex(isoDate)] ?? "");
}

/** "Sat, Nov 21 · 11:15 AM" */
export function formatLocalDateTime(iso: string): string {
  const { m, d } = parts(iso);
  return `${WEEKDAYS[weekdayIndex(iso)]}, ${MONTHS[m - 1]} ${d} · ${formatClock(iso)}`;
}
