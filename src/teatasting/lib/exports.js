"use client";
// Session export: PNG tasting card (radar-led), one-page PDF tasting sheet,
// JSON/CSV raw data, bulk CSV. All client-side; Web Share API on mobile with
// download fallback. Exports always render on the light theme for print/mail.
import { FAMILIES, familyRollups, getNode, nodeLabel, topNotes } from "./taxonomy";
import { polar, TAU } from "./geometry";
import { THEME } from "./theme";

const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const FONT = "'Inter','Segoe UI',system-ui,sans-serif";
const SERIF = "Georgia,'Times New Roman',serif";

// ── Radar as an SVG string (mirrors RadarChart.jsx) ──────────────────────
export function radarSvgString(maxValues, meanValues, { size = 420, stroke = "#C4883A" } = {}) {
  const C = THEME.light;
  const cx = size / 2;
  const cy = size / 2;
  const rMax = size * 0.37;
  const rLabel = rMax + size * 0.045;
  const angle = (i) => (i / FAMILIES.length) * TAU;
  const pts = (values) =>
    FAMILIES.map((f, i) =>
      polar(cx, cy, (Math.min(5, Math.max(0, values[f.id] || 0)) / 5) * rMax, angle(i)).join(",")
    ).join(" ");

  let out = "";
  for (let v = 1; v <= 5; v++)
    out += `<circle cx="${cx}" cy="${cy}" r="${(v / 5) * rMax}" fill="none" stroke="${C.line}" stroke-width="${v === 5 ? 1.2 : 0.7}"/>`;
  FAMILIES.forEach((f, i) => {
    const a = angle(i);
    const [x1, y1] = polar(cx, cy, rMax, a);
    const [dx, dy] = polar(cx, cy, rMax + 7, a);
    const [tx, ty] = polar(cx, cy, rLabel, a);
    const anchor = Math.abs(Math.sin(a)) < 0.15 ? "middle" : Math.sin(a) > 0 ? "start" : "end";
    out += `<line x1="${cx}" y1="${cy}" x2="${x1}" y2="${y1}" stroke="${C.line}" stroke-width="0.7"/>`;
    out += `<circle cx="${dx}" cy="${dy}" r="4" fill="${f.color}"/>`;
    out += `<text x="${tx}" y="${ty + 4}" text-anchor="${anchor}" font-family="${FONT}" font-size="${size * 0.028}" font-weight="500" fill="${C.text}">${esc(f.label)}</text>`;
  });
  if (meanValues)
    out += `<polygon points="${pts(meanValues)}" fill="${stroke}" fill-opacity="0.10" stroke="${stroke}" stroke-opacity="0.35" stroke-width="1" stroke-dasharray="4 3"/>`;
  out += `<polygon points="${pts(maxValues)}" fill="${stroke}" fill-opacity="0.22" stroke="${stroke}" stroke-width="2" stroke-linejoin="round"/>`;
  FAMILIES.forEach((f, i) => {
    const v = Math.min(5, Math.max(0, maxValues[f.id] || 0));
    const [x, y] = polar(cx, cy, (v / 5) * rMax, angle(i));
    out += `<circle cx="${x}" cy="${y}" r="4.5" fill="${f.color}" stroke="#ffffff" stroke-width="1.5"/>`;
  });
  return out;
}

// ── Static full sunburst as an SVG string (for the PDF sheet) ────────────
import { leafCount, intensityFill } from "./taxonomy";
import { arcPath } from "./geometry";

