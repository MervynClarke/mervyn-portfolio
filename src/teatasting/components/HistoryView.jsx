"use client";
// Browsable session history: sortable/filterable table (including "note X
// rated ≥ N"), bulk CSV export, and compare-mode selection of 2–3 sessions.
import { useMemo, useState } from "react";
import { FAMILIES, getNode, topNotes } from "../lib/taxonomy";
import { TEA_TYPES } from "./SessionForm";
import { Button, Select, TextInput } from "./ui";
import { exportBulkCsv, shareOrDownload } from "../lib/exports";

const METHOD_OPTIONS = ["", "gongfu", "western", "grandpa", "cold_brew", "boiled", "other"];

// All note labels for the note-filter datalist.
const NOTE_OPTIONS = [];
for (const fam of FAMILIES)
  for (const br of fam.branches)
    for (const n of br.notes) NOTE_OPTIONS.push({ id: n.id, label: n.label });

export default function HistoryView({ sessions, teas, onOpen, onOpenTea, onCompare, onNew }) {
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState(-1);
  const [fType, setFType] = useState("");
  const [fMethod, setFMethod] = useState("");
  const [fFrom, setFFrom] = useState("");
  const [fTo, setFTo] = useState("");
  const [fNote, setFNote] = useState("");
  const [fNoteMin, setFNoteMin] = useState(3);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState([]);

  const teaById = useMemo(() => Object.fromEntries(teas.map((t) => [t.id, t])), [teas]);

  const noteMatch = useMemo(() => {
    const needle = fNote.trim().toLowerCase();
    if (!needle) return null;
    return NOTE_OPTIONS.find((n) => n.label.toLowerCase() === needle) || null;
  }, [fNote]);

  const rows = useMemo(() => {
    let list = sessions.map((s) => ({
      s,
      tea: teaById[s.tea_id] || { name: "?" },
      top: topNotes(s.ratings, 3),
    }));
    if (fType) list = list.filter((r) => r.tea.type === fType);
    if (fMethod) list = list.filter((r) => r.s.method === fMethod);
    if (fFrom) list = list.filter((r) => (r.s.brewed_at || "") >= fFrom);
    if (fTo) list = list.filter((r) => (r.s.brewed_at || "") <= fTo);
    if (noteMatch)
      list = list.filter((r) => (r.s.ratings?.[noteMatch.id]?.intensity || 0) >= fNoteMin);
    const dir = sortDir;
    list.sort((a, b) => {
      if (sortKey === "date") return dir * String(a.s.brewed_at || "").localeCompare(String(b.s.brewed_at || ""));
      if (sortKey === "tea") return dir * a.tea.name.localeCompare(b.tea.name);
      if (sortKey === "rating") return dir * ((a.s.overall_rating || 0) - (b.s.overall_rating || 0));
      return 0;
    });
    return list;
  }, [sessions, teaById, fType, fMethod, fFrom, fTo, noteMatch, fNoteMin, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(-sortDir);
    else {
      setSortKey(key);
      setSortDir(-1);
    }
  };

  const toggleSelect = (id) =>
    setSelected((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : cur.length >= 3 ? cur : [...cur, id]
    );

  const ratio = (s) =>
    s.leaf_g && s.water_ml ? `1:${Math.round(s.water_ml / s.leaf_g)}` : "—";

  const arrow = (key) => (sortKey === key ? (sortDir < 0 ? " ↓" : " ↑") : "");

  return (
    <div className="space-y-4 pb-24">
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={onNew}>+ New session</Button>
        <Button
          variant={selectMode ? "primary" : "ghost"}
          onClick={() => {
            setSelectMode(!selectMode);
            setSelected([]);
          }}
        >
          {selectMode ? "Cancel compare" : "Compare"}
        </Button>
        <Button
          variant="ghost"
          onClick={async () => {
            const blob = exportBulkCsv(sessions, teas);
            await shareOrDownload(blob, "tea-sessions.csv");
          }}
          disabled={!sessions.length}
        >
          ⤓ All CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <Select
          aria-label="Filter by type"
          options={[{ value: "", label: "any type" }, ...TEA_TYPES.map((t) => ({ value: t, label: t }))]}
          value={fType}
          onChange={(e) => setFType(e.target.value)}
        />
        <Select
          aria-label="Filter by method"
          options={METHOD_OPTIONS.map((m) => ({ value: m, label: m || "any method" }))}
          value={fMethod}
          onChange={(e) => setFMethod(e.target.value)}
        />
        <TextInput type="date" aria-label="From date" value={fFrom} onChange={(e) => setFFrom(e.target.value)} />
        <TextInput type="date" aria-label="To date" value={fTo} onChange={(e) => setFTo(e.target.value)} />
        <TextInput
          list="tt-note-filter"
          placeholder="note, e.g. Indian jujube"
          aria-label="Filter by flavor note"
          value={fNote}
          onChange={(e) => setFNote(e.target.value)}
        />
        <datalist id="tt-note-filter">
          {NOTE_OPTIONS.map((n) => (
            <option key={n.id} value={n.label} />
          ))}
        </datalist>
        <Select
          aria-label="Minimum note intensity"
          options={[1, 2, 3, 4, 5].map((v) => ({ value: v, label: `≥ ${v}` }))}
          value={fNoteMin}
          onChange={(e) => setFNoteMin(Number(e.target.value))}
        />
      </div>
      {fNote && !noteMatch && (
        <p className="text-xs text-muted -mt-2">
          Pick an exact note from the suggestions to apply the flavor filter.
        </p>
      )}

      {/* Table (scrolls horizontally on narrow screens) */}
      <div className="overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-line">
              {selectMode && <th className="px-3 py-2.5 w-10"></th>}
              <th className="px-3 py-2.5">
                <button type="button" onClick={() => toggleSort("date")}>Date{arrow("date")}</button>
              </th>
              <th className="px-3 py-2.5">
                <button type="button" onClick={() => toggleSort("tea")}>Tea{arrow("tea")}</button>
              </th>
              <th className="px-3 py-2.5">Type</th>
              <th className="px-3 py-2.5">Method</th>
              <th className="px-3 py-2.5">Ratio</th>
              <th className="px-3 py-2.5">
                <button type="button" onClick={() => toggleSort("rating")}>★{arrow("rating")}</button>
              </th>
              <th className="px-3 py-2.5">Top notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ s, tea, top }) => (
              <tr
                key={s.id}
                className="border-b border-line/60 last:border-0 hover:bg-surface-2/60 cursor-pointer"
                onClick={() => (selectMode ? toggleSelect(s.id) : onOpen(s.id))}
              >
                {selectMode && (
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(s.id)}
                      onChange={() => toggleSelect(s.id)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Select ${tea.name} ${s.brewed_at}`}
                      className="w-5 h-5 accent-[#C4883A]"
                    />
                  </td>
                )}
                <td className="px-3 py-3 font-mono text-xs whitespace-nowrap">{s.brewed_at || "—"}</td>
                <td className="px-3 py-3 font-medium">
                  <button
                    type="button"
                    className="hover:underline text-left"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenTea(s.tea_id);
                    }}
                  >
                    {tea.name}
                  </button>
                </td>
                <td className="px-3 py-3 text-muted">{tea.type || "—"}</td>
                <td className="px-3 py-3 text-muted">{s.method || "—"}</td>
                <td className="px-3 py-3 font-mono text-xs">{ratio(s)}</td>
                <td className="px-3 py-3 text-tea-amber dark:text-tea-amber-light whitespace-nowrap">
                  {s.overall_rating ? "★".repeat(s.overall_rating) : "—"}
                </td>
                <td className="px-3 py-3 text-muted text-xs">
                  {top.length ? top.map((n) => `${n.label} ${n.intensity}`).join(" · ") : "—"}
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={selectMode ? 8 : 7} className="px-3 py-8 text-center text-muted">
                  {sessions.length ? "Nothing matches these filters." : "No sessions yet — log your first tea."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectMode && selected.length >= 2 && (
        <div className="fixed bottom-4 left-0 right-0 z-[60] flex justify-center px-4">
          <Button className="shadow-lg" onClick={() => onCompare(selected)}>
            Compare {selected.length} sessions →
          </Button>
        </div>
      )}
    </div>
  );
}
