"use client";
// The tasting sheet: nine labeled panels in evaluation order, stacked on
// mobile, two-column on desktop. Every change autosaves the draft to
// localStorage; losing the tab mid-session costs nothing.
import { useEffect, useMemo, useRef, useState } from "react";
import FlavorPanel, { ratedCount } from "./FlavorPanel";
import {
  Panel, Field, TextInput, TextArea, Segmented, IntensityButtons,
  BipolarSlider, StarRating, Button,
} from "./ui";
import { fileToDataUrl } from "../lib/img";
import { saveDraft, loadDraft, clearDraft } from "../lib/draft";
import { newId, findTeaByName, saveSession } from "../lib/storage";

export const TEA_TYPES = [
  "green", "white", "yellow", "oolong", "black", "sheng", "shou", "heicha", "herbal", "other",
];
const METHODS = [
  { value: "gongfu", label: "Gongfu" },
  { value: "western", label: "Western" },
  { value: "grandpa", label: "Grandpa" },
  { value: "cold_brew", label: "Cold brew" },
  { value: "boiled", label: "Boiled 煮茶" },
  { value: "bowl_tea", label: "Bowl tea" },
  { value: "whisked", label: "Whisked" },
  { value: "other", label: "Other" },
];
const VESSELS = ["gaiwan", "yixing", "porcelain", "glass", "mug", "thermos", "bowl", "other"];
export const LIQUOR_COLORS = [
  { value: "#E8E6A6", label: "pale green-yellow" },
  { value: "#E3CF6B", label: "yellow" },
  { value: "#D9AE3E", label: "gold" },
  { value: "#C08434", label: "amber" },
  { value: "#96562A", label: "chestnut" },
  { value: "#63331E", label: "deep red-brown" },
  { value: "#2E1A12", label: "near-black" },
];
export const TASTES = ["sourness", "sweetness", "bitterness", "saltiness", "umami"];
export const MOUTHFEEL_DIMS = [
  { key: "aftertaste", left: "brief", right: "lasting" },
  { key: "fullness", left: "light", right: "thick" },
  { key: "smoothness", left: "astringent", right: "smooth" },
  { key: "fineness", left: "rough", right: "fine" },
  { key: "purity", left: "stuffy", right: "fresh" },
];

const todayStr = () => new Date().toISOString().slice(0, 10);

export function emptySession() {
  return {
    id: newId(),
    tea: { name: "", type: null, origin: "", cultivar: "", harvest_year: "", vendor: "", price: "" },
    brewed_at: todayStr(),
    method: null, vessel: null,
    water_temp_c: "", leaf_g: "", water_ml: "", water_type: "",
    rinse: null, infusion_count: "",
    dry_leaf_notes: "", infused_leaf_notes: "",
    photos: {},
    liquor_clarity: null, liquor_color: null,
    ratings: {}, custom_notes: [], complexity: null,
    tastes: {}, mouthfeel: {}, hui_gan: null, cha_qi: null,
    infusions: [],
    overall_rating: null, drink_again: null, notes: "",
  };
}

function PhotoField({ label, value, onChange }) {
  const inputRef = useRef(null);
  return (
    <div>
      <span className="block text-xs font-medium uppercase tracking-wide text-muted mb-1">{label}</span>
      {value ? (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={`${label} photo`} className="w-20 h-20 object-cover rounded-lg border border-line" />
          <Button variant="ghost" onClick={() => onChange(null)}>Remove</Button>
        </div>
      ) : (
        <Button variant="subtle" onClick={() => inputRef.current?.click()}>
          + Photo
        </Button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) onChange(await fileToDataUrl(file));
        }}
      />
    </div>
  );
}

