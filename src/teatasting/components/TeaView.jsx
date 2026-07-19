"use client";
// Per-tea page: identity, rating trend across sessions, chronological list.
import { useMemo } from "react";
import { topNotes } from "../lib/taxonomy";
import { useThemeColors } from "../lib/theme";
import { Panel } from "./ui";

function TrendLine({ points, colors }) {
  // points: [{x: 0..1, rating: 1..5}]
  if (points.length < 2) return null;
  const W = 320;
  const H = 90;
  const px = (p, i) => 12 + (points.length === 1 ? 0 : (i / (points.length - 1)) * (W - 24));
  const py = (p) => H - 12 - ((p.rating - 1) / 4) * (H - 26);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-sm h-auto" role="img" aria-label={`Rating trend: ${points.map((p) => p.rating).join(", ")}`}>
      {[1, 3, 5].map((v) => (
        <line key={v} x1="12" x2={W - 12} y1={H - 12 - ((v - 1) / 4) * (H - 26)} y2={H - 12 - ((v - 1) / 4) * (H - 26)} stroke={colors.line} strokeWidth="0.7" />
      ))}
      <polyline
        points={points.map((p, i) => `${px(p, i)},${py(p)}`).join(" ")}
        fill="none"
        stroke={colors.accent}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {points.map((p, i) => (
        <circle key={i} cx={px(p, i)} cy={py(p)} r="3.5" fill={colors.accent} stroke={colors.surface} strokeWidth="1.5" />
      ))}
    </svg>
  );
}

export default function TeaView({ tea, sessions, onOpen, onBack }) {
  const { colors } = useThemeColors();
  const mine = useMemo(
    () =>
      sessions
        .filter((s) => s.tea_id === tea.id)
        .sort((a, b) => String(a.brewed_at || "").localeCompare(String(b.brewed_at || ""))),
    [sessions, tea]
  );
  const rated = mine.filter((s) => s.overall_rating);

  return (
    <div className="space-y-4 pb-16">
      <button type="button" onClick={onBack} className="text-sm text-muted hover:text-text min-h-[44px]">
        ← Back
      </button>
      <header>
        <h2 className="font-display text-2xl font-bold">{tea.name}</h2>
        <p className="text-sm text-muted">
          {[tea.type, tea.origin, tea.cultivar, tea.harvest_year, tea.vendor, tea.price].filter(Boolean).join(" · ")}
        </p>
        <p className="text-sm text-muted mt-1">
          {mine.length} session{mine.length === 1 ? "" : "s"}
          {rated.length ? ` · avg ${(rated.reduce((n, s) => n + s.overall_rating, 0) / rated.length).toFixed(1)}★` : ""}
        </p>
      </header>

      {rated.length >= 2 && (
        <Panel title="Rating trend">
          <TrendLine points={rated.map((s) => ({ rating: s.overall_rating }))} colors={colors} />
        </Panel>
      )}

      <div className="space-y-2">
        {mine.map((s) => {
          const top = topNotes(s.ratings, 3);
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onOpen(s.id)}
              className="w-full text-left rounded-xl border border-line bg-surface px-4 py-3 hover:border-tea-amber/60"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-muted">{s.brewed_at || "—"}</span>
                <span className="text-tea-amber dark:text-tea-amber-light text-sm">
                  {s.overall_rating ? "★".repeat(s.overall_rating) : ""}
                </span>
              </div>
              <p className="text-sm mt-0.5">
                {[s.method, s.vessel, s.leaf_g && s.water_ml ? `1:${Math.round(s.water_ml / s.leaf_g)}` : null]
                  .filter(Boolean).join(" · ") || "—"}
              </p>
              {top.length > 0 && (
                <p className="text-xs text-muted mt-0.5">{top.map((n) => `${n.label} ${n.intensity}`).join(" · ")}</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