export function sunburstSvgString(ratings, { size = 420 } = {}) {
  const C = THEME.light;
  const cx = size / 2;
  const cy = size / 2;
  const k = size / 400;
  // Mirrors the live wheel's idle layout: fat labeled family ring, thin
  // branch ring, notes as an intensity-filled indicator ring.
  const R = { hub: 33 * k, fam: [33 * k, 118 * k], br: [118 * k, 158 * k], note: [158 * k, 194 * k] };
  const counts = FAMILIES.map(leafCount);
  const total = counts.reduce((a, b) => a + b, 0);
  let out = "";
  let a = 0;
  FAMILIES.forEach((fam, fi) => {
    const famSpan = TAU * (counts[fi] / total);
    const famA0 = a;
    const famA1 = a + famSpan;
    out += `<path d="${arcPath(cx, cy, R.fam[0], R.fam[1], famA0, famA1)}" fill="${fam.color}" stroke="#ffffff" stroke-width="1.5"/>`;
    let ba = famA0;
    const famTotal = fam.branches.reduce((n, b) => n + b.notes.length, 0);
    for (const br of fam.branches) {
      const bSpan = famSpan * (br.notes.length / famTotal);
      out += `<path d="${arcPath(cx, cy, R.br[0], R.br[1], ba, ba + bSpan)}" fill="${intensityFill(fam.color, C.surface2, 1)}" stroke="#ffffff" stroke-width="1.2"/>`;
      const per = bSpan / br.notes.length;
      br.notes.forEach((note, ni) => {
        const intensity = ratings?.[note.id]?.intensity || 0;
        out += `<path d="${arcPath(cx, cy, R.note[0], R.note[1], ba + per * ni, ba + per * (ni + 1))}" fill="${intensity ? intensityFill(fam.color, "#ffffff", intensity) : "#ffffff"}" stroke="${intensity ? "#ffffff" : C.line}" stroke-width="${intensity ? 1.2 : 0.5}"/>`;
      });
      ba += bSpan;
    }
    // Radial family label inside the fat ring (white/dark ink per hue).
    const mid = (famA0 + famA1) / 2;
    const [lx, ly] = polar(cx, cy, R.fam[0] + 6 * k, mid);
    let deg = (mid * 180) / Math.PI - 90;
    let anchor = "start";
    if (deg > 90) {
      deg -= 180;
      anchor = "end";
    }
    const [rr, gg, bb] = [fam.color.slice(1, 3), fam.color.slice(3, 5), fam.color.slice(5, 7)].map((h) => parseInt(h, 16));
    const ink = 0.2126 * rr + 0.7152 * gg + 0.0722 * bb > 150 ? "#2c2c2c" : "#ffffff";
    out += `<text x="${lx}" y="${ly}" transform="rotate(${deg} ${lx} ${ly})" text-anchor="${anchor}" dominant-baseline="middle" font-family="${FONT}" font-size="${11 * k}" font-weight="600" fill="${ink}">${esc(fam.label)}</text>`;
    a = famA1;
  });
  out += `<circle cx="${cx}" cy="${cy}" r="${R.hub - 1}" fill="${C.surface2}" stroke="#ffffff" stroke-width="1.5"/>`;
  return out;
}

