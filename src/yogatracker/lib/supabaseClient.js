"use client";
// Supabase is optional: without env vars the app runs local-only (IndexedDB)
// and every feature except cross-device sync still works.
//
// Yoga Tracker has its OWN Supabase project, separate from Tea Tasting, so it
// reads its own env vars. There is deliberately no fallback to the shared
// NEXT_PUBLIC_SUPABASE_* pair — those point at the Tea Tasting project, which
// has no yoga_sessions table, and quietly writing there would fail in
// confusing ways. Unset simply means local-only.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_YOGA_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_YOGA_SUPABASE_ANON_KEY;

export const supabase = url && anonKey ? createClient(url, anonKey) : null;
export const supabaseConfigured = Boolean(supabase);
