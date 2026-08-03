"use client";
// The top of the page: consistency first (streak, this week), with total hours
// and goal progress present but secondary — hours are the slow number, the
// streak is the one that changes behaviour.
import { useMemo } from "react";
import { Card } from "./ui";
import {
  currentStreak, heatmap, longestStreak, sessionsPerWeek, thisWeek, totalMinutes,
} from "../lib/stats";
import { formatDuration, formatHours, relativeDay } from "../lib/dates";

function Stat({ value, label, sub, accent = false }) {
  return (
    <div className="min-w-0">
      <p
        className={`font-display leading-none ${
          accent ? "text-3xl sm:text-4xl text-yoga-sage" : "text-2xl sm:text-3xl"
        }`}
      >
        {value}
      </p>
      <p className="text-xs uppercase tracking-wide text-muted mt-1">{label}</p>
      {sub && <p className="text-[11px] text-muted/80 mt-0.5 truncate">{sub}</p>}
    </div>
  );
}

// Five buckets. The floor at 1 minute means any practice at all is visibly
// distinct from a rest day — the point of the grid is presence, not volume.
function level(minutes) {
  if (minutes <= 0) return 0;
  if (minutes < 20) return 1;
  if (minutes < 40) return 2;
  if (minutes < 70) return 3;
  return 4;
}

const LEVEL_CLASS = [
  "bg-surface-2",
  "bg-yoga-sage/25",
  "bg-yoga-sage/45",
  "bg-yoga-sage/70",
  "bg-yoga-sage",
];

function Heatmap({ sessions }) {
  const cols = useMemo(() => heatmap(sessions, 26), [sessions]);
  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <div className="flex gap-[3px] min-w-max" role="img" aria-label="Practice calendar, last 26 weeks">
        {cols.map((week) => (
          <div key={week[0].key} className="flex flex-col gap-[3px]">
            {week.map((day) => (
              <div
                key={day.key}
                title={
                  day.future
                    ? ""
                    : `${relativeDay(day.key)} — ${day.count ? formatDuration(day.minutes) : "rest"}`
                }
                className={`w-[11px] h-[11px] rounded-[2px] ${
                  day.future ? "opacity-0" : LEVEL_CLASS[level(day.minutes)]
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StatsHeader({ sessions, goal, onEditGoal }) {
  const minutes = totalMinutes(sessions);
  const streak = currentStreak(sessions);
  const best = longestStreak(sessions);
  const week = thisWeek(sessions);
  const perWeek = sessionsPerWeek(sessions);

  const goalHours = goal?.hours || 0;
  const pct = goalHours > 0 ? Math.min(100, (minutes / 60 / goalHours) * 100) : 0;
  const reached = goalHours > 0 && minutes / 60 >= goalHours;

  return (
    <Card className="p-4 sm:p-5 space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat
          accent
          value={streak}
          label={streak === 1 ? "day streak" : "day streak"}
          sub={best > 0 ? `best ${best}` : null}
        />
        <Stat
          value={week.sessions}
          label="this week"
          sub={week.minutes ? formatDuration(week.minutes) : "nothing yet"}
        />
        <Stat value={sessions.length} label="sessions" sub={perWeek ? `${perWeek}/week` : null} />
        <Stat value={`${formatHours(minutes)}`} label="hours" sub="total practised" />
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-3 mb-1.5">
          <p className="text-xs uppercase tracking-wide text-muted">
            {goalHours > 0 ? (
              <>
                {reached ? "Goal reached · " : ""}
                {formatHours(minutes)} / {goalHours} hrs
                {goal?.label ? <span className="normal-case tracking-normal"> · {goal.label}</span> : null}
              </>
            ) : (
              "No goal set"
            )}
          </p>
          <button
            type="button"
            onClick={onEditGoal}
            className="text-xs text-muted underline hover:text-text min-h-[32px]"
          >
            {goalHours > 0 ? "change goal" : "set a goal"}
          </button>
        </div>
        {goalHours > 0 && (
          <div
            className="h-2 rounded-full bg-surface-2 overflow-hidden"
            role="progressbar"
            aria-valuenow={Math.round(pct)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progress toward ${goalHours} hours`}
          >
            <div
              className={`h-full rounded-full transition-[width] duration-500 ${
                reached ? "bg-tea-amber" : "bg-yoga-sage"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </div>

      <Heatmap sessions={sessions} />
    </Card>
  );
}
