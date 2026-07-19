"use client";
// Entry for /TeaTasting. Client-side view routing (log / history / detail /
// tea / compare) — the whole app lives on one route so it works offline and
// state never crosses a page load it doesn't have to.
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import SessionForm from "./components/SessionForm";
import HistoryView from "./components/HistoryView";
import SessionDetail from "./components/SessionDetail";
import TeaView from "./components/TeaView";
import CompareView from "./components/CompareView";
import AuthSheet from "./components/AuthSheet";
import {
  initStorage, subscribeStatus, subscribeData, listTeas, listSessions,
  deleteSession, signOut, flushQueue,
} from "./lib/storage";
import { supabaseConfigured } from "./lib/supabaseClient";

export default function TeaTastingApp() {
  const [view, setView] = useState({ name: "history" });
  const [teas, setTeas] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [status, setStatus] = useState({ mode: "local", online: true, pending: 0, user: null });
  const [authOpen, setAuthOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const refresh = () =>
    Promise.all([listTeas(), listSessions()]).then(([t, s]) => {
      setTeas(t);
      setSessions(s.filter((x) => x.id !== "__draft__" && x.tea_id));
      setLoaded(true);
    });

  useEffect(() => {
    initStorage();
    refresh();
    const un1 = subscribeStatus(setStatus);
    const un2 = subscribeData(refresh);
    return () => {
      un1();
      un2();
    };
  }, []);

  const teaById = useMemo(() => Object.fromEntries(teas.map((t) => [t.id, t])), [teas]);
  const canWrite = !supabaseConfigured || Boolean(status.user);

  const currentSession =
    view.name === "detail" || view.name === "edit"
      ? sessions.find((s) => s.id === view.id)
      : null;

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
      ? "bg-teal"
      : status.pending > 0 || status.syncing
        ? "bg-teal animate-pulse"
        : "bg-coral";

  return (
    <div className="teatasting-app min-h-screen font-sans">
      <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="text-muted hover:text-text text-sm shrink-0" aria-label="Back to portfolio">
            ←
          </Link>
          <h1 className="font-display text-lg font-bold shrink-0">
            Tea<span className="text-tea-amber dark:text-tea-amber-light">Tasting</span>
          </h1>
          <nav className="flex gap-1 ml-1" aria-label="App views">
            <button
              type="button"
              onClick={() => setView({ name: "log" })}
              aria-current={view.name === "log" ? "page" : undefined}
              className={`px-3 py-1.5 min-h-[38px] rounded-lg text-sm ${
                view.name === "log" ? "bg-tea-amber/15 text-text font-medium" : "text-muted hover:text-text"
              }`}
            >
              Log
            </button>
            <button
              type="button"
              onClick={() => setView({ name: "history" })}
              aria-current={view.name !== "log" ? "page" : undefined}
              className={`px-3 py-1.5 min-h-[38px] rounded-lg text-sm ${
                view.name !== "log" ? "bg-tea-amber/15 text-text font-medium" : "text-muted hover:text-text"
              }`}
            >
              History
            </button>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => (status.user ? signOut() : setAuthOpen(true))}
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
              onClick={() => (status.user ? signOut() : setAuthOpen(true))}
              className="sm:hidden min-h-[38px] min-w-[38px] flex items-center justify-center"
              aria-label={status.user ? "Signed in — sign out" : `Sign in (${syncLabel})`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${syncDot}`} aria-hidden="true" />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-4">
        {status.lastError && status.pending > 0 && (
          <p className="mb-3 text-xs rounded-lg border border-teal/50 bg-teal/10 px-3 py-2">
            Sync issue: {status.lastError} — changes are safe locally and will retry.{" "}
            <button type="button" className="underline" onClick={() => flushQueue()}>
              Retry now
            </button>
          </p>
        )}

        {view.name === "log" && (
          <SessionForm
            teas={teas}
            sessions={sessions}
            onSaved={(s) => setView({ name: "detail", id: s.id })}
            onDiscard={() => setView({ name: "history" })}
          />
        )}

        {view.name === "edit" && currentSession && (
          <SessionForm
            teas={teas}
            sessions={sessions}
            initial={{ ...currentSession, tea: { ...(teaById[currentSession.tea_id] || { name: "" }) } }}
            onSaved={(s) => setView({ name: "detail", id: s.id })}
            onDiscard={() => setView({ name: "detail", id: view.id })}
          />
        )}

        {view.name === "history" && (
          <HistoryView
            sessions={sessions}
            teas={teas}
            onOpen={(id) => setView({ name: "detail", id })}
            onOpenTea={(id) => setView({ name: "tea", id })}
            onCompare={(ids) => setView({ name: "compare", ids })}
            onNew={() => setView({ name: "log" })}
          />
        )}

        {view.name === "detail" &&
          (currentSession ? (
            <SessionDetail
              session={currentSession}
              tea={teaById[currentSession.tea_id]}
              canWrite={canWrite}
              onEdit={() => setView({ name: "edit", id: currentSession.id })}
              onDelete={async () => {
                await deleteSession(currentSession.id);
                setView({ name: "history" });
              }}
              onBack={() => setView({ name: "history" })}
              onOpenTea={(id) => setView({ name: "tea", id })}
            />
          ) : (
            loaded && <p className="text-muted text-sm">Session not found.</p>
          ))}

        {view.name === "tea" && teaById[view.id] && (
          <TeaView
            tea={teaById[view.id]}
            sessions={sessions}
            onOpen={(id) => setView({ name: "detail", id })}
            onBack={() => setView({ name: "history" })}
          />
        )}

        {view.name === "compare" && (
          <CompareView
            sessions={view.ids.map((id) => sessions.find((s) => s.id === id)).filter(Boolean)}
            teaById={teaById}
            onBack={() => setView({ name: "history" })}
            onOpen={(id) => setView({ name: "detail", id })}
          />
        )}
      </main>

      <AuthSheet open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
