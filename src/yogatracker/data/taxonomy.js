// Vocabulary for the log form and the parser. Kept in one place because the
// server-side parser (app/api/yoga/parse) is prompted with these exact lists —
// a screenshot that says "Slow Flow" should land on "Vinyasa", not invent a
// twelfth style. Anything unrecognised falls through to `null` and the user
// picks; we never guess a value that isn't here.

export const STYLES = [
  "Vinyasa",
  "Hatha",
  "Yin",
  "Restorative",
  "Power",
  "Ashtanga",
  "Iyengar",
  "Kundalini",
  "Prenatal",
  "Meditation",
  "Breathwork",
  "Mobility",
];

// Where the practice came from. `source_detail` carries the specific channel,
// studio, or app name — the source itself stays a small closed set so the
// insights view can group by it.
export const SOURCES = [
  { value: "youtube", label: "YouTube" },
  { value: "app", label: "App" },
  { value: "studio", label: "Studio" },
  { value: "live", label: "Live online" },
  { value: "self", label: "Self-practice" },
  { value: "other", label: "Other" },
];

export const SOURCE_LABEL = Object.fromEntries(SOURCES.map((s) => [s.value, s.label]));

// Focus areas double as the coverage picture in Insights — what the body has
// and hasn't been getting. Grouped for the picker; flat everywhere else.
export const FOCUS_GROUPS = [
  {
    group: "Lower body",
    items: ["Hips", "Hamstrings", "Quads", "Glutes", "Ankles & feet", "Low back"],
  },
  {
    group: "Upper body",
    items: ["Shoulders", "Chest", "Neck", "Wrists", "Upper back"],
  },
  {
    group: "Shapes",
    items: ["Backbends", "Forward folds", "Twists", "Inversions", "Balance", "Arm balances"],
  },
  {
    group: "Qualities",
    items: ["Core", "Strength", "Flexibility", "Mobility", "Recovery", "Calm", "Energy"],
  },
];

export const FOCUS_AREAS = FOCUS_GROUPS.flatMap((g) => g.items);

// Durations that cover ~95% of logged classes. Two taps to log: duration, save.
export const QUICK_DURATIONS = [10, 15, 20, 30, 45, 60, 75, 90];

export const DEFAULT_GOAL = { hours: 50, label: "50-hour goal" };
