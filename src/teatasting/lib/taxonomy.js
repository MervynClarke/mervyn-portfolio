// Taxonomy helpers for the tea flavor wheel.
// Node ids are dot-paths: "family", "family.branch", "family.branch.note".
// Ratings may reference any level (family-level ratings come from radar drag).
import wheel from "../data/flavorWheel.json";

export const FAMILIES = wheel.families;

// Flat lookup: id -> { kind: "family"|"branch"|"note", node, family, branch? }
const byId = new Map();
for (const family of wheel.families) {
  byId.set(family.id, { kind: "family", node: family, family });
  for (const branch of family.branches) {
    byId.set(branch.id, { kind: "branch", node: branch, family, branch });
    for (const note of branch.notes) {
      byId.set(note.id, { kind: "note", node: note, family, branch });
    }
  }
}

export function getNode(id) {
  return byId.get(id) || null;
}

export function nodeLabel(id) {
  const hit = byId.get(id);
  return hit ? hit.node.label : id;
}

export function familyIdOf(nodeId) {
  return String(nodeId).split(".")[0];
}

export function familyOf(nodeId) {
  const hit = byId.get(familyIdOf(nodeId));
  return hit ? hit.node : null;
}

export function familyColor(familyId, dark = false) {
  const hit = byId.get(familyIdOf(familyId));
  if (!hit) return dark ? "#8a8a8a" : "#777777";
  return dark ? hit.family.colorDark || hit.family.color : hit.family.color;
}

export function leafCount(family) {
  return family.branches.reduce((n, b) => n + b.notes.length, 0);
}

// Mix a family hue toward the surface for unrated/low-intensity fills.
// intensity 0 (unrated) -> almost surface; 5 -> full family color.
export function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

export function mixHex(a, b, t) {
  const ra = hexToRgb(a);
  const rb = hexToRgb(b);
  const m = ra.map((v, i) => Math.round(v + (rb[i] - v) * t));
  return `#${m.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

// Fill for a note wedge given its rated intensity (0–5, or null for unrated).
export function intensityFill(color, surface, intensity) {
  if (intensity == null || intensity === 0) return surface;
  // 1 -> 25% of the way to full color, 5 -> 100%.
  const t = 0.1 + 0.9 * (intensity / 5);
  return mixHex(surface, color, t);
}

// Per-family rollups from a ratings map { nodeId: {intensity, note} }.
// max = highest intensity rated anywhere in the family (family-level ratings included).
// mean = mean intensity over rated (>0) nodes in the family.
export function familyRollups(ratings) {
  const out = {};
  for (const fam of wheel.families) out[fam.id] = { max: 0, mean: 0, count: 0 };
  let entries = ratings instanceof Map ? [...ratings.entries()] : Object.entries(ratings || {});
  for (const [nodeId, r] of entries) {
    const intensity = typeof r === "number" ? r : r?.intensity;
    if (!intensity) continue;
    const famId = familyIdOf(nodeId);
    if (!out[famId]) continue;
    out[famId].max = Math.max(out[famId].max, intensity);
    out[famId].mean += intensity;
    out[famId].count += 1;
  }
  for (const famId of Object.keys(out)) {
    const o = out[famId];
    o.mean = o.count ? o.mean / o.count : 0;
  }
  return out;
}

// Top rated notes for a session, for table rows and export headers.
export function topNotes(ratings, n = 3) {
  const entries = Object.entries(ratings || {})
    .map(([id, r]) => ({ id, intensity: typeof r === "number" ? r : r?.intensity || 0 }))
    .filter((e) => e.intensity > 0 && getNode(e.id)?.kind === "note")
    .sort((a, b) => b.intensity - a.intensity);
  return entries.slice(0, n).map((e) => ({ ...e, label: nodeLabel(e.id) }));
}
