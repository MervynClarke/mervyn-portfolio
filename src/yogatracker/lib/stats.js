"use client";
// Everything the header and Insights view read. Pure functions over the
// session list — no state, no storage — so they're cheap to recompute on
// every render and easy to reason about.
import { todayKey, addDays, weekStart, daysBetween } from "./dates";

/** Set of practice_date keys that have at least one session. */
export function practiceDays(sessions) {
  return new Set(sessions.map((s) => s.practice_date).filter(Boolean));
}

export function totalMinutes(sessions) {
  return sessions.reduce((sum, s) => sum + (Number(s.duration_minutes) || 0), 0);
}

/**
 * Current streak in consecutive days, counting back from today.
 *
 * Today not being logged yet does not break the streak — it's still early.
 * The streak only ends once *yesterday* is also missing, so a run stays alive
 * through the day you haven't practised yet and breaks the morning after.
 */
export function currentStreak(sessions, today = todayKey()) {
  const days = practiceDays(sessions);
  if (days.size === 0) return 0;
  let cursor = days.has(today) ? today : addDays(today, -1);
  if (!days.has(cursor)) return 0;
  let n = 0;
  while (days.has(cursor)) {
    n += 1;
    cursor = addDays(cursor, -1);
  }
  return n;
}

export function longestStreak(sessions) {
  const days = [...practiceDays(sessions)].sort();
  let best = 0;
  let run = 0;
  let prev = null;
  for (const day of days) {
    run = prev && daysBetween(prev, day) === 1 ? run + 1 : 1;
    prev = day;
    if (run > best) best = run;
  }
  return best;
}

/** Sessions and minutes inside the current Monday-start week. */
export function thisWeek(sessions, today = todayKey()) {
  const start = weekStart(today);
  const inWeek = sessions.filter((s) => s.practice_date >= start && s.practice_date <= today);
  return { sessions: inWeek.length, minutes: totalMinutes(inWeek), start };
}

/** Average sessions per week over the weeks since the first logged practice. */
export function sessionsPerWeek(sessions, today = todayKey()) {
  if (sessions.length === 0) return 0;
  const first = sessions.reduce((min, s) => (s.practice_date < min ? s.practice_date : min), today);
  const weeks = Math.max(1, daysBetween(first, today) / 7);
  return Math.round((sessions.length / weeks) * 10) / 10;
}

/**
 * Calendar heatmap grid: `weeks` Monday-start columns ending with the week
 * containing today. Each cell is { key, minutes, count, future }.
 */
export function heatmap(sessions, weeks = 26, today = todayKey()) {
  const byDay = new Map();
  for (const s of sessions) {
    const prev = byDay.get(s.practice_date) || { minutes: 0, count: 0 };
    byDay.set(s.practice_date, {
      minutes: prev.minutes + (Number(s.duration_minutes) || 0),
      count: prev.count + 1,
    });
  }
  const lastMonday = weekStart(today);
  const firstMonday = addDays(lastMonday, -7 * (weeks - 1));
  const cols = [];
  for (let w = 0; w < weeks; w += 1) {
    const col = [];
    for (let d = 0; d < 7; d += 1) {
      const key = addDays(firstMonday, w * 7 + d);
      const hit = byDay.get(key);
      col.push({
        key,
        minutes: hit?.minutes || 0,
        count: hit?.count || 0,
        future: key > today,
      });
    }
    cols.push(col);
  }
  return cols;
}

/** Minutes per week for the last `weeks` weeks, oldest first. */
export function weeklyMinutes(sessions, weeks = 12, today = todayKey()) {
  const out = [];
  for (let i = weeks - 1; i >= 0; i -= 1) {
    const start = addDays(weekStart(today), -7 * i);
    const end = addDays(start, 6);
    const inWeek = sessions.filter((s) => s.practice_date >= start && s.practice_date <= end);
    out.push({ start, end, minutes: totalMinutes(inWeek), count: inWeek.length });
  }
  return out;
}

/**
 * Group by a single-value field (style, teacher, source) and rank by minutes.
 * Sessions with the field empty are skipped rather than bucketed as "Unknown" —
 * a partly-filled log shouldn't invent a category.
 */
export function breakdown(sessions, field, limit = 8) {
  const map = new Map();
  for (const s of sessions) {
    const key = (s[field] || "").trim();
    if (!key) continue;
    const prev = map.get(key) || { minutes: 0, count: 0 };
    map.set(key, {
      minutes: prev.minutes + (Number(s.duration_minutes) || 0),
      count: prev.count + 1,
    });
  }
  return [...map.entries()]
    .map(([label, v]) => ({ label, ...v }))
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, limit);
}

/** Same, for the multi-value `focus` array — one session can hit several. */
export function focusBreakdown(sessions, limit = 20) {
  const map = new Map();
  for (const s of sessions) {
    for (const f of s.focus || []) {
      const prev = map.get(f) || { minutes: 0, count: 0 };
      map.set(f, {
        minutes: prev.minutes + (Number(s.duration_minutes) || 0),
        count: prev.count + 1,
      });
    }
  }
  return [...map.entries()]
    .map(([label, v]) => ({ label, ...v }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Recent distinct classes, newest first — the "log it again" list. Keyed by
 * title+teacher so the same class logged five times shows once.
 */
export function recentClasses(sessions, limit = 6) {
  const seen = new Map();
  const sorted = [...sessions].sort((a, b) =>
    (b.practice_date || "").localeCompare(a.practice_date || "")
  );
  for (const s of sorted) {
    if (!s.title && !s.teacher) continue;
    const key = `${(s.title || "").toLowerCase()}|${(s.teacher || "").toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.set(key, s);
    if (seen.size >= limit) break;
  }
  return [...seen.values()];
}

/** Distinct non-empty values of a field, most-used first — for datalists. */
export function knownValues(sessions, field) {
  return breakdown(sessions, field, 200).map((b) => b.label);
}
