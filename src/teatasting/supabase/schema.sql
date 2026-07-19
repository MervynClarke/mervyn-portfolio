-- Tea Tasting schema for Supabase (Postgres).
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
--
-- Access model: PUBLIC READ / PRIVATE WRITE.
--   * anyone (anon key) can SELECT — the tasting log is a public page
--   * only an authenticated user can INSERT/UPDATE/DELETE
-- Create exactly one user (Authentication → Users → Add user) and disable
-- public signups (Authentication → Sign In / Up → toggle "Allow new users to
-- sign up" OFF) so "authenticated" means "Mervyn".

create table if not exists teas (
  id uuid primary key,
  name text not null,
  type text,
  origin text,
  cultivar text,
  harvest_year text,
  vendor text,
  price text,
  created_at timestamptz not null default now()
);

create table if not exists sessions (
  id uuid primary key,
  tea_id uuid not null references teas(id) on delete cascade,
  brewed_at date,
  method text,
  vessel text,
  water_temp_c numeric,
  leaf_g numeric,
  water_ml numeric,
  water_type text,
  rinse boolean,
  infusion_count integer,
  dry_leaf_notes text,
  infused_leaf_notes text,
  liquor_clarity text,
  liquor_color text,
  complexity text,
  hui_gan integer check (hui_gan between 0 and 5),
  cha_qi integer check (cha_qi between 0 and 5),
  overall_rating integer check (overall_rating between 1 and 5),
  drink_again text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists session_ratings (
  id bigint generated always as identity primary key,
  session_id uuid not null references sessions(id) on delete cascade,
  node_id text not null,           -- flavorWheel.json node id (family/branch/note)
  intensity integer not null check (intensity between 0 and 5),
  note text
);

create table if not exists session_tastes (
  id bigint generated always as identity primary key,
  session_id uuid not null references sessions(id) on delete cascade,
  taste text not null,             -- sourness | sweetness | bitterness | saltiness | umami
  intensity integer not null check (intensity between 0 and 5)
);

create table if not exists session_mouthfeel (
  id bigint generated always as identity primary key,
  session_id uuid not null references sessions(id) on delete cascade,
  dimension text not null,         -- aftertaste | fullness | smoothness | fineness | purity
  value integer not null check (value between -3 and 3)
);

create table if not exists session_infusions (
  id bigint generated always as identity primary key,
  session_id uuid not null references sessions(id) on delete cascade,
  infusion_number integer not null,
  steep_seconds integer,
  note text
);

create table if not exists custom_notes (
  id bigint generated always as identity primary key,
  session_id uuid not null references sessions(id) on delete cascade,
  label text not null,
  intensity integer check (intensity between 0 and 5),
  note text
);

create table if not exists session_photos (
  id bigint generated always as identity primary key,
  session_id uuid not null references sessions(id) on delete cascade,
  kind text not null check (kind in ('dry','infused','liquor')),
  data_url text not null           -- downscaled JPEG data URL (~100–200 KB)
);

create index if not exists idx_sessions_tea on sessions(tea_id);
create index if not exists idx_ratings_session on session_ratings(session_id);
create index if not exists idx_ratings_node on session_ratings(node_id);
create index if not exists idx_tastes_session on session_tastes(session_id);
create index if not exists idx_mouthfeel_session on session_mouthfeel(session_id);
create index if not exists idx_infusions_session on session_infusions(session_id);
create index if not exists idx_custom_session on custom_notes(session_id);
create index if not exists idx_photos_session on session_photos(session_id);

-- Row Level Security: public read, authenticated write.
do $$
declare t text;
begin
  foreach t in array array['teas','sessions','session_ratings','session_tastes',
                           'session_mouthfeel','session_infusions','custom_notes','session_photos']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "public read" on %I', t);
    execute format('create policy "public read" on %I for select using (true)', t);
    execute format('drop policy if exists "authed insert" on %I', t);
    execute format('create policy "authed insert" on %I for insert to authenticated with check (true)', t);
    execute format('drop policy if exists "authed update" on %I', t);
    execute format('create policy "authed update" on %I for update to authenticated using (true) with check (true)', t);
    execute format('drop policy if exists "authed delete" on %I', t);
    execute format('create policy "authed delete" on %I for delete to authenticated using (true)', t);
  end loop;
end $$;
