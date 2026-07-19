"use client";
// Panel 6 — the flavor wheel. Sunburst (input) ⇄ radar (summary) ⇄ list
// (accessible parallel mode with identical controls). Tapping a note opens the
// intensity sheet (0–5 + free-text remark). Custom off-wheel notes get the
// same treatment, and recurring ones surface as one-tap suggestions.
import { useMemo, useState } from "react";
import Sunburst from "./Sunburst";
import RadarChart from "./RadarChart";
import { FAMILIES, getNode, nodeLabel, familyColor, familyRollups } from "../lib/taxonomy";
import { useThemeColors } from "../lib/theme";
import { Sheet, IntensityButtons, TextInput, Segmented, Button } from "./ui";

export function ratedCount(ratings, customNotes) {
  const n = Object.values(ratings || {}).filter((r) => (r?.intensity || 0) > 0).length;
  return n + (customNotes || []).filter((c) => (c.intensity || 0) > 0).length;
}

function IntensitySheet({ target, ratings, customNotes, onRate, onRateCustom, onClose, dark }) {
  const isCustom = target?.type === "custom";
  const node = !isCustom && target ? getNode(target.id) : null;
  const current = isCustom
    ? customNotes.find((c) => c.label === target.label)
    : target
      ? ratings[target.id]
      : null;
  const [remark, setRemark] = useState(current?.note || "");
  const color = isCustom
    ? undefined
    : node
      ? familyColor(node.family.id, dark)
      : undefined;

  if (!target) return null;
  const label = isCustom ? target.label : node?.node.label || target.id;
  const hanzi = !isCustom && node?.node.hanzi;
  const crumbs =
    !isCustom && node
      ? node.kind === "note"
        ? `${node.family.label} › ${node.branch.label}`
        : node.kind === "branch"
          ? node.family.label
          : "Family"
      : "Custom note";

  const commit = (intensity) => {
    if (isCustom) onRateCustom(target.label, intensity, remark);
    else onRate(target.id, intensity, remark);
    onClose();
  };

  return (
    <Sheet open onClose={onClose} title={label}>
      <p className="text-xs text-muted -mt-2 mb-3">
        {crumbs}
        {hanzi ? <span className="ml-2 text-sm">{hanzi}</span> : null}
      </p>
      <IntensityButtons
        value={current?.intensity ?? null}
        onChange={commit}
        color={color}
        ariaLabel={`Intensity for ${label}`}
      />
      <div className="mt-4">
        <TextInput
          placeholder="Remark (optional) — e.g. 'only in the third steep'"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          onBlur={() => {
            if (current) commitRemarkOnly();
          }}
        />
        <p className="text-[11px] text-muted mt-1">
          Tap an intensity to save. 0 clears the note.
        </p>
      </div>
    </Sheet>
  );

  function commitRemarkOnly() {
    if (isCustom) onRateCustom(target.label, current?.intensity ?? 0, remark);
    else onRate(target.id, current?.intensity ?? 0, remark);
  }
}

