"use client";
// Local-first storage with cloud sync.
//
// Reads always come from the IndexedDB cache (instant, offline-capable).
// Writes hit the cache first, then join a queue that flushes to Supabase
// whenever we're online AND signed in (RLS: anyone may read, only an
// authenticated user may write). Without Supabase env vars everything still
// works — the queue just never flushes and the app reports "local-only".
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
export const listTeas = () => idb.getAll("teas");
export const listSessions = () => idb.getAll("sessions");
export const getSession = (id) => idb.get("sessions", id);
export const getTea = (id) => idb.get("teas", id);

// ── Tea dedupe: same name (case-insensitive) links to the existing record ──
export async function findTeaByName(name) {
  const teas = await listTeas();
  const needle = name.trim().toLowerCase();
  return teas.find((t) => t.name.trim().toLowerCase() === needle) || null;
}

// ── Writes ───────────────────────────────────────────────────────────────
export async function saveSession(session, tea) {
  const now = new Date().toISOString();
  tea = { ...tea, created_at: tea.created_at || now };
  session = {
    ...session,
    tea_id: tea.id,
    created_at: session.created_at || now,
    updated_at: now,
  };
  await idb.put("teas", tea);
  await idb.put("sessions", session);
  await idb.put("queue", { op: "upsert", session, tea, at: now });
  await refreshPending();
  emitData();
  flushQueue();
  return session;
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
const SESSION_COLS = [
  "id", "tea_id", "brewed_at", "method", "vessel", "water_temp_c", "leaf_g",
  "water_ml", "water_type", "rinse", "infusion_count", "dry_leaf_notes",
  "infused_leaf_notes", "liquor_clarity", "liquor_color", "complexity",
  "hui_gan", "cha_qi", "overall_rating", "drink_again", "notes",
  "created_at", "updated_at",
];

function sessionRow(s) {
  const row = {};
  for (const c of SESSION_COLS) row[c] = s[c] ?? null;
  return row;
}

async function pushSession(tea, s) {
  let res = await supabase.from("teas").upsert({
    id: tea.id, name: tea.name, type: tea.type ?? null, origin: tea.origin ?? null,
    cultivar: tea.cultivar ?? null, harvest_year: tea.harvest_year ?? null,
    vendor: tea.vendor ?? null, price: tea.price ?? null, created_at: tea.created_at,
  });
  if (res.error) throw res.error;
  res = await supabase.from("sessions").upsert(sessionRow(s));
  if (res.error) throw res.error;

  const children = [
    ["session_ratings", Object.entries(s.ratings || {})
      .filter(([, r]) => (r?.intensity || 0) > 0)
      .map(([node_id, r]) => ({ session_id: s.id, node_id, intensity: r.intensity, note: r.note || null }))],
    ["session_tastes", Object.entries(s.tastes || {})
      .filter(([, v]) => v != null)
      .map(([taste, intensity]) => ({ session_id: s.id, taste, intensity }))],
    ["session_mouthfeel", Object.entries(s.mouthfeel || {})
      .filter(([, v]) => v != null)
      .map(([dimension, value]) => ({ session_id: s.id, dimension, value }))],
    ["session_infusions", (s.infusions || []).map((inf, i) => ({
      session_id: s.id, infusion_number: inf.infusion_number ?? i + 1,
      steep_seconds: inf.steep_seconds ?? null, note: inf.note || null }))],
    ["custom_notes", (s.custom_notes || []).map((c) => ({
      session_id: s.id, label: c.label, intensity: c.intensity ?? null, note: c.note || null }))],
    ["session_photos", Object.entries(s.photos || {})
      .filter(([, url]) => url)
      .map(([kind, data_url]) => ({ session_id: s.id, kind, data_url }))],
  ];
  for (const [table, rows] of children) {
    res = await supabase.from(table).delete().eq("session_id", s.id);
    if (res.error) throw res.error;
    if (rows.length) {
      res = await supabase.from(table).insert(rows);
      if (res.error) throw res.error;
    }
  }
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
      if (item.op === "upsert") await pushSession(item.tea, item.session);
      else if (item.op === "delete") {
        const res = await supabase.from("sessions").delete().eq("id", item.sessionId);
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
    const [teasRes, sessionsRes] = await Promise.all([
      supabase.from("teas").select("*"),
      supabase
        .from("sessions")
        .select(
          "*, session_ratings(node_id,intensity,note), session_tastes(taste,intensity), session_mouthfeel(dimension,value), session_infusions(infusion_number,steep_seconds,note), custom_notes(label,intensity,note), session_photos(kind,data_url)"
        ),
    ]);
    if (teasRes.error) throw teasRes.error;
    if (sessionsRes.error) throw sessionsRes.error;

    // Don't clobber local records that still have queued (unpushed) writes.
    const queued = new Set(
      (await idb.getAll("queue")).map((q) => q.session?.id || q.sessionId)
    );
    for (const tea of teasRes.data) await idb.put("teas", tea);
    for (const row of sessionsRes.data) {
      if (queued.has(row.id)) continue;
      const s = { ...row };
      s.ratings = {};
      for (const r of row.session_ratings || [])
        s.ratings[r.node_id] = { intensity: r.intensity, note: r.note || "" };
      s.tastes = {};
      for (const t of row.session_tastes || []) s.tastes[t.taste] = t.intensity;
      s.mouthfeel = {};
      for (const m of row.session_mouthfeel || []) s.mouthfeel[m.dimension] = m.value;
      s.infusions = (row.session_infusions || []).sort(
        (a, b) => a.infusion_number - b.infusion_number
      );
      s.custom_notes = row.custom_notes || [];
      s.photos = {};
      for (const p of row.session_photos || []) s.photos[p.kind] = p.data_url;
      delete s.session_ratings; delete s.session_tastes; delete s.session_mouthfeel;
      delete s.session_infusions; delete s.session_photos;
      await idb.put("sessions", s);
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