export default function SessionForm({ teas, sessions, initial, onSaved, onDiscard }) {
  const [s, setS] = useState(() => initial || emptySession());
  const [restored, setRestored] = useState(false);
  const [tempUnit, setTempUnit] = useState("C");
  const [wheelMode, setWheelMode] = useState("sunburst");
  const [wheelFocus, setWheelFocus] = useState({ family: null, branch: null });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Restore an in-progress draft on mount (new sessions only).
  useEffect(() => {
    if (initial) { setRestored(true); return; }
    let alive = true;
    loadDraft().then((draft) => {
      if (alive && draft && draft.id) setS((cur) => ({ ...cur, ...draft }));
      if (alive) setRestored(true);
    });
    return () => { alive = false; };
  }, [initial]);

  // Continuous autosave (after restore, so we don't clobber the draft with an empty form).
  useEffect(() => {
    if (restored && !initial) saveDraft(s);
  }, [s, restored, initial]);

  const set = (patch) => setS((cur) => ({ ...cur, ...patch }));
  const setTea = (patch) => setS((cur) => ({ ...cur, tea: { ...cur.tea, ...patch } }));

  // Tea-name autocomplete + link to existing tea record (dedupe).
  const matchedTea = useMemo(() => {
    const needle = s.tea.name.trim().toLowerCase();
    if (!needle) return null;
    return teas.find((t) => t.name.trim().toLowerCase() === needle) || null;
  }, [s.tea.name, teas]);

  useEffect(() => {
    if (matchedTea) {
      setTea({
        type: matchedTea.type ?? null, origin: matchedTea.origin || "",
        cultivar: matchedTea.cultivar || "", harvest_year: matchedTea.harvest_year || "",
        vendor: matchedTea.vendor || "", price: matchedTea.price || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchedTea?.id]);

  // "Notes you keep adding": custom labels used in 2+ past sessions.
  const recurringCustom = useMemo(() => {
    const counts = {};
    for (const sess of sessions)
      for (const c of sess.custom_notes || [])
        counts[c.label] = (counts[c.label] || 0) + 1;
    const current = new Set((s.custom_notes || []).map((c) => c.label));
    return Object.entries(counts)
      .filter(([label, n]) => n >= 2 && !current.has(label))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([label]) => label);
  }, [sessions, s.custom_notes]);

  const ratio =
    Number(s.leaf_g) > 0 && Number(s.water_ml) > 0
      ? `1:${Math.round(Number(s.water_ml) / Number(s.leaf_g))}`
      : null;

  const tempDisplay =
    s.water_temp_c === "" || s.water_temp_c == null
      ? ""
      : tempUnit === "C"
        ? s.water_temp_c
        : Math.round((Number(s.water_temp_c) * 9) / 5 + 32);

  const setTemp = (val) => {
    if (val === "") return set({ water_temp_c: "" });
    const n = Number(val);
    if (Number.isNaN(n)) return;
    set({ water_temp_c: tempUnit === "C" ? n : Math.round(((n - 32) * 5) / 9) });
  };

  const rate = (nodeId, intensity, remark) =>
    setS((cur) => {
      const ratings = { ...cur.ratings };
      if (!intensity && !remark) delete ratings[nodeId];
      else if (!intensity) delete ratings[nodeId];
      else ratings[nodeId] = { intensity, note: remark || "" };
      return { ...cur, ratings };
    });

  const flavorCount = ratedCount(s.ratings, s.custom_notes);

  // Panel progress: which panels have any content yet.
  const progress = [
    Boolean(s.tea.name),
    Boolean(s.method || s.leaf_g || s.water_ml || s.water_temp_c !== ""),
    Boolean(s.dry_leaf_notes || s.photos.dry),
    Boolean(s.infused_leaf_notes || s.photos.infused),
    Boolean(s.liquor_clarity || s.liquor_color || s.photos.liquor),
    flavorCount > 0,
    Boolean(Object.keys(s.tastes).length || Object.keys(s.mouthfeel).length || s.hui_gan != null || s.cha_qi != null),
    (s.infusions || []).length > 0,
    Boolean(s.overall_rating || s.drink_again || s.notes),
  ];

  const doSave = async () => {
    setError(null);
    if (!s.tea.name.trim()) {
      setError("Give the tea a name before saving.");
      document.getElementById("panel-identity")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setSaving(true);
    try {
      const existing = await findTeaByName(s.tea.name);
      const tea = existing
        ? { ...existing, ...s.tea, id: existing.id, name: existing.name }
        : { ...s.tea, id: newId() };
      const { tea: _t, ...sessionData } = s;
      const saved = await saveSession(sessionData, tea);
      if (!initial) clearDraft();
      onSaved(saved);
    } catch (err) {
      setError(err?.message || String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Progress dots */}
      <div className="flex items-center gap-1.5 px-1" aria-label="Panel progress">
        {progress.map((done, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full flex-1 ${done ? "bg-tea-amber" : "bg-line"}`}
            aria-hidden="true"
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <div className="space-y-4">
          <Panel id="panel-identity" title="Identity" badge={matchedTea ? "known tea" : null}>
            <Field label="Tea name">
              <TextInput
                list="tt-tea-names"
                value={s.tea.name}
                onChange={(e) => setTea({ name: e.target.value })}
                placeholder="e.g. 2019 Shui Xian"
                autoComplete="off"
              />
              <datalist id="tt-tea-names">
                {teas.map((t) => (
                  <option key={t.id} value={t.name} />
                ))}
              </datalist>
            </Field>
            {matchedTea && (
              <p className="text-xs text-muted -mt-2">
                Linked to your existing “{matchedTea.name}” — this session joins its history.
              </p>
            )}
            <Field label="Type">
              <Segmented ariaLabel="Tea type" options={TEA_TYPES} value={s.tea.type} onChange={(v) => setTea({ type: v })} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Origin"><TextInput value={s.tea.origin} onChange={(e) => setTea({ origin: e.target.value })} /></Field>
              <Field label="Cultivar"><TextInput value={s.tea.cultivar} onChange={(e) => setTea({ cultivar: e.target.value })} /></Field>
              <Field label="Harvest / vintage"><TextInput value={s.tea.harvest_year} onChange={(e) => setTea({ harvest_year: e.target.value })} placeholder="2019" /></Field>
              <Field label="Vendor"><TextInput value={s.tea.vendor} onChange={(e) => setTea({ vendor: e.target.value })} /></Field>
              <Field label="Price"><TextInput value={s.tea.price} onChange={(e) => setTea({ price: e.target.value })} placeholder="$0.45/g" /></Field>
              <Field label="Session date"><TextInput type="date" value={s.brewed_at} onChange={(e) => set({ brewed_at: e.target.value })} /></Field>
            </div>
          </Panel>

          <Panel title="Brew" badge={ratio}>
            <Field label="Method">
              <Segmented ariaLabel="Brew method" options={METHODS} value={s.method} onChange={(v) => set({ method: v })} />
            </Field>
            <Field label="Vessel">
              <Segmented ariaLabel="Vessel" options={VESSELS} value={s.vessel} onChange={(v) => set({ vessel: v })} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field
                label={`Water temp (°${tempUnit})`}
                hint={
                  <button type="button" className="underline" onClick={() => setTempUnit(tempUnit === "C" ? "F" : "C")}>
                    switch to °{tempUnit === "C" ? "F" : "C"}
                  </button>
                }
              >
                <TextInput type="number" inputMode="numeric" value={tempDisplay} onChange={(e) => setTemp(e.target.value)} />
              </Field>
              <Field label="Water type">
                <TextInput value={s.water_type} onChange={(e) => set({ water_type: e.target.value })} placeholder="spring, filtered…" />
              </Field>
              <Field label="Leaf (g)">
                <TextInput type="number" inputMode="decimal" step="0.1" value={s.leaf_g} onChange={(e) => set({ leaf_g: e.target.value })} />
              </Field>
              <Field label="Water (ml)" hint={ratio ? `ratio ${ratio}` : undefined}>
                <TextInput type="number" inputMode="numeric" value={s.water_ml} onChange={(e) => set({ water_ml: e.target.value })} />
              </Field>
              <Field label="Rinse">
                <Segmented
                  ariaLabel="Rinse"
                  options={[{ value: "yes", label: "yes" }, { value: "no", label: "no" }]}
                  value={s.rinse == null ? null : s.rinse ? "yes" : "no"}
                  onChange={(v) => set({ rinse: v == null ? null : v === "yes" })}
                />
              </Field>
              <Field label="Infusions (count)">
                <TextInput type="number" inputMode="numeric" value={s.infusion_count} onChange={(e) => set({ infusion_count: e.target.value })} />
              </Field>
            </div>
          </Panel>

          <Panel title="Dry leaf" defaultOpen={false}>
            <TextArea value={s.dry_leaf_notes} onChange={(e) => set({ dry_leaf_notes: e.target.value })} placeholder="Appearance, aroma off the dry leaf…" aria-label="Dry leaf notes" />
            <PhotoField label="Dry leaf photo" value={s.photos.dry} onChange={(v) => set({ photos: { ...s.photos, dry: v || undefined } })} />
          </Panel>

          <Panel title="Infused leaf" defaultOpen={false}>
            <TextArea value={s.infused_leaf_notes} onChange={(e) => set({ infused_leaf_notes: e.target.value })} placeholder="Aroma in the gaiwan lid, leaf as it opens…" aria-label="Infused leaf notes" />
            <PhotoField label="Infused leaf photo" value={s.photos.infused} onChange={(v) => set({ photos: { ...s.photos, infused: v || undefined } })} />
          </Panel>

          <Panel title="Liquor" defaultOpen={false}>
            <Field label="Clarity">
              <Segmented
                ariaLabel="Clarity"
                options={[
                  { value: "clear", label: "clear" },
                  { value: "semi-cloudy", label: "semi-cloudy" },
                  { value: "cloudy", label: "cloudy" },
                ]}
                value={s.liquor_clarity}
                onChange={(v) => set({ liquor_clarity: v })}
              />
            </Field>
            <Field label="Color">
              <div role="radiogroup" aria-label="Liquor color" className="flex flex-wrap gap-2">
                {LIQUOR_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    role="radio"
                    aria-checked={s.liquor_color === c.value}
                    aria-label={c.label}
                    title={c.label}
                    onClick={() => set({ liquor_color: s.liquor_color === c.value ? null : c.value })}
                    className={`w-11 h-11 rounded-full border-2 ${
                      s.liquor_color === c.value ? "border-tea-amber ring-2 ring-tea-amber/40" : "border-line"
                    }`}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
              {s.liquor_color && (
                <p className="text-xs text-muted mt-1">
                  {LIQUOR_COLORS.find((c) => c.value === s.liquor_color)?.label}
                </p>
              )}
            </Field>
            <PhotoField label="Liquor photo" value={s.photos.liquor} onChange={(v) => set({ photos: { ...s.photos, liquor: v || undefined } })} />
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Flavor wheel" badge={flavorCount ? `${flavorCount} notes` : null}>
            <FlavorPanel
              ratings={s.ratings}
              onRate={rate}
              customNotes={s.custom_notes}
              onCustomNotes={(v) => set({ custom_notes: v })}
              recurringCustom={recurringCustom}
              complexity={s.complexity}
              onComplexity={(v) => set({ complexity: v })}
              mode={wheelMode}
              onMode={setWheelMode}
              focus={wheelFocus}
              onFocus={setWheelFocus}
            />
          </Panel>

          <Panel title="Taste & mouthfeel">
            <div className="space-y-3">
              {TASTES.map((t) => (
                <div key={t}>
                  <p className="text-xs uppercase tracking-wide text-muted mb-1">{t}</p>
                  <IntensityButtons
                    value={s.tastes[t] ?? null}
                    onChange={(v) => set({ tastes: { ...s.tastes, [t]: v } })}
                    ariaLabel={t}
                  />
                </div>
              ))}
            </div>
            <div className="space-y-3 pt-3 border-t border-line">
              {MOUTHFEEL_DIMS.map((d) => (
                <BipolarSlider
                  key={d.key}
                  leftLabel={d.left}
                  rightLabel={d.right}
                  value={s.mouthfeel[d.key] ?? null}
                  onChange={(v) =>
                    setS((cur) => {
                      const mouthfeel = { ...cur.mouthfeel };
                      if (v == null) delete mouthfeel[d.key];
                      else mouthfeel[d.key] = v;
                      return { ...cur, mouthfeel };
                    })
                  }
                />
              ))}
            </div>
            <div className="pt-3 border-t border-line space-y-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted mb-1">Hui gan 回甘 <span className="normal-case">(returning sweetness)</span></p>
                <IntensityButtons value={s.hui_gan} onChange={(v) => set({ hui_gan: v })} ariaLabel="Hui gan" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted mb-1">Cha qi 茶氣</p>
                <IntensityButtons value={s.cha_qi} onChange={(v) => set({ cha_qi: v })} ariaLabel="Cha qi" />
              </div>
            </div>
          </Panel>

          <Panel title="Infusions" subtitle="optional texture" defaultOpen={false} badge={s.infusions.length || null}>
            {s.infusions.map((inf, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="font-mono text-sm text-muted pt-3 w-6">#{inf.infusion_number}</span>
                <TextInput
                  type="number"
                  inputMode="numeric"
                  placeholder="sec"
                  aria-label={`Infusion ${inf.infusion_number} steep seconds`}
                  className="!w-20"
                  value={inf.steep_seconds ?? ""}
                  onChange={(e) =>
                    setS((cur) => {
                      const infusions = [...cur.infusions];
                      infusions[i] = { ...inf, steep_seconds: e.target.value === "" ? null : Number(e.target.value) };
                      return { ...cur, infusions };
                    })
                  }
                />
                <TextInput
                  placeholder="one-line note"
                  aria-label={`Infusion ${inf.infusion_number} note`}
                  value={inf.note || ""}
                  onChange={(e) =>
                    setS((cur) => {
                      const infusions = [...cur.infusions];
                      infusions[i] = { ...inf, note: e.target.value };
                      return { ...cur, infusions };
                    })
                  }
                />
                <button
                  type="button"
                  aria-label={`Remove infusion ${inf.infusion_number}`}
                  className="min-h-[44px] min-w-[36px] text-muted"
                  onClick={() =>
                    setS((cur) => ({
                      ...cur,
                      infusions: cur.infusions
                        .filter((_, j) => j !== i)
                        .map((x, j) => ({ ...x, infusion_number: j + 1 })),
                    }))
                  }
                >
                  ✕
                </button>
              </div>
            ))}
            <Button
              variant="subtle"
              onClick={() =>
                setS((cur) => ({
                  ...cur,
                  infusions: [
                    ...cur.infusions,
                    { infusion_number: cur.infusions.length + 1, steep_seconds: null, note: "" },
                  ],
                }))
              }
            >
              + Infusion
            </Button>
          </Panel>

          <Panel title="Verdict">
            <Field label="Overall">
              <StarRating value={s.overall_rating} onChange={(v) => set({ overall_rating: v })} />
            </Field>
            <Field label="Would drink again">
              <Segmented
                ariaLabel="Would drink again"
                options={["yes", "no", "maybe"]}
                value={s.drink_again}
                onChange={(v) => set({ drink_again: v })}
              />
            </Field>
            <Field label="Session notes">
              <TextArea value={s.notes} onChange={(e) => set({ notes: e.target.value })} placeholder="Anything else worth remembering…" />
            </Field>
          </Panel>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-700 dark:text-red-400 px-1">{error}</p>
      )}

      {/* Sticky save bar — thumb-reachable */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] border-t border-line bg-surface/95 backdrop-blur px-4 py-3">
        <div className="max-w-5xl mx-auto flex gap-2">
          <Button className="flex-1" onClick={doSave} disabled={saving}>
            {saving ? "Saving…" : initial ? "Save changes" : "Save session"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              if (!initial) clearDraft();
              onDiscard();
            }}
          >
            {initial ? "Cancel" : "Discard"}
          </Button>
        </div>
      </div>
    </div>
  );
}
