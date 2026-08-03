-- Yoga Tracker schema (/YogaTracker).
-- Run once in the SQL editor of the Yoga Tracker Supabase project. Safe to
-- re-run: everything is IF NOT EXISTS or DROP POLICY IF EXISTS first.
--
-- Yoga Tracker has its own Supabase project, separate from Tea Tasting.

create table if not exists public.yoga_sessions (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),

  -- The day the practice actually happened, not when it was logged. Screenshot
  -- dates are publish dates, so this is always user-correctable in the UI.
  practice_date    date        not null,
  duration_minutes integer     not null check (duration_minutes > 0 and duration_minutes <= 600),

  title            text,
  teacher          text,
  style            text,
  source           text,        -- youtube | app | studio | live | self | other
  source_detail    text,        -- channel, studio, or app name
  url              text,
  focus            text[]       not null default '{}',
  notes            text,

  -- Nullable for now: the app is single-user and writes are gated on being
  -- authenticated at all. See the RLS note at the bottom to make it per-user.
  user_id          uuid references auth.users(id) on delete cascade
);

create index if not exists yoga_sessions_practice_date_idx
  on public.yoga_sessions (practice_date desc);

create index if not exists yoga_sessions_teacher_idx
  on public.yoga_sessions (teacher)
  where teacher is not null;

-- ── Row Level Security ──────────────────────────────────────────────────
-- Public read, authenticated write. The tracker is on a public portfolio site
-- and the log is not sensitive; only the signed-in owner can change anything.
-- Signups are disabled on the project, so "authenticated" means one account.

alter table public.yoga_sessions enable row level security;

drop policy if exists "yoga_sessions read" on public.yoga_sessions;
create policy "yoga_sessions read"
  on public.yoga_sessions for select
  using (true);

drop policy if exists "yoga_sessions insert" on public.yoga_sessions;
create policy "yoga_sessions insert"
  on public.yoga_sessions for insert
  to authenticated
  with check (true);

drop policy if exists "yoga_sessions update" on public.yoga_sessions;
create policy "yoga_sessions update"
  on public.yoga_sessions for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "yoga_sessions delete" on public.yoga_sessions;
create policy "yoga_sessions delete"
  on public.yoga_sessions for delete
  to authenticated
  using (true);

-- ── Tightening later ────────────────────────────────────────────────────
-- To make this multi-user, have the client send user_id on insert and swap the
-- four policies above for:
--
--   using (auth.uid() = user_id)            -- select / update / delete
--   with check (auth.uid() = user_id)       -- insert / update
--
-- and set `user_id uuid not null default auth.uid()`. Nothing else in the app
-- needs to change; storage.js already carries the column through.
