"use client";
// Read-only session view: both wheels, full metadata, photos, and export.
import { useMemo, useState } from "react";
import Sunburst from "./Sunburst";
import RadarChart from "./RadarChart";
import { FAMILIES, familyRollups, nodeLabel, familyColor, getNode } from "../lib/taxonomy";
import { useThemeColors } from "../lib/theme";
import { Button, Panel, Segmented, StarRating } from "./ui";
import { MOUTHFEEL_DIMS, TASTES, LIQUOR_COLORS } from "./SessionForm";
import {
  exportPng, exportPdf, exportJson, exportCsv, shareOrDownload, exportBaseName,
} from "../lib/exports";

export default function SessionDetail({ session, tea, canWrite, onEdit, onDelete, onBack, onOpenTea }) {
  const { dark, colors } = useThemeColors();
  const [mode, setMode] = useState("radar");
  const [focus, setFocus] = useState({ family: null, branch: null });
  const [busy, setBusy] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const rollups = useMemo(() => familyRollups(session.ratings), [session]);
  const maxValues = {};
  const meanValues = {};
  for (const f of FAMILIES) {
    maxValues[f.id] = rollups[f.id].max;
    meanValues[f.id] = rollups[f.id].mean;
  }

  const doExport = async (kind) => {
    setBusy(kind);
    try {
      const base = exportBaseName(session, tea);
      if (kind === "png") await shareOrDownload(await exportPng(session, tea), `${base}.png`);
      if (kind === "pdf") await shareOrDownload(await exportPdf(session, tea), `${base}.pdf`);
      if (kind === "json") await shareOrDownload(exportJson(session, tea), `${base}.json`);
      if (kind === "csv") await shareOrDownload(exportCsv(session, tea), `${base}.csv`);
    } finally {
      setBusy(null);
    }
  };

  const ratedByFamily = FAMILIES.map((fam) => ({
    fam,
    notes: Object.entries(session.ratings || {})
      .filter(([id, r]) => r.intensity > 0 && id.startsWith(`${fam.id}.`) && getNode(id)?.kind === "note")
      .sort((a, b) => b[1].intensity - a[1].intensity),
    famLevel: session.ratings?.[fam.id]?.intensity || 0,
  })).filter((g) => g.notes.length || g.famLevel);

  const liquorLabel = LIQUOR_COLORS.find((c) => c.value === session.liquor_color)?.label;

  return (
    <div className="space-y-4 pb-16">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <button type="button" onClick={onBack} className="text-sm text-muted hover:text-text min-h-[44px]">
          ← History
        </button>
        <div className="flex gap-2">
          {canWrite && (
            <>
              <Button variant="ghost" onClick={onEdit}>Edit</Button>
              <Button variant="danger" onClick={() => setConfirmDelete(true)}>Delete</Button>
            </>
          )}
        </div>
      </div>

      <header>
        <h2 className="font-display text-2xl font-bold">
          <button type="button" className="hover:underline text-left" onClick={() => onOpenTea(session.tea_id)}>
            {tea?.name || "Tea"}
          </button>
        </h2>
        <p className="text-sm text-muted">
          {[tea?.type, tea?.origin, tea?.harvest_year, session.brewed_at].filter(Boolean).join(" · ")}
        </p>
        {session.overall_rating && (
          <div className="mt-1"><StarRating value={session.overall_rating} readOnly onChange={() => {}} /></div>
        )}
      </header>

      <Panel title="Flavor">
        <Segmented
          ariaLabel="Wheel view"
          options={[{ value: "radar", label: "Radar" }, { value: "sunburst", label: "Wheel" }]}
          value={mode}
          onChange={(v) => setMode(v || "radar")}
        />
        {mode === "radar" ? (
          <RadarChart
            series={[{ maxValues, meanValues, stroke: colors.accent }]}
            colors={colors}
            dark={dark}
            onTapAxis={(famId) => {
              setFocus({ family: famId, branch: null });
              setMode("sunburst");
            }}
          />
        ) : (
          <Sunburst
            ratings={session.ratings}
            focus={focus}
            onFocusChange={setFocus}
            onTapNote={() => {}}
            colors={colors}
            dark={dark}
          />
        )}
        {ratedByFamily.length > 0 && (
          <div className="space-y-2">
            {ratedByFamily.map(({ fam, notes, famLevel }) => (
              <div key={fam.id} className="text-sm">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: familyColor(fam.id, dark) }} aria-hidden="true" />
                  {fam.label}:
                </span>{" "}
                <span className="text-muted">
                  {famLevel ? `family ${famLevel}` : null}
                  {famLevel && notes.length ? " · " : ""}
                  {notes.map(([id, r]) => `${nodeLabel(id)} ${r.intensity}${r.note ? ` (“${r.note}”)` : ""}`).join(" · ")}
                </span>
              </div>
            ))}
          </div>
        )}
        {(session.custom_notes || []).filter((c) => c.intensity > 0).length > 0 && (
          <p className="text-sm">
            <span className="font-medium">Custom:</span>{" "}
            <span className="text-muted">
              {session.custom_notes.filter((c) => c.intensity > 0).map((c) => `${c.label} ${c.intensity}`).join(" · ")}
            </span>
          </p>
        )}
        {session.complexity && (
          <p className="text-sm"><span className="font-medium">Complexity:</span> <span className="text-muted">{session.complexity}</span></p>
        )}
      </Panel>

      <Panel title="Brew">
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-sm">
          {[
            ["Method", session.method], ["Vessel", session.vessel],
            ["Temp", session.water_temp_c !== "" && session.water_temp_c != null ? `${session.water_temp_c}°C` : null],
            ["Leaf", session.leaf_g ? `${session.leaf_g} g` : null],
            ["Water", session.water_ml ? `${session.water_ml} ml` : null],
            ["Ratio", session.leaf_g && session.water_ml ? `1:${Math.round(session.water_ml / session.leaf_g)}` : null],
            ["Water type", session.water_type], ["Rinse", session.rinse == null ? null : session.rinse ? "yes" : "no"],
            ["Infusions", session.infusion_count],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs uppercase tracking-wide text-muted">{k}</dt>
              <dd>{v || "—"}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      {(session.dry_leaf_notes || session.infused_leaf_notes || session.photos?.dry || session.photos?.infused || session.liquor_clarity || session.liquor_color || session.photos?.liquor) && (
        <Panel title="Leaf & liquor">
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted mb-1">Dry leaf</p>
              {session.photos?.dry && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.photos.dry} alt="Dry leaf" className="w-full rounded-lg border border-line mb-1.5" />
              )}
              <p className="text-muted">{session.dry_leaf_notes || "—"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted mb-1">Infused leaf</p>
              {session.photos?.infused && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.photos.infused} alt="Infused leaf" className="w-full rounded-lg border border-line mb-1.5" />
              )}
              <p className="text-muted">{session.infused_leaf_notes || "—"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted mb-1">Liquor</p>
              {session.photos?.liquor && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.photos.liquor} alt="Liquor" className="w-full rounded-lg border border-line mb-1.5" />
              )}
              <p className="text-muted flex items-center gap-2">
                {session.liquor_color && (
                  <span className="w-5 h-5 rounded-full border border-line inline-block" style={{ backgroundColor: session.liquor_color }} aria-hidden="true" />
                )}
                {[session.liquor_clarity, liquorLabel].filter(Boolean).join(", ") || "—"}
              </p>
            </div>
          </div>
        </Panel>
      )}

      {(Object.keys(session.tastes || {}).length > 0 || Object.keys(session.mouthfeel || {}).length > 0 || session.hui_gan != null || session.cha_qi != null) && (
        <Panel title="Taste & mouthfeel">
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              {TASTES.filter((t) => session.tastes?.[t] != null).map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <span className="w-24 text-muted">{t}</span>
                  <meter min={0} max={5} value={session.tastes[t]} className="flex-1" aria-label={`${t}: ${session.tastes[t]} of 5`} />
                  <span className="font-mono text-xs">{session.tastes[t]}/5</span>
                </div>
              ))}
              {session.hui_gan != null && (
                <div className="flex items-center gap-2">
                  <span className="w-24 text-muted">hui gan 回甘</span>
                  <meter min={0} max={5} value={session.hui_gan} className="flex-1" aria-label={`Hui gan ${session.hui_gan} of 5`} />
                  <span className="font-mono text-xs">{session.hui_gan}/5</span>
                </div>
              )}
              {session.cha_qi != null && (
                <div className="flex items-center gap-2">
                  <span className="w-24 text-muted">cha qi 茶氣</span>
                  <meter min={0} max={5} value={session.cha_qi} className="flex-1" aria-label={`Cha qi ${session.cha_qi} of 5`} />
                  <span className="font-mono text-xs">{session.cha_qi}/5</span>
                </div>
              )}
            </div>
            <div className="space-y-1">
              {MOUTHFEEL_DIMS.filter((d) => session.mouthfeel?.[d.key] != null).map((d) => {
                const v = session.mouthfeel[d.key];
                return (
                  <div key={d.key} className="flex items-center gap-2 text-xs">
                    <span className="w-16 text-right text-muted">{d.left}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-surface-2 relative" aria-label={`${d.left} to ${d.right}: ${v}`}>
                      <span
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-tea-amber"
                        style={{ left: `calc(${((v + 3) / 6) * 100}% - 6px)` }}
                      />
                    </div>
                    <span className="w-16 text-muted">{d.right}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Panel>
      )}

      {(session.infusions || []).length > 0 && (
        <Panel title="Infusions">
          <ol className="text-sm space-y-1">
            {session.infusions.map((inf) => (
              <li key={inf.infusion_number} className="flex gap-3">
                <span className="font-mono text-xs text-muted w-6">#{inf.infusion_number}</span>
                <span className="font-mono text-xs w-12">{inf.steep_seconds ? `${inf.steep_seconds}s` : "—"}</span>
                <span className="text-muted">{inf.note || ""}</span>
              </li>
            ))}
          </ol>
        </Panel>
      )}

      {(session.notes || session.drink_again) && (
        <Panel title="Verdict">
          {session.drink_again && (
            <p className="text-sm"><span className="font-medium">Drink again:</span> <span className="text-muted">{session.drink_again}</span></p>
          )}
          {session.notes && <p className="text-sm text-muted whitespace-pre-wrap">{session.notes}</p>}
        </Panel>
      )}

      <Panel title="Export" subtitle="share or download">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => doExport("png")} disabled={busy === "png"}>{busy === "png" ? "…" : "PNG card"}</Button>
          <Button variant="subtle" onClick={() => doExport("pdf")} disabled={busy === "pdf"}>{busy === "pdf" ? "…" : "PDF sheet"}</Button>
          <Button variant="ghost" onClick={() => doExport("json")}>JSON</Button>
          <Button variant="ghost" onClick={() => doExport("csv")}>CSV</Button>
        </div>
      </Panel>

      {confirmDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/45" onClick={() => setConfirmDelete(false)} />
          <div role="alertdialog" aria-modal="true" aria-label="Confirm delete" className="relative rounded-xl border border-line bg-surface p-5 max-w-sm w-full">
            <p className="font-medium mb-1">Delete this session?</p>
            <p className="text-sm text-muted mb-4">
              {tea?.name} · {session.brewed_at}. This can’t be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setConfirmDelete(false)}>Keep</Button>
              <Button variant="danger" onClick={onDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
