"use client";
// The log itself. One row per session, expandable into the same field set the
// new-practice card uses. Delete is a visible button with a confirm step —
// duplicate screenshots are easy to create and easy to remove.
import { useMemo, useState } from "react";
import { Button, Card, Select } from "./ui";
import SessionFields from "./SessionFields";
import { formatDuration, formatHours, relativeDay } from "../lib/dates";
import { knownValues, totalMinutes } from "../lib/stats";
import { SOURCE_LABEL } from "../data/taxonomy";
import { downloadCsv } from "../lib/exports";

const SORTS = [
  { value: "date-desc", label: "Newest first" },
  { value: "date-asc", label: "Oldest first" },
  { value: "duration-desc", label: "Longest first" },
];

function sortSessions(sessions, sort) {
  const copy = [...sessions];
  if (sort === "duration-desc") {
    copy.sort((a, b) => (b.duration_minutes || 0) - (a.duration_minutes || 0));
  } else {
    copy.sort((a, b) => {
      const cmp = (a.practice_date || "").localeCompare(b.practice_date || "");
      if (cmp !== 0) return sort === "date-asc" ? cmp : -cmp;
      // Same day: fall back to logged time so the order is stable.
      const t = (a.created_at || "").localeCompare(b.created_at || "");
      return sort === "date-asc" ? t : -t;
    });
  }
  return copy;
}

function Row({ session, teachers, details, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(session);
  const [confirming, setConfirming] = useState(false);

  const meta = [
    session.style,
    session.teacher,
    session.source_detail || SOURCE_LABEL[session.source],
  ].filter(Boolean);

  function open() {
    setDraft({ ...session, focus: [...(session.focus || [])] });
    setEditing(true);
  }

  return (
    <li className="border-t border-line first:border-t-0">
      <div className="flex items-center gap-3 px-3 py-2.5">
        <button
          type="button"
          onClick={() => (editing ? setEditing(false) : open())}
          aria-expanded={editing}
          className="flex-1 min-w-0 text-left py-1.5"
        >
          <span className="flex items-baseline gap-2">
            <span className="text-sm font-medium truncate">
              {session.title || session.style || "Practice"}
            </span>
            <span className="text-xs font-mono text-muted shrink-0">
              {formatDuration(session.duration_minutes)}
            </span>
          </span>
          <span className="block text-xs text-muted truncate">
            {relativeDay(session.practice_date)}
            {meta.length > 0 && ` · ${meta.join(" · ")}`}
          </span>
        </button>
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          aria-hidden="true"
          className={`shrink-0 text-muted transition-transform ${editing ? "rotate-180" : ""}`}
        >
          <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>

      {editing && (
        <div className="px-3 pb-4 space-y-4">
          <SessionFields
            draft={draft}
            patch={(changes) => setDraft((d) => ({ ...d, ...changes }))}
            teachers={teachers}
            details={details}
            idPrefix={`yoga-${session.id}`}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => {
                onSave(draft);
                setEditing(false);
              }}
              disabled={!draft.duration_minutes}
            >
              Save changes
            </Button>
            <Button variant="ghost" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <span className="flex-1" />
            {confirming ? (
              <span className="flex items-center gap-2">
                <span className="text-xs text-muted">Delete for good?</span>
                <Button variant="danger" onClick={() => onDelete(session)}>
                  Yes, delete
                </Button>
                <Button variant="ghost" onClick={() => setConfirming(false)}>
                  Keep
                </Button>
              </span>
            ) : (
              <Button variant="danger" onClick={() => setConfirming(true)}>
                Delete
              </Button>
            )}
          </div>
        </div>
      )}
    </li>
  );
}

export default function SessionsList({ sessions, onSave, onDelete }) {
  const [sort, setSort] = useState("date-desc");
  const teachers = useMemo(() => knownValues(sessions, "teacher"), [sessions]);
  const details = useMemo(() => knownValues(sessions, "source_detail"), [sessions]);
  const sorted = useMemo(() => sortSessions(sessions, sort), [sessions, sort]);
  const minutes = totalMinutes(sessions);

  if (sessions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="font-display text-lg mb-1">Nothing logged yet</p>
        <p className="text-sm text-muted">
          Paste a screenshot of a class, or tap a duration above. It takes about five seconds.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-2 px-3 py-3 border-b border-line">
        <h2 className="font-display text-lg font-semibold mr-auto">
          {sessions.length} {sessions.length === 1 ? "practice" : "practices"}
          <span className="ml-2 text-sm font-sans font-normal text-muted">
            {formatHours(minutes)} hrs
          </span>
        </h2>
        <Select
          options={SORTS}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort sessions"
          className="w-auto"
        />
        <Button variant="ghost" onClick={() => downloadCsv(sessions)}>
          Export CSV
        </Button>
      </div>
      <ul>
        {sorted.map((s) => (
          <Row
            key={s.id}
            session={s}
            teachers={teachers}
            details={details}
            onSave={onSave}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </Card>
  );
}
