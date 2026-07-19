"use client";
// Compare 2–3 sessions: overlaid radar polygons + a note-intensity diff table.
import { useMemo } from "react";
import RadarChart from "./RadarChart";
import { FAMILIES, familyRollups, nodeLabel, getNode } from "../lib/taxonomy";
import { useThemeColors } from "../lib/theme";
import { Panel } from "./ui";

const SERIES_COLORS = ["#C4883A", "#256FAD", "#C75D93"];

export default function CompareView({ sessions, teaById, onBack, onOpen }) {
  const { dark, colors } = useThemeColors();

  const series = sessions.map((s, i) => {
    const rollups = familyRollups(s.ratings);
    const maxValues = {};
    for (const f of FAMILIES) maxValues[f.id] = rollups[f.id].max;
    return {
      maxValues,
      stroke: SERIES_COLORS[i],
      label: `${teaById[s.tea_id]?.name || "?"} · ${s.brewed_at || "?"}`,
    };
  });

  // Union of all rated note ids (plus custom labels), for the diff table.
  const rows = useMemo(() => {
    const ids = new Map(); // key -> {label, isCustom}
    for (const s of sessions) {
      for (const [id, r] of Object.entries(s.ratings || {}))
        if (r.intensity > 0)
          ids.set(id, { label: nodeLabel(id) + (getNode(id)?.kind !== "note" ? " (family)" : "") });
      for (const c of s.custom_notes || [])
        if (c.intensity > 0) ids.set(`custom:${c.label}`, { label: `${c.label} (custom)` });
    }
    const list = [...ids.entries()].map(([key, meta]) => {
      const values = sessions.map((s) =>
        key.startsWith("custom:")
          ? s.custom_notes?.find((c) => c.label === key.slice(7))?.intensity || 0
          : s.ratings?.[key]?.intensity || 0
      );
      const spread = Math.max(...values) - Math.min(...values);
      return { key, label: meta.label, values, spread };
    });
    // Biggest differences first — that's what comparison is for.
    return list.sort((a, b) => b.spread - a.spread || Math.max(...b.values) - Math.max(...a.values));
  }, [sessions]);

  return (
    <div className="space-y-4 pb-16">
      <button type="button" onClick={onBack} className="text-sm text-muted hover:text-text min-h-[44px]">
        ← History
      </button>
      <h2 className="font-display text-2xl font-bold">Compare</h2>

      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {series.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onOpen(sessions[i].id)}
            className="inline-flex items-center gap-1.5 text-sm hover:underline"
          >
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.stroke }} aria-hidden="true" />
            {s.label}
          </button>
        ))}
      </div>

      <Panel title="Radar overlay">
        <RadarChart series={series} colors={colors} dark={dark} showVertices={false} />
      </Panel>

      <Panel title="Note differences" subtitle="largest spread first">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[420px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-line">
                <th className="py-2 pr-3">Note</th>
                {series.map((s, i) => (
                  <th key={i} className="py-2 px-2 text-center">
                    <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.stroke }} aria-label={s.label} />
                  </th>
                ))}
                <th className="py-2 pl-2 text-right">Δ</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key} className="border-b border-line/60 last:border-0">
                  <td className="py-2 pr-3">{r.label}</td>
                  {r.values.map((v, i) => (
                    <td key={i} className={`py-2 px-2 text-center font-mono ${v ? "" : "text-muted/50"}`}>
                      {v || "·"}
                    </td>
                  ))}
                  <td className={`py-2 pl-2 text-right font-mono ${r.spread >= 2 ? "font-semibold" : "text-muted"}`}>
                    {r.spread}
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={series.length + 2} className="py-6 text-center text-muted">
                    No rated notes in these sessions.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
