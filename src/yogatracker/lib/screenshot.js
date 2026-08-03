"use client";
// Turning OCR output into a draft session.
//
// OCR gives us text and geometry, not meaning — so this is openly heuristic.
// It aims to be right often enough to save typing and wrong in ways that are
// obvious at a glance, since everything lands in an editable card either way.
// When a signal is weak it returns nothing rather than guessing: a blank field
// is quicker to fill than a plausible-looking wrong one is to notice.
//
// Reliability, roughly: duration and style are dependable (distinctive
// patterns and a closed vocabulary), title is usually right, teacher and
// channel are a coin-flip on unfamiliar sources and near-certain on ones
// you've logged before.
import { FOCUS_AREAS, STYLES } from "../data/taxonomy";
import { EMPTY_DRAFT } from "./parse";
import { todayKey } from "./dates";

// Interface furniture that shows up in class-page screenshots. Never a title,
// never a teacher.
const CHROME = new RegExp(
  [
    "subscribe", "subscribed", "share", "download", "save", "remix", "clip",
    "sign in", "sign up", "search", "home", "shorts", "library", "playlist",
    "watch later", "settings", "more", "show more", "show less", "read more",
    "views?$", "watching", "ago$", "premieres", "live now", "up next",
    "autoplay", "captions", "quality", "playback", "add to", "thanks",
    "comments?$", "replies", "reply", "sort by", "top comments",
    "start(ing)? (class|workout)", "resume", "begin", "preview", "free trial",
    "min(ute)?s? left", "remaining", "completed", "\\bnow playing\\b",
  ].join("|"),
  "i"
);

const NOISE_ONLY = /^[^a-z0-9]*$/i;

// Buttons that sit on the *same visual row* as real content — YouTube puts
// Subscribe beside the channel name, apps put Save/Share beside the title — so
// OCR returns them merged into one line. Rejecting the whole line as chrome
// would throw away the content with it; strip the words instead.
const CHROME_WORDS =
  /\b(subscribe[d]?|share|download|save|remix|clip|more|settings|join|follow(ing)?|like)\b/gi;

function stripChromeWords(t) {
  return t.replace(CHROME_WORDS, "").replace(/\s{2,}/g, " ").replace(/^[\s|·—-]+|[\s|·—-]+$/g, "").trim();
}

function isChrome(line) {
  const t = line.trim();
  if (t.length < 3 || NOISE_ONLY.test(t)) return true;
  if (CHROME.test(t)) return true;
  // "1.2M views", "3 days ago", "12:04 PM" — metadata rows, not content.
  if (/^\d[\d.,kmb]*\s*(views?|subscribers?|likes?)/i.test(t)) return true;
  if (/^\d+\s+(second|minute|hour|day|week|month|year)s?\s+ago/i.test(t)) return true;
  return false;
}

/**
 * Class length. A class page usually shows several clock-shaped numbers —
 * total runtime, elapsed position, a timestamp — so we collect every
 * plausible one and take the largest, which is the runtime in practice.
 */
function findDuration(text) {
  const candidates = [];

  for (const m of text.matchAll(/\b(\d{1,2}):([0-5]\d):([0-5]\d)\b/g)) {
    candidates.push(Number(m[1]) * 60 + Number(m[2]));
  }
  // A runtime of 45:32 belongs to a class advertised as "45 min" — take whole
  // minutes rather than rounding up, so the logged number matches the label.
  for (const m of text.matchAll(/\b(\d{1,3}):([0-5]\d)\b(?!:)/g)) {
    candidates.push(Number(m[1]));
  }
  for (const m of text.matchAll(/\b(\d{1,3})\s*[-–]?\s*(?:min|mins|minute|minutes)\b/gi)) {
    candidates.push(Number(m[1]));
  }
  for (const m of text.matchAll(/\b(\d{1,2})\s*(?:h|hr|hour|hours)\s*(\d{1,2})?\s*(?:m|min)?/gi)) {
    candidates.push(Number(m[1]) * 60 + Number(m[2] || 0));
  }

  const plausible = candidates.filter((n) => n >= 3 && n <= 180);
  return plausible.length ? Math.max(...plausible) : 0;
}

function findStyle(text) {
  const lower = text.toLowerCase();
  // Longest name first so "power vinyasa" doesn't resolve on "vinyasa" alone
  // when a more specific style is present.
  const ordered = [...STYLES].sort((a, b) => b.length - a.length);
  return ordered.find((s) => lower.includes(s.toLowerCase())) || "";
}

function findFocus(text) {
  const lower = text.toLowerCase();
  return FOCUS_AREAS.filter((f) => {
    const needle = f.toLowerCase();
    // Single short words like "core" or "hips" need a word boundary; the
    // multi-word ones are distinctive enough to match loosely.
    if (needle.includes(" ")) return lower.includes(needle);
    return new RegExp(`\\b${needle}\\b`).test(lower);
  }).slice(0, 6);
}

