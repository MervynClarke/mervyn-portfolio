# Yoga Tracker (`/YogaTracker`)

A log for the yoga you practise. Built to be faster to use than not to use:
paste a screenshot of a class and it fills itself in, or tap one duration chip
and you're done. Everything is editable afterwards, because a screenshot's date
is the video's publish date and is wrong more often than it's right.

Follows the mini-app pattern in [`MINI-APPS.md`](../../MINI-APPS.md) and shares
Tea Tasting's surfaces (warm parchment / near-black forest green) with a sage
accent instead of amber.

## Layout

```
src/yogatracker/
  YogaTrackerApp.jsx      client entry — header, view switch, sheets, toasts
  components/
    StatsHeader.jsx       streak, this week, sessions, hours, goal bar, heatmap
    QuickLog.jsx          the three ways in (paste / type / repeat) + review card
    SessionFields.jsx     the editable field set, shared by new + edit
    SessionsList.jsx      the log; expand a row to edit, delete behind a confirm
    InsightsView.jsx      weekly chart, style/teacher/source bars, focus coverage
    GoalSheet.jsx         hours target + name
    AuthSheet.jsx         sign-in (single user; signups disabled)
    ui.jsx                primitives — inputs, chips, buttons, sheet, toast
  lib/
    storage.js            local-first store, write queue, sync, auth, goal
    db.js                 IndexedDB wrapper
    supabaseClient.js     optional Supabase client
    parse.js              typed-text parser
    ocr.js                Tesseract worker — loads the engine, returns lines
    screenshot.js         OCR lines -> draft session (heuristics)
    img.js                screenshot downscale + clipboard/drop extraction
    stats.js              streaks, weekly totals, heatmap, breakdowns
    dates.js              local-day "YYYY-MM-DD" helpers
    exports.js            CSV
  data/taxonomy.js        styles, sources, focus areas, quick durations
  supabase/schema.sql     table + RLS policies
src/app/YogaTracker/page.tsx     route (server component, exports metadata)
public/ocr/                      vendored Tesseract engine + English model
```

## Local setup

```bash
npm install
npm run dev
```

Open <http://localhost:3000/YogaTracker>. With no environment variables set the
app is fully usable — practices save to IndexedDB and the header reads
"local only". Screenshot reading works too; it needs no configuration.

## Environment variables

| Variable | Where | Needed for |
| --- | --- | --- |
| `NEXT_PUBLIC_YOGA_SUPABASE_URL` | browser + server | Cross-device sync |
| `NEXT_PUBLIC_YOGA_SUPABASE_ANON_KEY` | browser + server | Cross-device sync |

That's the whole list. There is no API key and no paid service anywhere in this
app — screenshot reading runs in the browser. Copy `.env.example` to
`.env.local` if you want sync; skip it entirely if you don't.

These are **`YOGA`-prefixed and deliberately distinct** from Tea Tasting's
`NEXT_PUBLIC_SUPABASE_*`. Yoga Tracker runs in its own Supabase project, so it
reads its own vars with no fallback to the shared pair — pointing this app at
the Tea Tasting project (which has no `yoga_sessions` table) would only produce
confusing write errors.

## Supabase

Yoga Tracker has its own Supabase project, separate from Tea Tasting.

1. Create the project (or use an existing Yoga-only one).
2. SQL Editor → paste [`supabase/schema.sql`](supabase/schema.sql) → Run.
3. Settings → API → copy the Project URL and the `anon` `public` key into
   `NEXT_PUBLIC_YOGA_SUPABASE_URL` / `NEXT_PUBLIC_YOGA_SUPABASE_ANON_KEY`.