// ── SVG string → PNG canvas ──────────────────────────────────────────────
function svgToCanvas(svgMarkup, w, h, scale = 2) {
  return new Promise((resolve, reject) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${svgMarkup}</svg>`;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = w * scale;
      canvas.height = h * scale;
      const ctx = canvas.getContext("2d");
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      resolve(canvas);
    };
    img.onerror = () => reject(new Error("SVG rasterization failed"));
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
}

const fmtDate = (d) => (d ? d : "");
const drinkAgainLabel = { yes: "would drink again", no: "would not drink again", maybe: "might drink again" };

// ── PNG tasting card ─────────────────────────────────────────────────────
export async function exportPng(session, tea) {
  const W = 800;
  const rollups = familyRollups(session.ratings);
  const maxValues = {};
  const meanValues = {};
  for (const f of FAMILIES) {
    maxValues[f.id] = rollups[f.id].max;
    meanValues[f.id] = rollups[f.id].mean;
  }
  const rated = Object.entries(session.ratings || {})
    .filter(([id, r]) => r.intensity > 0 && getNode(id)?.kind === "note")
    .sort((a, b) => b[1].intensity - a[1].intensity);
  const custom = (session.custom_notes || []).filter((c) => c.intensity > 0);
  const legendRows = Math.ceil((rated.length + custom.length) / 2);
  const legendH = Math.max(1, legendRows) * 24 + 40;
  const H = 150 + 480 + legendH + 46;

  let out = `<rect width="${W}" height="${H}" fill="#ffffff"/>`;
  out += `<rect width="${W}" height="6" fill="#C4883A"/>`;
  out += `<text x="40" y="64" font-family="${SERIF}" font-size="30" font-weight="700" fill="#2c2c2c">${esc(tea?.name || "Tea session")}</text>`;
  const sub = [tea?.type, tea?.origin, tea?.harvest_year, fmtDate(session.brewed_at)].filter(Boolean).join(" · ");
  out += `<text x="40" y="92" font-family="${FONT}" font-size="15" fill="#6b6455">${esc(sub)}</text>`;
  const brew = [
    session.method,
    session.leaf_g && session.water_ml ? `${session.leaf_g}g / ${session.water_ml}ml (1:${Math.round(session.water_ml / session.leaf_g)})` : null,
    session.water_temp_c !== "" && session.water_temp_c != null ? `${session.water_temp_c}°C` : null,
    session.overall_rating ? `${"★".repeat(session.overall_rating)}${"☆".repeat(5 - session.overall_rating)}` : null,
  ].filter(Boolean).join(" · ");
  out += `<text x="40" y="116" font-family="${FONT}" font-size="14" fill="#6b6455">${esc(brew)}</text>`;

  out += `<g transform="translate(${(W - 480) / 2} 140)">${radarSvgString(maxValues, meanValues, { size: 480 })}</g>`;

  let y = 150 + 480 + 20;
  out += `<line x1="40" y1="${y - 8}" x2="${W - 40}" y2="${y - 8}" stroke="#ddd3bd" stroke-width="1"/>`;
  const all = [
    ...rated.map(([id, r]) => ({ label: nodeLabel(id), intensity: r.intensity, color: FAMILIES.find((f) => id.startsWith(f.id))?.color || "#777" })),
    ...custom.map((c) => ({ label: `${c.label} (custom)`, intensity: c.intensity, color: "#6b6455" })),
  ];
  all.forEach((n, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 40 + col * ((W - 80) / 2);
    const yy = y + 16 + row * 24;
    out += `<circle cx="${x + 5}" cy="${yy - 4}" r="5" fill="${n.color}"/>`;
    out += `<text x="${x + 18}" y="${yy}" font-family="${FONT}" font-size="13.5" fill="#2c2c2c">${esc(n.label)}</text>`;
    out += `<text x="${x + (W - 80) / 2 - 24}" y="${yy}" font-family="${FONT}" font-size="13.5" font-weight="600" fill="#2c2c2c">${n.intensity}/5</text>`;
  });
  out += `<text x="40" y="${H - 18}" font-family="${FONT}" font-size="11" fill="#9a917d">merv.work/TeaTasting</text>`;

  const canvas = await svgToCanvas(out, W, H, 2);
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
}

// ── PDF tasting sheet ────────────────────────────────────────────────────
export async function exportPdf(session, tea) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter" }); // 612 × 792
  const M = 44;
  const W = 612;

  doc.setFont("times", "bold").setFontSize(20);
  doc.text(tea?.name || "Tea session", M, M + 8);
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(107, 100, 85);
  const sub = [tea?.type, tea?.origin, tea?.cultivar, tea?.harvest_year, tea?.vendor, fmtDate(session.brewed_at)]
    .filter(Boolean).join("  ·  ");
  doc.text(sub, M, M + 24);
  doc.setDrawColor(196, 136, 58).setLineWidth(2);
  doc.line(M, M + 32, W - M, M + 32);

  // Brew block
  doc.setTextColor(44, 44, 44).setFontSize(9);
  const ratio = session.leaf_g && session.water_ml ? `1:${Math.round(session.water_ml / session.leaf_g)}` : "—";
  const brewBits = [
    ["Method", session.method || "—"], ["Vessel", session.vessel || "—"],
    ["Temp", session.water_temp_c !== "" && session.water_temp_c != null ? `${session.water_temp_c}°C` : "—"],
    ["Leaf", session.leaf_g ? `${session.leaf_g} g` : "—"],
    ["Water", session.water_ml ? `${session.water_ml} ml` : "—"], ["Ratio", ratio],
    ["Rinse", session.rinse == null ? "—" : session.rinse ? "yes" : "no"],
    ["Infusions", session.infusion_count || "—"],
  ];
  let bx = M;
  const by = M + 52;
  for (const [k, v] of brewBits) {
    doc.setFont("helvetica", "bold").text(String(k).toUpperCase(), bx, by, { charSpace: 0.4 });
    doc.setFont("helvetica", "normal").text(String(v), bx, by + 12);
    bx += 65;
  }

  // Wheels side by side
  const rollups = familyRollups(session.ratings);
  const maxValues = {};
  const meanValues = {};
  for (const f of FAMILIES) {
    maxValues[f.id] = rollups[f.id].max;
    meanValues[f.id] = rollups[f.id].mean;
  }
  const radarCanvas = await svgToCanvas(radarSvgString(maxValues, meanValues, { size: 420 }), 420, 420, 2);
  const sbCanvas = await svgToCanvas(sunburstSvgString(session.ratings, { size: 420 }), 420, 420, 2);
  const wheelW = (W - M * 2 - 16) / 2;
  const wy = by + 30;
  doc.addImage(radarCanvas.toDataURL("image/png"), "PNG", M, wy, wheelW, wheelW);
  doc.addImage(sbCanvas.toDataURL("image/png"), "PNG", M + wheelW + 16, wy, wheelW, wheelW);

  let y = wy + wheelW + 24;

  // Notes grouped by family
  doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(44, 44, 44);
  doc.text("Flavor notes", M, y);
  y += 14;
  doc.setFontSize(9);
  for (const fam of FAMILIES) {
    const notes = Object.entries(session.ratings || {})
      .filter(([id, r]) => r.intensity > 0 && id.startsWith(`${fam.id}.`))
      .sort((a, b) => b[1].intensity - a[1].intensity)
      .map(([id, r]) => `${nodeLabel(id)} ${r.intensity}${r.note ? ` (“${r.note}”)` : ""}`);
    const famLevel = session.ratings?.[fam.id]?.intensity;
    if (famLevel) notes.unshift(`family ${famLevel}`);
    if (!notes.length) continue;
    doc.setFont("helvetica", "bold");
    doc.text(`${fam.label}:`, M, y);
    doc.setFont("helvetica", "normal");
    const wrapped = doc.splitTextToSize(notes.join(" · "), W - M * 2 - 80);
    doc.text(wrapped, M + 78, y);
    y += wrapped.length * 11 + 3;
  }
  const custom = (session.custom_notes || []).filter((c) => c.intensity > 0);
  if (custom.length) {
    doc.setFont("helvetica", "bold");
    doc.text("Custom:", M, y);
    doc.setFont("helvetica", "normal");
    const wrapped = doc.splitTextToSize(custom.map((c) => `${c.label} ${c.intensity}`).join(" · "), W - M * 2 - 80);
    doc.text(wrapped, M + 78, y);
    y += wrapped.length * 11 + 3;
  }

  // Taste, mouthfeel, hui gan / cha qi
  y += 8;
  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text("Taste & mouthfeel", M, y);
  y += 14;
  doc.setFontSize(9).setFont("helvetica", "normal");
  const tasteLine = Object.entries(session.tastes || {})
    .filter(([, v]) => v != null)
    .map(([t, v]) => `${t} ${v}/5`)
    .join(" · ");
  if (tasteLine) { doc.text(tasteLine, M, y); y += 12; }
  const mfLabels = {
    aftertaste: ["brief", "lasting"], fullness: ["light", "thick"],
    smoothness: ["astringent", "smooth"], fineness: ["rough", "fine"], purity: ["stuffy", "fresh"],
  };
  const mfLine = Object.entries(session.mouthfeel || {})
    .filter(([, v]) => v != null)
    .map(([d, v]) => {
      const [l, r] = mfLabels[d] || [d, d];
      return v === 0 ? `${l}/${r}: centered` : v > 0 ? `${r} +${v}` : `${l} ${v}`;
    }).join(" · ");
  if (mfLine) { doc.text(doc.splitTextToSize(mfLine, W - M * 2), M, y); y += 12; }
  const hg = [];
  if (session.hui_gan != null) hg.push(`hui gan 回甘 ${session.hui_gan}/5`);
  if (session.cha_qi != null) hg.push(`cha qi 茶氣 ${session.cha_qi}/5`);
  if (session.complexity) hg.push(`complexity: ${session.complexity}`);
  if (hg.length) { doc.text(hg.join(" · "), M, y); y += 12; }

  // Infusions
  if ((session.infusions || []).length) {
    y += 8;
    doc.setFont("helvetica", "bold").setFontSize(11);
    doc.text("Infusions", M, y);
    y += 13;
    doc.setFontSize(9).setFont("helvetica", "normal");
    for (const inf of session.infusions) {
      const line = `#${inf.infusion_number}  ${inf.steep_seconds ? `${inf.steep_seconds}s` : ""}  ${inf.note || ""}`.trim();
      doc.text(line, M, y);
      y += 11;
    }
  }

  // Verdict
  y += 8;
  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text("Verdict", M, y);
  y += 13;
  doc.setFont("helvetica", "normal").setFontSize(9);
  const verdictBits = [
    session.overall_rating ? `${session.overall_rating}/5 stars` : null,
    session.drink_again ? drinkAgainLabel[session.drink_again] : null,
  ].filter(Boolean).join(" · ");
  if (verdictBits) { doc.text(verdictBits, M, y); y += 12; }
  if (session.notes) {
    const wrapped = doc.splitTextToSize(session.notes, W - M * 2);
    doc.text(wrapped, M, y);
    y += wrapped.length * 11;
  }

  doc.setFontSize(8).setTextColor(154, 145, 125);
  doc.text("merv.work/TeaTasting", M, 792 - 24);
  return doc.output("blob");
}

