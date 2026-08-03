"use client";
// Entry for /YogaTracker. Two views (log / insights) on one route so the app
// works offline and no state crosses a page load it doesn't have to.
import { useEffect, useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import StatsHeader from "./components/StatsHeader";
import QuickLog from "./components/QuickLog";
import SessionsList from "./components/SessionsList";
import InsightsView from "./components/InsightsView";
import AuthSheet from "./components/AuthSheet";
import GoalSheet from "./components/GoalSheet";
import { Toast, useToast } from "./components/ui";
import {
  deleteSession, flushQueue, initStorage, listSessions, readGoal, saveSession,
  signOut, subscribeData, subscribeStatus, writeGoal,
} from "./lib/storage";
import { supabaseConfigured } from "./lib/supabaseClient";
import { totalMinutes } from "./lib/stats";
import { DEFAULT_GOAL } from "./data/taxonomy";
import { formatDuration, relativeDay } from "./lib/dates";

export default function YogaTrackerApp() {
  const [view, setView] = useState("log");
  const [sessions, setSessions] = useState([]);
  const [status, setStatus] = useState({ online: true, pending: 0, user: null });
  const [goal, setGoal] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authReason, setAuthReason] = useState("");
  const [goalOpen, setGoalOpen] = useState(false);
  const [toast, notify] = useToast();

  const refresh = () => listSessions().then((rows) => setSessions(rows.filter((r) => r?.id)));

  useEffect(() => {
    initStorage();
    refresh();
    const stored = readGoal();
    setGoal(stored === undefined ? DEFAULT_GOAL : stored);
    const un1 = subscribeStatus(setStatus);
    const un2 = subscribeData(refresh);
    return () => {
      un1();
      un2();
    };
  }, []);

  const syncLabel = !supabaseConfigured
    ? "local only"
    : !status.online
      ? "offline — queued"
      : status.pending > 0
        ? status.user
          ? `syncing ${status.pending}…`
          : `${status.pending} unsynced — sign in`
        : status.syncing
          ? "syncing…"
          : "synced";

  const syncDot = !supabaseConfigured
    ? "bg-line"
    : !status.online || (status.pending > 0 && !status.user)
      ? "bg-tea-amber"
      : status.pending > 0 || status.syncing
        ? "bg-tea-amber animate-pulse"
        : "bg-yoga-sage";

  async function handleSave(draft) {
    const saved = await saveSession(draft);
    notify(
      `Saved · ${formatDuration(saved.duration_minutes)} on ${relativeDay(saved.practice_date)}`
    );
  }

  async function handleDelete(session) {
    await deleteSession(session.id);
    notify("Practice deleted");
  }

  function handleGoal(next) {
    setGoal(next);
    writeGoal(next);
    setGoalOpen(false);
    notify(next ? `Goal set to ${next.hours} hours` : "Goal cleared");
  }

  function requestAuth(reason) {
    setAuthReason(reason || "");
    setAuthOpen(true);
  }

  return (
    <div className="yogatracker-app min-h-screen font-sans">
      <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur">
        {/* Tighter gutters and gaps below sm: the brand, both view tabs, the
            sync dot and the theme toggle only fit a 375px viewport without a
            horizontal scrollbar at these values. */}
        <div className="max-w-3xl mx-auto px-3 sm:px-4 h-14 flex items-center gap-2 sm:gap-3">
          <Link href="/" className="text-muted hover:text-text text-sm shrink-0" aria-label="Back to portfolio">
            ←
          </Link>
          <h1 className="font-display text-lg font-bold shrink-0">
            Yoga<span className="text-yoga-sage">Tracker</span>
          </h1>
          <nav className="flex gap-1 ml-1" aria-label="App views">
            {[
              { id: "log", label: "Log" },
              { id: "insights", label: "Insights" },
            ].map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setView(v.id)}
                aria-current={view === v.id ? "page" : undefined}
                className={`px-2.5 sm:px-3 py-1.5 min-h-[38px] rounded-lg text-sm ${
                  view === v.id ? "bg-yoga-sage/15 text-text font-medium" : "text-muted hover:text-text"
                }`}
              >
                {v.label}
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => (status.user ? signOut() : requestAuth(""))}
              className="hidden sm:flex items-center gap-1.5 text-xs text-muted hover:text-text min-h-[38px] px-1"
              title={status.user ? `Signed in as ${status.user.email} — tap to sign out` : "Sign in"}
            >
              <span className={`w-2 h-2 rounded-full ${syncDot}`} aria-hidden="true" />
              {syncLabel}
              <span className="text-line">·</span>
              {status.user ? "sign out" : "sign in"}
            </button>
            <button
              type="button"
              onClick={() => (status.user ? signOut() : requestAuth(""))}
              className="sm:hidden min-h-[38px] min-w-[38px] flex items-center justify-center"
              aria-label={status.user ? "Signed in — sign out" : `Sign in (${syncLabel})`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${syncDot}`} aria-hidden="true" />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-4 space-y-4">
        {status.lastError && status.pending > 0 && (
          <p className="text-xs rounded-lg border border-tea-amber/50 bg-tea-amber/10 px-3 py-2">
            Sync issue: {status.lastError} — changes are safe on this device and will retry.{" "}
            <button type="button" className="underline" onClick={() => flushQueue()}>
              Retry now
            </button>
          </p>
        )}

        <StatsHeader sessions={sessions} goal={goal} onEditGoal={() => setGoalOpen(true)} />

        {view === "log" ? (
          <>
            <QuickLog sessions={sessions} onSave={handleSave} notify={notify} />
            <SessionsList sessions={sessions} onSave={handleSave} onDelete={handleDelete} />
          </>
        ) : (
          <InsightsView sessions={sessions} />
        )}
      </main>

      <AuthSheet open={authOpen} reason={authReason} onClose={() => setAuthOpen(false)} />
      <GoalSheet
        open={goalOpen}
        goal={goal}
        totalMinutes={totalMinutes(sessions)}
        onSave={handleGoal}
        onClose={() => setGoalOpen(false)}
      />
      <Toast toast={toast} />
    </div>
  );
}
