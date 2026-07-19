# Tea Tasting — merv.work/TeaTasting

A mobile-first tea tasting log built around an interactive flavor wheel.
Input is a **sunburst** taxonomy (family → branch → note, tap to rate 0–5);
the record is a **radar** fingerprint over the nine flavor families. Sessions
save locally first (IndexedDB) and sync to Supabase when configured and
signed in. Any session exports as PNG / PDF / JSON / CSV — no email sending.

Follows the repo's mini-app pattern (`MINI-APPS.md`): app under
`src/teatasting/`, route at `src/app/TeaTasting/page.tsx`, CSS tokens scoped
to `.teatasting-app` in `globals.css`, global navbar hidden for the route in
`Navbar.tsx`. Lowercase `/teatasting` is rewritten to `/TeaTasting` in
`next.config.mjs` (a redirect would loop — Next matches sources
case-insensitively).

## The taxonomy file — `data/flavorWheel.json`

Single editable data file; components never hard-code vocabulary.

```jsonc
{
  "families": [
    {
      "id": "floral",            // stable — NEVER change once used
      "label": "Floral",
      "hanzi": "花香",           // optional, "" when unknown — don't invent
      "color": "#C75D93",        // light-mode hue (validated palette)
      "colorDark": "#CE6899",    // dark-mode hue
      "branches": [
        {
          "id": "floral.mild",
          "label": "Mild",
          "notes": [
            { "id": "floral.mild.osmanthus", "label": "Osmanthus", "hanzi": "桂花" }
          ]
        }
      ]
    }
  ]
}
```

**Rules**

- Ratings reference node `id`s. Renaming a `label` or adding `hanzi` is always
  safe; changing an `id` orphans every historical rating that used it.
- To add a note: append `{ "id": "family.branch.slug", "label": "..." }` to a
  branch's `notes`. New branches/families follow the same shape (a new family
  needs `color`/`colorDark` — keep them distinguishable from wheel-adjacent
  families; the light palette was validated for color-vision deficiency).
- Family-level ratings (from dragging a radar vertex) store under the family
  id itself (e.g. `"fruity"`), so they survive taxonomy edits below them.

## Data model

Client-side, a session is one denormalized document (see `emptySession()` in
`components/SessionForm.jsx`). In Postgres it's relational — `teas`,
`sessions`, and child tables `session_ratings`, `session_tastes`,
`session_mouthfeel`, `session_infusions`, `custom_notes`, `session_photos` —
defined in **`supabase/schema.sql`**. Photos are downscaled JPEG data URLs
(~100–200 KB) stored inline; fine at personal scale.

Teas dedupe by name (case-insensitive): logging a known name links the
session to the existing tea record, so all sessions of one tea accumulate on
its per-tea page.

## Storage & sync

- `lib/db.js` — IndexedDB stores: `teas`, `sessions`, `queue`.
- `lib/draft.js` — the in-progress form autosaves continuously to
  localStorage (photos ride in IDB); restored on reload until saved/discarded.
- `lib/storage.js` — local-first: reads from IDB; writes hit IDB then join the
  queue, which flushes to Supabase when online **and** signed in. Offline or
  signed-out, everything still works and the header shows the queue state.
- Without env vars the app runs permanently local-only (the sign-in sheet
  explains this).

## Supabase setup (~5 minutes, once)

1. Create a free project at [supabase.com](https://supabase.com).
2. SQL Editor → paste and run `src/teatasting/supabase/schema.sql` (tables +
   RLS: public read, authenticated write).
3. Authentication → Users → **Add user** (your email + a strong password).
4. Authentication → Sign In / Up → turn **off** "Allow new users to sign up"
   (so "authenticated" = you).
5. Project Settings → API → copy the URL and `anon public` key into:
   - `.env.local` (see `.env.example`) for local dev, and
   - Vercel → Project → Settings → Environment Variables, then redeploy.
6. Open /TeaTasting, tap the status dot → sign in. Any locally queued
   sessions push up automatically.

Visitors browse everything read-only; writes require your login (enforced by
RLS, not just UI).

## Export

From any saved session: **PNG** tasting card (radar-led, retina, light theme),
**PDF** one-page tasting sheet (both wheels + all notes), **JSON**/**CSV** raw
data. History view has bulk CSV. On mobile the Web Share API hands the file
straight to Mail/Messages; elsewhere it downloads.

## Conventions

- All SVG is hand-rolled — no charting library. Keep `lib/theme.js` THEME in
  sync with the `.teatasting-app` CSS vars; exporters use the hex values.
- Tap targets ≥ 44 px; every wheel interaction has a parallel accessible List
  mode with identical controls.
- No analytics, no external CDNs, no email.
