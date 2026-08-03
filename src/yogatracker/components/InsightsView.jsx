"use client";
// What the log adds up to: how much per week, who you actually practise with,
// and which parts of the body have been getting attention.
//
// Hand-rolled SVG/CSS bars rather than a chart library — three bar charts is
// not worth a dependency, and it keeps the palette on the app's CSS vars.
import { useMemo } from "react";
import { Card } from "./ui";
import { breakdown, focusBreakdown, weeklyMinutes } from "../lib/stats";
import { formatDay, formatDuration, formatHours } from "../lib/dates";
import { FOCUS_AREAS, SOURCE_LABEL } from "../data/taxonomy";

function WeeklyChart({ sessions }) {
  const weeks = useMemo(() => weeklyMinutes(sessions, 12), [sessions]);
  const peak = Math.max(60, ...weeks.map((w) => w.minutes));

  return (
    <Card className="p-4">
      <h3 className="font-display text-lg font-semibold mb-1">Last 12 weeks</h3>
      <p className="text-xs text-muted mb-4">Hours practised per week</p>
      <div className="flex items-end gap-1.5 h-32" role="img" aria-label="Hours per week, last 12 weeks">
        {weeks.map((w) => (
          <div key={w.start} className="flex-1 flex flex-col items-center gap-1 min-w-0">
            <span className="text-[10px] font-mono text-muted leading-none">
              {w.minutes ? Math.round(w.minutes / 6) / 10 : ""}
            </span>
            <div
              className={`w-full rounded-t ${w.minutes ? "bg-yoga-sage" : "bg-surface-2"}`}
              style={{ height: `${Math.max(w.minutes ? 4 : 2, (w.minutes / peak) * 100)}%` }}
              title={`Week of ${formatDay(w.start)} — ${formatDuration(w.minutes)} over ${w.count} ${
                w.count === 1 ? "session" : "sessions"
              }`}
            />
            <span className="text-[10px] text-muted leading-none truncate w-full text-center">
              {formatDay(w.start, { day: "numeric" })}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function BarList({ title, subtitle, rows, empty, unit = "hrs" }) {
  const peak = Math.max(1, ...rows.map((r) => r.minutes));
  return (
    <Card className="p-4">
      <h3 className="font-display text-lg font-semibold mb-1">{title}</h3>
      <p className="text-xs text-muted mb-3">{subtitle}</p>
      {rows.length === 0 ? (
        <p className="text-sm text-muted">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.label}>
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="truncate">{r.label}</span>
                <span className="font-mono text-xs text-muted shrink-0">
                  {unit === "hrs" ? `${formatHours(r.minutes)} hrs` : `${r.count}×`}
                </span>
              </div>
              <div className="h-1.5 mt-1 rounded-full bg-surface-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-yoga-sage"
                  style={{ width: `${(r.minutes / peak) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function FocusCoverage({ sessions }) {
  const hits = useMemo(() => focusBreakdown(sessions, 100), [sessions]);
  const byLabel = new Map(hits.map((h) => [h.label, h]));
  const peak = Math.max(1, ...hits.map((h) => h.count));
  const untouched = FOCUS_AREAS.filter((f) => !byLabel.has(f));

  return (
    <Card className="p-4">
      <h3 className="font-display text-lg font-semibold mb-1">Focus coverage</h3>
      <p className="text-xs text-muted mb-3">
        How often each area comes up. Faint means it hasn&apos;t.
      </p>
      <div className="flex flex-wrap gap-1.5">
        {FOCUS_AREAS.map((f) => {
          const hit = byLabel.get(f);
          const weight = hit ? 0.25 + (hit.count / peak) * 0.75 : 0;
          return (
            <span
              key={f}
              title={hit ? `${hit.count} ${hit.count === 1 ? "session" : "sessions"}` : "not yet"}
              className={`px-2.5 py-1.5 rounded-lg border text-[13px] ${
                hit ? "border-transparent text-text" : "border-line border-dashed text-muted/60"
              }`}
              style={hit ? { backgroundColor: `rgb(var(--yoga-sage-rgb) / ${weight * 0.55})` } : undefined}
            >
              {f}
              {hit && <span className="ml-1.5 font-mono text-[11px] text-muted">{hit.count}</span>}
            </span>
          );
        })}
      </div>
      {untouched.length > 0 && sessions.length > 0 && (
        <p className="text-xs text-muted mt-3">
          {untouched.length} {untouched.length === 1 ? "area" : "areas"} untouched so far.
        </p>
      )}
    </Card>
  );
}

export default function InsightsView({ sessions }) {
  const styles = useMemo(() => breakdown(sessions, "style"), [sessions]);
  const teachers = useMemo(() => breakdown(sessions, "teacher"), [sessions]);
  const sources = useMemo(
    () =>
      breakdown(sessions, "source").map((r) => ({ ...r, label: SOURCE_LABEL[r.label] || r.label })),
    [sessions]
  );
  const channels = useMemo(() => breakdown(sessions, "source_detail", 6), [sessions]);

  if (sessions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="font-display text-lg mb-1">Nothing to show yet</p>
        <p className="text-sm text-muted">Log a few practices and the patterns turn up here.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <WeeklyChart sessions={sessions} />
      <div className="grid gap-4 sm:grid-cols-2">
        <BarList
          title="Styles"
          subtitle="Time by style of practice"
          rows={styles}
          empty="No styles tagged yet."
        />
        <BarList
          title="Teachers"
          subtitle="Who you practise with"
          rows={teachers}
          empty="No teachers recorded yet."
        />
        <BarList
          title="Where"
          subtitle="Time by source"
          rows={sources}
          empty="No sources recorded yet."
        />
        <BarList
          title="Channels & studios"
          subtitle="Time by channel, studio, or app"
          rows={channels}
          empty="No channels recorded yet."
        />
      </div>
      <FocusCoverage sessions={sessions} />
    </div>
  );
}
