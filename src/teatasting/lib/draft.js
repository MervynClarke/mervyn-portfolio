"use client";
// Continuous in-progress autosave. localStorage (synchronous, survives tab
// death mid-gongfu). Photos are excluded here to respect the ~5MB quota —
// they ride along in a parallel IndexedDB draft record.
import { idb } from "./db";

const KEY = "teatasting.draft.v1";
const DRAFT_PHOTO_ID = "__draft__";

export function saveDraft(draft) {
  try {
    const { photos, ...rest } = draft;
    localStorage.setItem(KEY, JSON.stringify(rest));
    idb.put("sessions", { id: DRAFT_PHOTO_ID, photos: photos || {} }).catch(() => {});
  } catch {
    /* quota or private mode — draft loss is acceptable, saving must not crash */
  }
}

export async function loadDraft() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw);
    const photoRec = await idb.get("sessions", DRAFT_PHOTO_ID).catch(() => null);
    draft.photos = photoRec?.photos || {};
    return draft;
  } catch {
    return null;
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(KEY);
    idb.delete("sessions", DRAFT_PHOTO_ID).catch(() => {});
  } catch {
    /* ignore */
  }
}
