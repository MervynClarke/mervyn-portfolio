"use client";
// CSV export. One row per session plus a totals row, in the same column order
// the sessions table shows on screen.
import { formatHours } from "./dates";
import { totalMinutes } from "./stats";
import { SOURCE_LABEL } from "../data/taxonomy";

function cell(value) {
  const s = value == null ? "" : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const HEADERS = [
  "#", "Practice date", "Duration (min)", "Title", "Teacher", "Style",
  "Source", "Source detail", "Focus", "Notes", "Logged at", "URL",
];

export function sessionsToCsv(sessions) {
  const sorted = [...sessions].sort((a, b) =>
    (a.practice_date || "").localeCompare(b.practice_date || "")
  );
  const rows = sorted.map((s, i) =>
    [
      i + 1,
      s.practice_date,
      s.duration_minutes,
      s.title,
      s.teacher,
      s.style,
      SOURCE_LABEL[s.source] || s.source,
      s.source_detail,
      (s.focus || []).join("; "),
      s.notes,
      s.created_at ? s.created_at.slice(0, 19).replace("T", " ") : "",
      s.url,
    ].map(cell)
  );
  const mins = totalMinutes(sorted);
  const totals = [
    "",
    `TOTAL (${sorted.length} sessions)`,
    mins,
    `${formatHours(mins)} hrs`,
    "", "", "", "", "", "", "", "",
  ].map(cell);
  return [HEADERS.map(cell), ...rows, totals].map((r) => r.join(",")).join("\r\n");
}

export function downloadCsv(sessions, filename = "yoga-sessions.csv") {
  // BOM so Excel opens the UTF-8 correctly on Windows.
  const blob = new Blob(["﻿", sessionsToCsv(sessions)], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
