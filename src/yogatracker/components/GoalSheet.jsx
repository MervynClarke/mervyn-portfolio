"use client";
// Goal editor. A goal is just an hours target and a name, so this stays a
// small sheet rather than a settings page. Clearing the target removes the
// progress bar entirely — a goal you've outgrown shouldn't sit there at 340%.
import { useEffect, useState } from "react";
import { Button, Field, Sheet, TextInput } from "./ui";
import { formatHours } from "../lib/dates";

const PRESETS = [25, 50, 100, 200];

export default function GoalSheet({ open, goal, totalMinutes, onSave, onClose }) {
  const [hours, setHours] = useState("");
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!open) return;
    setHours(goal?.hours ? String(goal.hours) : "");
    setLabel(goal?.label || "");
  }, [open, goal]);

  const parsed = Number(hours);
  const valid = Number.isFinite(parsed) && parsed > 0;
  const done = valid && totalMinutes / 60 >= parsed;

  return (
    <Sheet open={open} onClose={onClose} title="Practice goal">
      <div className="space-y-4">
        <p className="text-sm text-muted">
          You&apos;ve practised {formatHours(totalMinutes)} hours so far. Set a target to track
          against, or clear it to hide the bar.
        </p>

        <Field label="Target hours">
          <TextInput
            type="number"
            inputMode="numeric"
            min={1}
            max={10000}
            value={hours}
            placeholder="50"
            onChange={(e) => setHours(e.target.value)}
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {PRESETS.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHours(String(h))}
                className={`px-3 py-2 min-h-[40px] rounded-lg border text-sm transition-colors ${
                  Number(hours) === h
                    ? "border-yoga-sage bg-yoga-sage/15 text-text"
                    : "border-line text-muted hover:text-text"
                }`}
              >
                {h} hrs
              </button>
            ))}
          </div>
        </Field>

        <Field label="Name" hint="optional">
          <TextInput
            value={label}
            placeholder="200-hour teacher training"
            onChange={(e) => setLabel(e.target.value)}
          />
        </Field>

        {done && (
          <p className="text-sm rounded-lg border border-tea-amber/50 bg-tea-amber/10 px-3 py-2">
            You&apos;re already past this one. Save it to celebrate, or set the next target.
          </p>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            onClick={() => onSave({ hours: Math.round(parsed), label: label.trim() })}
            disabled={!valid}
          >
            Save goal
          </Button>
          {goal?.hours ? (
            <Button variant="ghost" onClick={() => onSave(null)}>
              Clear goal
            </Button>
          ) : null}
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