const SOURCE_HINTS = [
  { test: /youtube|subscribe|\bviews\b|watch later/i, source: "youtube" },
  { test: /peloton|alo moves|glo\b|down ?dog|gaia|openfit|apple fitness/i, source: "app" },
  { test: /zoom|livestream|live class/i, source: "live" },
  { test: /studio|\bmat \d|front desk|check ?in/i, source: "studio" },
];

function findSource(text) {
  return SOURCE_HINTS.find((h) => h.test.test(text))?.source || "";
}

const APP_NAMES = [
  "Peloton", "Alo Moves", "Glo", "Down Dog", "Gaia", "Openfit",
  "Apple Fitness", "YouTube",
];

function findSourceDetail(text, lines, knownDetails, title) {
  // A channel or app you've logged before beats any guess.
  const known = knownDetails.find((d) =>
    d.length > 2 && text.toLowerCase().includes(d.toLowerCase())
  );
  if (known) return known;

  const app = APP_NAMES.find((a) => text.toLowerCase().includes(a.toLowerCase()));
  if (app && app !== "YouTube") return app;

  // Channel names on video pages very often contain "yoga" — but so do class
  // titles, and the title is usually the first such line on the page. Skip it
  // explicitly or the channel just mirrors the title.
  const yogaish = lines
    .map((l) => stripChromeWords(l.text))
    .find(
      (t) =>
        /yoga|movement|flow|studio/i.test(t) &&
        !isChrome(t) &&
        t.length >= 3 &&
        t.length < 40 &&
        t !== title
    );
  return yogaish || "";
}

// A person's name: one to three capitalised words, no digits, not a sentence.
const NAME_LIKE = /^[A-Z][a-z'’-]+(?:\s+[A-Z][a-z'’-]+){0,2}$/;

function findTeacher(text, lines, knownTeachers) {
  const known = knownTeachers.find((t) =>
    t.length > 2 && text.toLowerCase().includes(t.toLowerCase())
  );
  if (known) return known;

  // Match per line, and only across horizontal whitespace. Run against the
  // joined text with `\s`, this swallows the next line too — "Yoga with
  // Adriene" followed by a button row yields "Adriene Subscribe Share".
  const WITH_NAME = /\b(?:with|w\/|by|taught by|instructor:?)[^\S\n]+([A-Z][\w'’-]*(?:[^\S\n]+[A-Z][\w'’-]*){0,2})/;
  for (const line of text.split("\n")) {
    const m = line.match(WITH_NAME);
    if (m) {
      const name = m[1].trim();
      // Trailing interface words ride along when OCR merges a row; drop them.
      const cleaned = name
        .split(/\s+/)
        .filter((w) => !CHROME.test(w))
        .join(" ")
        .trim();
      if (cleaned) return cleaned;
    }
  }

  const nameLine = lines.find(
    (l) => NAME_LIKE.test(l.text) && !isChrome(l.text) && !/yoga|flow|class/i.test(l.text)
  );
  return nameLine ? nameLine.text : "";
}

/**
 * The title is the tallest non-chrome line. Font size survives OCR far more
 * reliably than reading order does, and on every class page the class name is
 * the largest text on screen.
 */
function findTitle(lines) {
  const candidates = lines
    .map((l) => ({ ...l, text: stripChromeWords(l.text) }))
    .filter((l) => !isChrome(l.text) && l.text.length >= 4 && /[a-z]{3}/i.test(l.text));
  if (candidates.length === 0) return "";
  const tallest = [...candidates].sort((a, b) => b.height - a.height)[0];
  // Strip a trailing runtime that got swept into the same line.
  return tallest.text.replace(/\s*[|·—-]?\s*\d{1,2}:\d{2}(?::\d{2})?\s*$/, "").trim();
}

/**
 * Build a draft from OCR output.
 *
 * `knownTeachers` / `knownDetails` come from previously logged sessions —
 * recognising a name you've used before is the single biggest accuracy win
 * available here, and it costs nothing.
 */
export function draftFromOcr({ lines, text }, { knownTeachers = [], knownDetails = [] } = {}) {
  const joined = text || lines.map((l) => l.text).join("\n");
  const teacher = findTeacher(joined, lines, knownTeachers);
  const title = findTitle(lines);

  return {
    ...EMPTY_DRAFT,
    // Always today. A screenshot shows when the class was *published*, never
    // when it was practised, so there is nothing here worth reading a date from.
    practice_date: todayKey(),
    duration_minutes: findDuration(joined),
    title: title === teacher ? "" : title,
    teacher,
    style: findStyle(joined),
    source: findSource(joined),
    source_detail: findSourceDetail(joined, lines, knownDetails, title),
    focus: findFocus(joined),
  };
}
