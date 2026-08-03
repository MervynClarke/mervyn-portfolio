"use client";
// Local-first storage with cloud sync.
//
// Reads always come from the IndexedDB cache (instant, offline-capable).
// Writes hit the cache first, then join a queue that flushes to Supabase
// whenever we're online AND signed in (RLS: anyone may read, only an
// authenticated user may write). Without Supabase env vars everything still
// works — the queue just never flushes and the app reports "local only".
import { idb } from "./db";
import { supabase, supabaseConfigured } from "./supabaseClient";

const listeners = new Set();
let state = {
  mode: supabaseConfigured ? "cloud" : "local",
  online: true,
  pending: 0,
  user: null,
  syncing: false,
  lastError: null,
};

function emit() {
  for (const l of listeners) l({ ...state });
}

export function subscribeStatus(fn) {
  listeners.add(fn);
  fn({ ...state });
  return () => listeners.delete(fn);
}

const dataListeners = new Set();
export function subscribeData(fn) {
  dataListeners.add(fn);
  return () => dataListeners.delete(fn);
}
function emitData() {
  for (const l of dataListeners) l();
}

export const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

// ── Reads ────────────────────────────────────────────────────────────────
export const listSessions = () => idb.getAll("sessions");
export const getSession = (id) => idb.get("sessions", id);

// ── Writes ───────────────────────────────────────────────────────────────
export async function saveSession(session) {
  const now = new Date().toISOString();
  const row = {
    ...session,
    id: session.id || newId(),
    created_at: session.created_at || now,
    updated_at: now,
  };
  await idb.put("sessions", row);
  await idb.put("queue", { op: "upsert", session: row, at: now });
  await refreshPending();
  emitData();
  flushQueue();
  return row;
}

export async function deleteSession(id) {
  await idb.delete("sessions", id);
  await idb.put("queue", { op: "delete", sessionId: id, at: new Date().toISOString() });
  await refreshPending();
  emitData();
  flushQueue();
}

async function refreshPending() {
  const q = await idb.getAll("queue");
  state.pending = q.length;
  emit();
}

// ── Supabase mapping ─────────────────────────────────────────────────────
const COLS = [
  "id", "practice_date", "duration_minutes", "title", "teacher", "style",
  "source", "source_detail", "url", "focus", "notes", "created_at", "updated_at",
];

function toRow(s) {
  const row = {};
  for (const c of COLS) row[c] = s[c] ?? null;
  // duration is the one numeric column a text input can feed; "" is not null,
  // and Postgres rejects it for an integer.
  const n = Number(s.duration_minutes);
  row.duration_minutes = Number.isFinite(n) ? Math.round(n) : 0;
  row.focus = Array.isArray(s.focus) ? s.focus : [];
  return row;
}

let flushing = false;
export async function flushQueue() {
  if (!supabaseConfigured || flushing) return;
  if (!state.user) {
    await refreshPending();
    return; // queued until sign-in
  }
  flushing = true;
  state.syncing = true;
  state.lastError = null;
  emit();
  try {
    const items = (await idb.getAll("queue")).sort((a, b) => a.qid - b.qid);
    for (const item of items) {
      if (item.op === "upsert") {
        const res = await supabase.from("yoga_sessions").upsert(toRow(item.session));
        if (res.error) throw res.error;
      } else if (item.op === "delete") {
        const res = await supabase.from("yoga_sessions").delete().eq("id", item.sessionId);
        if (res.error) throw res.error;
      }
      await idb.delete("queue", item.qid);
    }
    state.online = true;
  } catch (err) {
    state.lastError = err?.message || String(err);
    if (/fetch|network|failed/i.test(state.lastError)) state.online = false;
  } finally {
    flushing = false;
    state.syncing = false;
    await refreshPending();
  }
}

// ── Pull: hydrate the cache from Supabase (reads are public) ─────────────
export async function pullAll() {
  if (!supabaseConfigured) return;
  try {
    const { data, error } = await supabase.from("yoga_sessions").select("*");
    if (error) throw error;

    // Don't clobber local records that still have queued (unpushed) writes.
    const queued = new Set(
      (await idb.getAll("queue")).map((q) => q.session?.id || q.sessionId)
    );
    for (const row of data) {
      if (queued.has(row.id)) continue;
      await idb.put("sessions", { ...row, focus: row.focus || [] });
    }
    state.online = true;
    emit();
    emitData();
  } catch (err) {
    state.lastError = err?.message || String(err);
    emit();
  }
}

// ── Auth ─────────────────────────────────────────────────────────────────
export async function signIn(email, password) {
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOut() {
  if (supabase) await supabase.auth.signOut();
}

// ── Init ─────────────────────────────────────────────────────────────────
let initialized = false;
export function initStorage() {
  if (initialized) return;
  initialized = true;
  state.online = typeof navigator === "undefined" ? true : navigator.onLine;
  window.addEventListener("online", () => {
    state.online = true;
    emit();
    flushQueue();
  });
  window.addEventListener("offline", () => {
    state.online = false;
    emit();
  });
  refreshPending();
  if (supabase) {
    supabase.auth.getSession().then(({ data }) => {
      state.user = data.session?.user || null;
      emit();
      flushQueue();
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      state.user = session?.user || null;
      emit();
      flushQueue();
    });
    pullAll();
  }
}

// ── Goal (device-local) ──────────────────────────────────────────────────
// The goal is a single number and a label; it lives in localStorage rather
// than a one-row Supabase table so there's no extra schema or RLS policy to
// maintain. Set it again if you switch devices.
const GOAL_KEY = "yogatracker:goal";

/**
 * `undefined` = never set (caller applies its default); `null` = deliberately
 * cleared. Collapsing the two would resurrect the default goal on every reload
 * after someone clears it.
 */
export function readGoal() {
  if (typeof localStorage === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(GOAL_KEY);
    return raw === null ? undefined : JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export function writeGoal(goal) {
  try {
    localStorage.setItem(GOAL_KEY, JSON.stringify(goal));
  } catch {
    /* private mode / quota — the app works fine without a persisted goal */
  }
}