// ── Raw data ─────────────────────────────────────────────────────────────
export function exportJson(session, tea) {
  return new Blob([JSON.stringify({ tea, session }, null, 2)], { type: "application/json" });
}

const csvCell = (v) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function exportCsv(session, tea) {
  const rows = [["section", "key", "value", "extra"]];
  for (const [k, v] of Object.entries(tea || {})) rows.push(["tea", k, v, ""]);
  for (const k of ["brewed_at", "method", "vessel", "water_temp_c", "leaf_g", "water_ml", "water_type", "rinse", "infusion_count", "liquor_clarity", "liquor_color", "complexity", "hui_gan", "cha_qi", "overall_rating", "drink_again", "notes", "dry_leaf_notes", "infused_leaf_notes"])
    rows.push(["session", k, session[k] ?? "", ""]);
  for (const [id, r] of Object.entries(session.ratings || {}))
    rows.push(["rating", id, r.intensity, r.note || ""]);
  for (const c of session.custom_notes || []) rows.push(["custom_note", c.label, c.intensity, c.note || ""]);
  for (const [t, v] of Object.entries(session.tastes || {})) rows.push(["taste", t, v, ""]);
  for (const [d, v] of Object.entries(session.mouthfeel || {})) rows.push(["mouthfeel", d, v, ""]);
  for (const inf of session.infusions || []) rows.push(["infusion", inf.infusion_number, inf.steep_seconds ?? "", inf.note || ""]);
  const csv = rows.map((r) => r.map(csvCell).join(",")).join("\r\n");
  return new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" });
}

