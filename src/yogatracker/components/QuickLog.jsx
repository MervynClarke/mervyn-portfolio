"use client";
// The log surface. Everything here exists to shorten the path between
// "I just finished a class" and a saved row.
//
// Three ways in, all landing on the same editable draft:
//   1. Paste or drop a screenshot (⌘/Ctrl+V works anywhere on the page)
//   2. Type "45 min vinyasa yesterday" — parsed instantly
//   3. Tap a recent class to log it again for today
//
// All three run entirely in the browser. Nothing is sent anywhere, there's no
// key to keep alive, and it all works offline.
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, TextArea } from "./ui";
import SessionFields from "./SessionFields";
import { QUICK_DURATIONS } from "../data/taxonomy";
import { EMPTY_DRAFT, isUrl, mergeDrafts, parseLocal } from "../lib/parse";
import { draftFromOcr } from "../lib/screenshot";
import { ocrSupported, readImage, releaseOcr } from "../lib/ocr";
import { fileToImagePayload, imageFromTransfer } from "../lib/img";
import { formatDuration, todayKey } from "../lib/dates";
import { knownValues, recentClasses } from "../lib/stats";

const SPINNER = (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="animate-spin">
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25" />
    <path d="M14 8a6 6 0 0 0-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function QuickLog({ sessions, onSave, notify }) {
  const [text, setText] = useState("");
  const [draft, setDraft] = useState(null);
  const [image, setImage] = useState(null); // { dataUrl, base64, mediaType }
  const [reading, setReading] = useState(null); // null | { pct }
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);
  const draftRef = useRef(null);

  // `ocrSupported()` reads browser globals that don't exist during SSR, so
  // calling it inline would make the first client render disagree with the
  // server's and blow up hydration. Assume yes, then correct after mount.
  const [canRead, setCanRead] = useState(true);
  useEffect(() => setCanRead(ocrSupported()), []);

  const recent = useMemo(() => recentClasses(sessions, 5), [sessions]);
  const teachers = useMemo(() => knownValues(sessions, "teacher"), [sessions]);
  const details = useMemo(() => knownValues(sessions, "source_detail"), [sessions]);

  // The engine holds a worker and a few MB of WASM; let it go when the view does.
  useEffect(() => () => releaseOcr(), []);

  function patch(changes) {
    setDraft((d) => ({ ...(d || EMPTY_DRAFT), ...changes }));
  }

  function startDraft(rawText) {
    const base = mergeDrafts({ ...EMPTY_DRAFT, practice_date: todayKey() }, parseLocal(rawText || ""));
    setDraft((d) => (d ? mergeDrafts(d, base) : base));
  }

  /**
   * Read a screenshot and fill in whatever the draft is still missing.
   *
   * The OCR result is merged *underneath* the current draft, so anything you
   * typed — or edited while waiting — always outranks what was read off the
   * image. That's the same rule as the date: your words win.
   */
  async function handleImage(file) {
    let payload;
    try {
      payload = await fileToImagePayload(file);
    } catch (err) {
      notify?.(err.message);
      return;
    }
    setImage(payload);
    startDraft(text);

    if (!canRead) {
      notify?.("This browser can't read screenshots — fill it in below.");
      return;
    }

    setReading({ pct: 0 });
    try {
      const result = await readImage(payload.dataUrl, {
        onProgress: (m) =>
          setReading({ pct: Math.round((m.progress || 0) * 100), status: m.status }),
      });
      const fromImage = draftFromOcr(result, {
        knownTeachers: teachers,
        knownDetails: details,
      });
      const gotSomething =
        fromImage.duration_minutes || fromImage.title || fromImage.teacher || fromImage.style;
      setDraft((d) => mergeDrafts(fromImage, d || {}));
      if (!gotSomething) notify?.("Couldn't read much from that — fill it in below.");
    } catch (err) {
      console.error("[yogatracker] OCR failed", err);
      notify?.("Couldn't read that screenshot — fill it in below.");
    } finally {
      setReading(null);
    }
  }

  // Page-wide paste. Deliberately not scoped to the drop zone: the whole point
  // is that you can hit ⌘V the moment the page loads without aiming first.
  useEffect(() => {
    const onPaste = (e) => {
      const file = imageFromTransfer(e.clipboardData);
      if (file) {
        e.preventDefault();
        handleImage(file);
        return;
      }
      // Pasting a bare URL onto the page (not into a field) starts a draft too.
      const pasted = e.clipboardData?.getData("text") || "";
      const inField =
        e.target instanceof HTMLElement && /input|textarea|select/i.test(e.target.tagName);
      if (!inField && isUrl(pasted)) {
        e.preventDefault();
        setText(pasted);
        startDraft(pasted);
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, teachers, details]);

  const hasDraft = Boolean(draft);
  useEffect(() => {
    if (hasDraft) draftRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [hasDraft]);

  function submitText() {
    if (!text.trim() && !image) return;
    startDraft(text);
  }

  function reset() {
    setDraft(null);
    setImage(null);
    setText("");
  }

  function save() {
    if (!draft?.duration_minutes) return;
    onSave({ ...draft, url: draft.url || (isUrl(text.trim()) ? text.trim() : "") });
    reset();
  }

  function logAgain(session) {
    setDraft({
      ...EMPTY_DRAFT,
      practice_date: todayKey(),
      duration_minutes: session.duration_minutes,
      title: session.title || "",
      teacher: session.teacher || "",
      style: session.style || "",
      source: session.source || "",
      source_detail: session.source_detail || "",
      url: session.url || "",
      focus: [...(session.focus || [])],
    });
  }

  return (
    <div className="space-y-4">
      {/* ── Compose ─────────────────────────────────────────────────── */}
      <Card
        className={`p-4 transition-colors ${dragging ? "border-yoga-sage bg-yoga-sage/5" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = imageFromTransfer(e.dataTransfer);
          if (file) handleImage(file);
        }}
      >
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <h2 className="font-display text-lg font-semibold">Log a practice</h2>
          {reading && (
            <span className="flex items-center gap-1.5 text-xs text-muted" aria-live="polite">
              {SPINNER} reading{reading.pct ? ` ${reading.pct}%` : "…"}
            </span>
          )}
        </div>

        <TextArea
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submitText();
            }
          }}
          placeholder={
            canRead
              ? "45 min vinyasa yesterday — or paste a screenshot of the class"
              : "45 min vinyasa yesterday"
          }
          aria-label="Describe the practice"
        />

        <div className="flex flex-wrap items-center gap-2 mt-2">
          <Button onClick={submitText} disabled={!text.trim() && !image}>
            Continue
          </Button>
          {canRead && (
            <>
              <Button variant="ghost" onClick={() => fileRef.current?.click()}>
                📷 Screenshot
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImage(file);
                  e.target.value = "";
                }}
              />
              <span className="text-xs text-muted hidden sm:inline">
                or press ⌘/Ctrl + V anywhere on this page
              </span>
            </>
          )}
        </div>

        {/* One tap and you already have a saveable draft. */}
        {!draft && (
          <div className="mt-4 pt-3 border-t border-line">
            <p className="text-xs uppercase tracking-wide text-muted mb-2">Straight in</p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_DURATIONS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() =>
                    setDraft({ ...EMPTY_DRAFT, practice_date: todayKey(), duration_minutes: m })
                  }
                  className="px-3 py-2 min-h-[44px] rounded-lg border border-line bg-surface text-sm text-muted hover:border-yoga-sage/60 hover:text-text transition-colors"
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>
        )}

        {!draft && recent.length > 0 && (
          <div className="mt-4 pt-3 border-t border-line">
            <p className="text-xs uppercase tracking-wide text-muted mb-2">Do it again</p>
            <div className="flex flex-col gap-1.5">
              {recent.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => logAgain(s)}
                  className="flex items-center gap-2 text-left px-3 py-2 min-h-[44px] rounded-lg border border-line bg-surface hover:border-yoga-sage/60 transition-colors"
                >
                  <span className="text-sm truncate flex-1">
                    {s.title || s.style || "Practice"}
                    {s.teacher && <span className="text-muted"> · {s.teacher}</span>}
                  </span>
                  <span className="text-xs font-mono text-muted shrink-0">
                    {formatDuration(s.duration_minutes)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* ── Review + edit ───────────────────────────────────────────── */}
      {draft && (
        <Card className="p-4 space-y-4" ref={draftRef}>
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-lg font-semibold">Check it over</h3>
            <button type="button" onClick={reset} className="text-xs text-muted underline min-h-[32px]">
              discard
            </button>
          </div>

          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.dataUrl}
              alt="Pasted screenshot"
              className="max-h-40 w-auto rounded-lg border border-line"
            />
          )}

          <SessionFields
            draft={draft}
            patch={patch}
            teachers={teachers}
            details={details}
            idPrefix="yoga-new"
          />

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button onClick={save} disabled={!draft.duration_minutes || Boolean(reading)}>
              Save practice
            </Button>
            <Button variant="ghost" onClick={reset}>
              Cancel
            </Button>
            {!draft.duration_minutes && (
              <span className="text-xs text-muted">Add a duration to save.</span>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
