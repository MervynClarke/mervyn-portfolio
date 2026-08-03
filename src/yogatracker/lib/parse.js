"use client";
// Typed-text parsing.
//
// `parseLocal` covers the common "45 min vinyasa yesterday" case instantly and
// offline. Its counterpart for screenshots is `draftFromOcr` in screenshot.js;
// both produce the same draft shape, and both run entirely in the browser.
//
// The date rule matters and is shared: what the *user* typed wins over
// anything read off a screenshot, because class pages show the publish date,
// not when you practised. Absent an explicit statement, it's today.
import { STYLES } from "../data/taxonomy";
import { todayKey, addDays } from "./dates";

export const EMPTY_DRAFT = {
  practice_date: "",
  duration_minutes: 0,
  title: "",
  teacher: "",
  style: "",
  source: "",
  source_detail: "",
  url: "",
  focus: [],
  notes: "",
};

const STYLE_ALIASES = {
  flow: "Vinyasa",
  "slow flow": "Vinyasa",
  "power flow": "Power",
  vin: "Vinyasa",
  "yin yoga": "Yin",
  restore: "Restorative",
  "gentle": "Restorative",
  "hot yoga": "Power",
  pranayama: "Breathwork",
  breath: "Breathwork",
  meditate: "Meditation",
  stretch: "Mobility",
  "deep stretch": "Mobility",
};

// Returns { style, term } — `term` is the literal text that matched, so the
// caller can strip it out of the leftover title ("yin hip opener" → "hip opener").
function matchStyle(text) {
  const lower = text.toLowerCase();
  for (const s of STYLES) {
    if (lower.includes(s.toLowerCase())) return { style: s, term: s.toLowerCase() };
  }
  // Longest alias first, so "slow flow" wins over the "flow" it contains.
  const aliases = Object.entries(STYLE_ALIASES).sort((a, b) => b[0].length - a[0].length);
  for (const [alias, style] of aliases) {
    if (lower.includes(alias)) return { style, term: alias };
  }
  return { style: "", term: "" };
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

// Relative dates only ("yesterday", "last Friday", "3 days ago"). Absolute
// forms like "Aug 1" are left alone — guessing the year from a bare month and
// day is the kind of quiet wrongness that's worse than the date picker.
function matchRelativeDate(text) {
  const lower = text.toLowerCase();
  const today = todayKey();
  if (/\byesterday\b/.test(lower)) return addDays(today, -1);
  if (/\bday before yesterday\b/.test(lower)) return addDays(today, -2);
  if (/\btoday\b|\bthis morning\b|\btonight\b|\bthis evening\b/.test(lower)) return today;

  const ago = lower.match(/\b(\d+)\s*days?\s*ago\b/);
  if (ago) return addDays(today, -Math.min(365, Number(ago[1])));

  const weekday = lower.match(/\b(?:last\s+)?(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/);
  if (weekday) {
    const target = WEEKDAYS.indexOf(weekday[1]);
    const now = new Date();
    let back = (now.getDay() - target + 7) % 7;
    if (back === 0) back = 7; // "monday" said on a Monday means the previous one
    return addDays(today, -back);
  }
  return "";
}

function matchDuration(text) {
  const lower = text.toLowerCase();
  // "1h15", "1 hr 15 min", "1:15"
  const hm = lower.match(/\b(\d+)\s*(?:h|hr|hour)s?\s*(\d{1,2})?\s*(?:m|min)?/);
  if (hm) return Number(hm[1]) * 60 + Number(hm[2] || 0);
  const clock = lower.match(/\b(\d{1,2}):(\d{2})\b/);
  if (clock) return Number(clock[1]) * 60 + Number(clock[2]);
  const mins = lower.match(/\b(\d{1,3})\s*(?:m\b|min|minute)/);
  if (mins) return Number(mins[1]);
  // A bare number that reads like a class length.
  const bare = lower.match(/\b(10|15|20|25|30|40|45|50|60|75|90|120)\b/);
  if (bare) return Number(bare[1]);
  return 0;
}

function matchTeacher(text) {
  // "with Adriene", "by Kassandra", "w/ Tim"
  const m = text.match(/\b(?:with|w\/|by|taught by)\s+([A-Z][\w'’-]*(?:\s+[A-Z][\w'’-]*){0,2})/);
  return m ? m[1].trim() : "";
}

export function isUrl(text) {
  return /^https?:\/\/\S+$/i.test(text.trim());
}

/** Instant, offline parse of typed text. Returns a partial draft. */
export function parseLocal(text) {
  const trimmed = (text || "").trim();
  if (!trimmed) return { ...EMPTY_DRAFT };
  if (isUrl(trimmed)) return { ...EMPTY_DRAFT, url: trimmed, practice_date: todayKey() };

  const duration = matchDuration(trimmed);
  const { style, term } = matchStyle(trimmed);
  const teacher = matchTeacher(trimmed);
  const date = matchRelativeDate(trimmed) || todayKey();

  // Whatever's left after stripping the bits we understood becomes the title,
  // so "45 min yin hip opener with Adriene" keeps "hip opener".
  let title = trimmed
    .replace(/\b\d+\s*(?:h|hr|hour|m|min|minute)s?\b/gi, "")
    .replace(/\b\d{1,2}:\d{2}\b/g, "")
    .replace(/\b(?:with|w\/|by|taught by)\s+[A-Z][\w'’-]*(?:\s+[A-Z][\w'’-]*){0,2}/g, "")
    .replace(/\b(today|yesterday|this morning|tonight|this evening|last\s+\w+day|\d+\s*days?\s*ago)\b/gi, "");
  if (term) title = title.replace(new RegExp(`\\b${escapeRe(term)}\\b`, "i"), "");
  title = title
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s,.\-–—]+|[\s,.\-–—]+$/g, "")
    .trim();

  return {
    ...EMPTY_DRAFT,
    practice_date: date,
    duration_minutes: duration,
    style,
    teacher,
    title: title.length > 2 ? title : "",
  };
}

/** Merge one draft over another without letting blanks overwrite real values. */
export function mergeDrafts(base, incoming) {
  const out = { ...base };
  for (const [k, v] of Object.entries(incoming)) {
    if (v === "" || v == null) continue;
    if (Array.isArray(v) && v.length === 0) continue;
    if (k === "duration_minutes" && !v) continue;
    out[k] = v;
  }
  return out;
}