function AccessibleFlavorList({ ratings, onTapNote, dark }) {
  return (
    <div className="space-y-2" role="tree" aria-label="Flavor taxonomy list">
      {FAMILIES.map((fam) => {
        const color = dark ? fam.colorDark || fam.color : fam.color;
        const famRated = fam.branches.reduce(
          (n, b) => n + b.notes.filter((x) => (ratings[x.id]?.intensity || 0) > 0).length,
          0
        );
        return (
          <details key={fam.id} className="rounded-lg border border-line">
            <summary className="flex items-center gap-2 px-3 py-3 min-h-[48px] cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} aria-hidden="true" />
              <span className="font-medium">{fam.label}</span>
              {fam.hanzi && <span className="text-xs text-muted">{fam.hanzi}</span>}
              {famRated > 0 && (
                <span className="ml-auto text-xs font-mono text-muted">{famRated} rated</span>
              )}
            </summary>
            <div className="px-3 pb-3 space-y-3">
              {fam.branches.map((br) => (
                <div key={br.id}>
                  <p className="text-xs uppercase tracking-wide text-muted mb-1.5">{br.label}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {br.notes.map((note) => {
                      const r = ratings[note.id];
                      const on = (r?.intensity || 0) > 0;
                      return (
                        <button
                          key={note.id}
                          type="button"
                          onClick={() => onTapNote(note.id)}
                          aria-label={`${note.label}${on ? `, rated ${r.intensity} of 5` : ", unrated"}`}
                          className={`px-2.5 py-2 min-h-[44px] rounded-lg border text-sm ${
                            on ? "border-transparent text-white" : "border-line text-text"
                          }`}
                          style={on ? { backgroundColor: color } : undefined}
                        >
                          {note.label}
                          {note.hanzi && (
                            <span className={`block text-[10px] ${on ? "text-white/80" : "text-muted"}`}>
                              {note.hanzi}
                            </span>
                          )}
                          {on && <span className="ml-1 font-mono text-xs">{r.intensity}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </details>
        );
      })}
    </div>
  );
}

export default function FlavorPanel({
  ratings,
  onRate, // (nodeId, intensity, remark)
  customNotes,
  onCustomNotes,
  recurringCustom = [],
  complexity,
  onComplexity,
  mode,
  onMode,
  focus,
  onFocus,
}) {
  const { dark, colors } = useThemeColors();
  const [sheetTarget, setSheetTarget] = useState(null);
  const [listOpen, setListOpen] = useState(false);
  const [customName, setCustomName] = useState("");

  const rollups = useMemo(() => familyRollups(ratings), [ratings]);
  const maxValues = {};
  const meanValues = {};
  for (const fam of FAMILIES) {
    maxValues[fam.id] = rollups[fam.id].max;
    meanValues[fam.id] = rollups[fam.id].mean;
  }

  const count = ratedCount(ratings, customNotes);

  const ratedEntries = Object.entries(ratings)
    .filter(([, r]) => (r?.intensity || 0) > 0)
    .sort((a, b) => b[1].intensity - a[1].intensity);

  const rateCustom = (label, intensity, note) => {
    const next = customNotes.filter((c) => c.label !== label);
    if (intensity > 0) next.push({ label, intensity, note: note || "" });
    onCustomNotes(next);
  };

  const addCustom = () => {
    const label = customName.trim();
    if (!label) return;
    setCustomName("");
    setSheetTarget({ type: "custom", label });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Segmented
          ariaLabel="Wheel view"
          options={[
            { value: "sunburst", label: "Wheel" },
            { value: "radar", label: "Radar" },
            { value: "list", label: "List" },
          ]}
          value={mode}
          onChange={(v) => onMode(v || "sunburst")}
        />
        <button
          type="button"
          onClick={() => setListOpen(true)}
          className="text-xs font-mono px-3 py-2 min-h-[44px] rounded-full bg-surface-2 text-text shrink-0"
          aria-label={`${count} notes rated — view list`}
        >
          {count} rated
        </button>
      </div>

      {mode === "sunburst" && (
        <Sunburst
          ratings={ratings}
          focus={focus}
          onFocusChange={onFocus}
          onTapNote={(id) => setSheetTarget({ type: "node", id })}
          colors={colors}
          dark={dark}
        />
      )}
      {mode === "radar" && (
        <>
          <RadarChart
            series={[{ maxValues, meanValues, stroke: colors.accent }]}
            colors={colors}
            dark={dark}
            editable
            onSetFamily={(famId, v) => onRate(famId, v, ratings[famId]?.note || "")}
            onTapAxis={(famId) => {
              onFocus({ family: famId, branch: null });
              onMode("sunburst");
            }}
          />
          <p className="text-[11px] text-muted text-center -mt-1">
            Solid = strongest note per family · dashed = mean · drag a dot to set a family
            directly · tap a label to drill in
          </p>
        </>
      )}
      {mode === "list" && (
        <AccessibleFlavorList
          ratings={ratings}
          onTapNote={(id) => setSheetTarget({ type: "node", id })}
          dark={dark}
        />
      )}

      {/* Custom off-wheel notes */}
      <div className="pt-1 border-t border-line">
        <p className="text-xs uppercase tracking-wide text-muted mt-2 mb-1.5">Custom notes</p>
        {customNotes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {customNotes.map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => setSheetTarget({ type: "custom", label: c.label })}
                className="px-2.5 py-2 min-h-[44px] rounded-lg bg-tea-amber/15 border border-tea-amber/40 text-sm"
                aria-label={`Custom note ${c.label}, rated ${c.intensity} of 5`}
              >
                {c.label} <span className="font-mono text-xs">{c.intensity}</span>
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <TextInput
            placeholder="Off-wheel note…"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustom())}
            aria-label="New custom note"
          />
          <Button variant="subtle" onClick={addCustom} disabled={!customName.trim()}>
            Add
          </Button>
        </div>
        {recurringCustom.length > 0 && (
          <div className="mt-2">
            <p className="text-[11px] text-muted mb-1">Notes you keep adding:</p>
            <div className="flex flex-wrap gap-1.5">
              {recurringCustom.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setSheetTarget({ type: "custom", label })}
                  className="px-2.5 py-1.5 min-h-[36px] rounded-full border border-dashed border-line text-xs text-muted hover:border-tea-amber"
                >
                  + {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-1 border-t border-line">
        <p className="text-xs uppercase tracking-wide text-muted mt-2 mb-1.5">Complexity</p>
        <Segmented
          ariaLabel="Complexity"
          options={["low", "medium", "high"]}
          value={complexity}
          onChange={onComplexity}
        />
      </div>

      {sheetTarget && (
        <IntensitySheet
          key={sheetTarget.type === "custom" ? `c-${sheetTarget.label}` : sheetTarget.id}
          target={sheetTarget}
          ratings={ratings}
          customNotes={customNotes}
          onRate={onRate}
          onRateCustom={rateCustom}
          onClose={() => setSheetTarget(null)}
          dark={dark}
        />
      )}

      <Sheet open={listOpen} onClose={() => setListOpen(false)} title={`${count} notes rated`}>
        {count === 0 && <p className="text-sm text-muted">Nothing rated yet — tap the wheel.</p>}
        <ul className="space-y-1">
          {ratedEntries.map(([id, r]) => {
            const node = getNode(id);
            const color = familyColor(id, dark);
            return (
              <li key={id}>
                <button
                  type="button"
                  className="w-full flex items-center gap-2 px-2 py-2 min-h-[44px] rounded-lg hover:bg-surface-2 text-left"
                  onClick={() => {
                    setListOpen(false);
                    setSheetTarget({ type: "node", id });
                  }}
                >
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} aria-hidden="true" />
                  <span className="text-sm flex-1 truncate">
                    {nodeLabel(id)}
                    {node?.kind !== "note" && (
                      <span className="text-xs text-muted ml-1">(family)</span>
                    )}
                    {r.note && <span className="block text-xs text-muted truncate">“{r.note}”</span>}
                  </span>
                  <span className="font-mono text-sm">{r.intensity}</span>
                </button>
              </li>
            );
          })}
          {customNotes
            .filter((c) => c.intensity > 0)
            .map((c) => (
              <li key={`c-${c.label}`}>
                <button
                  type="button"
                  className="w-full flex items-center gap-2 px-2 py-2 min-h-[44px] rounded-lg hover:bg-surface-2 text-left"
                  onClick={() => {
                    setListOpen(false);
                    setSheetTarget({ type: "custom", label: c.label });
                  }}
                >
                  <span className="w-2.5 h-2.5 rounded-full border border-dashed border-line shrink-0" aria-hidden="true" />
                  <span className="text-sm flex-1 truncate">{c.label}</span>
                  <span className="font-mono text-sm">{c.intensity}</span>
                </button>
              </li>
            ))}
        </ul>
      </Sheet>
    </div>
  );
}