4. Authentication → create one user (email + password), then turn **off** public
   signups (Authentication → Providers → Email → disable "Allow new users to
   sign up"). The site is public and RLS lets any authenticated user write, so a
   single closed account is the security boundary.
5. Confirm RLS: an anonymous `select` on `yoga_sessions` returns rows (200); an
   anonymous `insert` is rejected (401).
6. Sign in from the app header with the user from step 4.

The write queue holds anything logged while signed out or offline and flushes
on the next successful sign-in — nothing is lost in the meantime.

## Reading screenshots

Paste or drop a screenshot and it fills the form in. This runs entirely in the
browser via [Tesseract.js](https://tesseract.projectnaptha.com/) — no API key,
no per-use cost, no account that can lapse, and it works offline once cached.

Every asset is vendored in `public/ocr/` rather than fetched from a CDN, so
nothing in the chain can disappear or start rate-limiting:

| File | Size | What it is |
| --- | --- | --- |
| `eng.traineddata.gz` | 2.0 MB | English model (`tessdata_fast`) |
| `tesseract-core-simd-lstm.wasm.js` | 3.9 MB | Engine, WASM SIMD build |
| `tesseract-core-lstm.wasm.js` | 3.9 MB | Engine, baseline fallback |
| `worker.min.js` | 0.1 MB | Worker shim |

The engine is loaded on first paste, not on page load — most visits never need
it. First read takes a few seconds while ~6 MB downloads and caches; after that
it's about a second.

**Accuracy, honestly.** `screenshot.js` turns OCR text back into a session
using heuristics, and they are openly imperfect:

- **Duration and style** — dependable. A `45:32` runtime and a closed style
  vocabulary are both hard to misread.
- **Title** — usually right. It's the tallest non-interface line on the page,
  which survives OCR far better than reading order does.
- **Teacher and channel** — good on sources you've logged before (previously
  seen names are matched first), rougher on new ones.
- **Focus areas** — only tagged when the text actually says so.

Where a signal is weak it returns nothing rather than guessing. A blank field
is faster to fill than a plausible-looking wrong one is to notice.

**Two layout quirks worth knowing**, both found while testing and both handled:
interface buttons frequently share a visual row with real content (YouTube puts
*Subscribe* beside the channel name), so OCR merges them into one line — the
chrome words get stripped rather than the whole line discarded. And a class
title often contains the word "yoga" just like the channel does, so the title
is excluded explicitly when looking for the channel.

**Typed text is separate and instant.** `parse.js` handles
"45 min vinyasa yesterday with Adriene" with regexes, no engine load at all.
That path has always been the fastest way in and is unaffected by any of this.

## The goal

The hours target lives in `localStorage` under `yogatracker:goal`, not in
Supabase. It's one number, so a table and a policy weren't worth it — the
tradeoff is that you set it again on a new device. Clearing the goal is
remembered (the app won't resurrect the 50-hour default on the next load).

## Deploy

Vercel picks up the route with the rest of the site. If you want sync, add the
two Supabase variables in Project → Settings → Environment Variables, then
redeploy — Next inlines `NEXT_PUBLIC_*` at build time, so a redeploy is
required for the client to see them. The OCR assets are static files and need
no configuration at all.

`/yogatracker` is rewritten to `/YogaTracker` in `next.config.mjs`. Note this is
a **rewrite, not a redirect**: Next matches sources case-insensitively, so a
redirect would match its own destination and loop.

## Gotchas found while building

- Dates are local calendar days as `"YYYY-MM-DD"` throughout. `new Date("2026-08-03")`
  parses as *UTC* midnight, which renders as the 2nd anywhere west of Greenwich —
  hence `lib/dates.js` and no raw `Date` parsing anywhere else.
- The sage accent is stored as bare RGB channels (`--yoga-sage-rgb`) so the
  Tailwind token can be `rgb(var(--yoga-sage-rgb) / <alpha-value>)`. A CSS var
  holding a hex silently drops every `/15`-style opacity modifier, which would
  have flattened the heatmap's five levels into one.
- `worker.recognize()` returns **plain text only** by default in tesseract.js
  v7 — there is no flat `data.lines`. Line geometry needs
  `recognize(img, {}, { text: true, blocks: true })`, and lines live nested at
  `data.blocks[].paragraphs[].lines[]`. Miss this and title/channel detection
  silently returns nothing while duration and style still work, which is a
  confusing way to fail.
- The core file is pinned by an explicit SIMD probe rather than handing
  tesseract a directory. Left to choose, it probes for *relaxed* SIMD and
  requests a fourth engine build we don't ship, failing as an opaque
  `importScripts` error inside the worker.
- Anything that reads browser globals (`ocrSupported()`) must be resolved in an
  effect, not during render, or the first client render disagrees with the
  server's and hydration blows up.
- The preview pane runs headless: screenshots time out and rAF never fires.
  Verify with `read_page` / `javascript_tool` instead.
