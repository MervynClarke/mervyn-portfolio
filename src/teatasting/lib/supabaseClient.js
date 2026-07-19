"use client";
// Supabase is optional: without env vars the app runs in local-only mode
// (IndexedDB) and every feature except cross-device sync still works.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = url && anonKey ? createClient(url, anonKey) : null;
export const supabaseConfigured = Boolean(supabase);
