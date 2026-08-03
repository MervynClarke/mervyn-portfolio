"use client";
// The editable field set for one session. Shared by the new-practice review
// card and the inline row editor so a correction after the fact offers exactly
// the same controls as the original entry — no "delete and re-add" to fix a
// wrong teacher.
import { useState } from "react";
import { Chips, Field, MultiChips, TextArea, TextInput } from "./ui";
import { FOCUS_GROUPS, QUICK_DURATIONS, SOURCES, STYLES } from "../data/taxonomy";
import { addDays, relativeDay, todayKey } from "../lib/dates";

export default function SessionFields({ draft, patch, teachers = [], details = [], idPrefix = "yoga" }) {
  const [showFocus, setShowFocus] = useState(false);
  const today = todayKey();
  const teacherListId = `${idPrefix}-teachers`;
  const detailListId = `${idPrefix}-source-details`;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Date" hint="screenshots show the publish date — check this">
          <TextInput
            type="date"
            value={draft.practice_date}
            max={today}
            onChange={(e) => patch({ practice_date: e.target.value })}
          />
          <div className="flex gap-1.5 mt-1.5">
            {[
              { value: today, label: "Today" },
              { value: addDays(today, -1), label: "Yesterday" },
              { value: addDays(today, -2), label: relativeDay(addDays(today, -2)) },
            ].map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => patch({ practice_date: d.value })}
                className={`px-2.5 py-1.5 min-h-[36px] rounded-lg border text-[13px] transition-colors ${
                  draft.practice_date === d.value
                    ? "border-yoga-sage bg-yoga-sage/15 text-text"
                    : "border-line text-muted hover:text-text"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Duration" hint={draft.duration_minutes ? "" : "required"}>
          <TextInput
            type="number"
            inputMode="numeric"
            min={1}
            max={600}
            value={draft.duration_minutes || ""}
            placeholder="minutes"
            onChange={(e) => patch({ duration_minutes: Number(e.target.value) || 0 })}
          />
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {QUICK_DURATIONS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => patch({ duration_minutes: m })}
                className={`px-2.5 py-1.5 min-h-[36px] rounded-lg border text-[13px] transition-colors ${
                  draft.duration_minutes === m
                    ? "border-yoga-sage bg-yoga-sage/15 text-text"
                    : "border-line text-muted hover:text-text"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <Field label="Class">
        <TextInput
          value={draft.title}
          placeholder="Morning Hip Opener"
          onChange={(e) => patch({ title: e.target.value })}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Teacher">
          <TextInput
            list={teacherListId}
            value={draft.teacher}
            placeholder="Adriene"
            onChange={(e) => patch({ teacher: e.target.value })}
          />
          <datalist id={teacherListId}>
            {teachers.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </Field>
        <Field label="Channel / studio / app">
          <TextInput
            list={detailListId}
            value={draft.source_detail}
            placeholder="Yoga with Adriene"
            onChange={(e) => patch({ source_detail: e.target.value })}
          />
          <datalist id={detailListId}>
            {details.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
        </Field>
      </div>

      <Field label="Style">
        <Chips
          size="sm"
          ariaLabel="Style"
          options={STYLES}
          value={draft.style}
          onChange={(v) => patch({ style: v })}
        />
      </Field>

      <Field label="Where">
        <Chips
          size="sm"
          ariaLabel="Source"
          options={SOURCES}
          value={draft.source}
          onChange={(v) => patch({ source: v })}
        />
      </Field>

      <div>
        <button
          type="button"
          onClick={() => setShowFocus((v) => !v)}
          aria-expanded={showFocus}
          className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted min-h-[32px]"
        >
          Focus
          {draft.focus?.length > 0 && (
            <span className="normal-case tracking-normal text-text">
              {draft.focus.length} selected
            </span>
          )}
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            aria-hidden="true"
            className={`transition-transform ${showFocus ? "rotate-180" : ""}`}
          >
            <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        {showFocus ? (
          <div className="mt-2 space-y-3">
            {FOCUS_GROUPS.map((g) => (
              <div key={g.group}>
                <p className="text-[11px] text-muted mb-1.5">{g.group}</p>
                <MultiChips
                  ariaLabel={g.group}
                  options={g.items}
                  values={draft.focus || []}
                  onChange={(focus) => patch({ focus })}
                />
              </div>
            ))}
          </div>
        ) : (
          draft.focus?.length > 0 && (
            <p className="mt-1 text-sm text-muted">{draft.focus.join(" · ")}</p>
          )
        )}
      </div>

      <Field label="Notes" hint="optional">
        <TextArea
          rows={2}
          value={draft.notes}
          placeholder="Felt strong. Held pigeon longer."
          onChange={(e) => patch({ notes: e.target.value })}
        />
      </Field>
    </div>
  );
}
