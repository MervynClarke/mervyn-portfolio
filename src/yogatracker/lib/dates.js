"use client";
// Every date in this app is a local calendar day held as "YYYY-MM-DD".
//
// Deliberately no Date-to-ISO round-tripping: `new Date("2026-08-03")` parses
// as UTC midnight, so anyone west of Greenwich renders it as the 2nd. Parsing
// and formatting both go through the helpers here, which only ever touch the
// local-time components.

export function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** "YYYY-MM-DD" -> Date at local midnight. */
export function fromKey(key) {
  const [y, m, d] = String(key).split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function addDays(key, n) {
  const d = fromKey(key);
  d.setDate(d.getDate() + n);
  return todayKey(d);
}

/** Whole days from `a` to `b` (b - a). Both "YYYY-MM-DD". */
export function daysBetween(a, b) {
  return Math.round((fromKey(b) - fromKey(a)) / 86400000);
}

/** Monday-start week key for the week containing `key`. */
export function weekStart(key) {
  const d = fromKey(key);
  const dow = (d.getDay() + 6) % 7; // Mon = 0
  d.setDate(d.getDate() - dow);
  return todayKey(d);
}

export function formatDay(key, opts = { month: "short", day: "numeric" }) {
  return fromKey(key).toLocaleDateString(undefined, opts);
}

/** "Today" / "Yesterday" / "Mon 3 Aug" — used everywhere a date is shown. */
export function relativeDay(key) {
  const diff = daysBetween(key, todayKey());
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff > 1 && diff < 7) return fromKey(key).toLocaleDateString(undefined, { weekday: "long" });
  return formatDay(key, {
    month: "short",
    day: "numeric",
    year: fromKey(key).getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  });
}

export function formatDuration(minutes) {
  const m = Math.max(0, Math.round(minutes || 0));
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem ? `${h}h ${rem}m` : `${h}h`;
}

/** Hours to one decimal, without a trailing ".0". */
export function formatHours(minutes) {
  const h = (minutes || 0) / 60;
  return h >= 100 ? String(Math.round(h)) : String(Math.round(h * 10) / 10);
}