export function exportBulkCsv(sessions, teas) {
  const teaById = Object.fromEntries(teas.map((t) => [t.id, t]));
  const head = [
    "date", "tea", "type", "origin", "method", "vessel", "ratio", "temp_c", "rating",
    "drink_again", "top_notes", "hui_gan", "cha_qi", "complexity",
    ...FAMILIES.map((f) => `${f.id}_max`),
  ];
  const rows = [head];
  for (const s of sessions) {
    const tea = teaById[s.tea_id] || {};
    const rollups = familyRollups(s.ratings);
    rows.push([
      s.brewed_at || "", tea.name || "", tea.type || "", tea.origin || "",
      s.method || "", s.vessel || "",
      s.leaf_g && s.water_ml ? `1:${Math.round(s.water_ml / s.leaf_g)}` : "",
      s.water_temp_c ?? "", s.overall_rating ?? "", s.drink_again || "",
      topNotes(s.ratings, 3).map((n) => `${n.label} ${n.intensity}`).join("; "),
      s.hui_gan ?? "", s.cha_qi ?? "", s.complexity || "",
      ...FAMILIES.map((f) => rollups[f.id].max || ""),
    ]);
  }
  const csv = rows.map((r) => r.map(csvCell).join(",")).join("\r\n");
  return new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" });
}

// ── Delivery ─────────────────────────────────────────────────────────────
export async function shareOrDownload(blob, filename) {
  const file = new File([blob], filename, { type: blob.type });
  if (typeof navigator !== "undefined" && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: filename });
      return "shared";
    } catch (err) {
      if (err?.name === "AbortError") return "cancelled";
      // fall through to download
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return "downloaded";
}

export const exportBaseName = (session, tea) =>
  `${(tea?.name || "tea").replace(/[^\w\-]+/g, "-").toLowerCase()}-${session.brewed_at || "session"}`;
