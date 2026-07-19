"use client";
// Hand-rolled SVG sunburst — the flavor *input* wheel.
// Tap a family to focus it (siblings compress to tappable slivers), tap a
// branch to spread its notes, tap a note to rate it. Rated notes fill with
// their family hue scaled by intensity; unrated notes stay pale outlines.
import { useEffect, useMemo, useRef, useState } from "react";
import { FAMILIES, leafCount, intensityFill, hexToRgb } from "../lib/taxonomy";
import { arcPath, arcLabelPath, radialLabelTransform, TAU } from "../lib/geometry";

const CX = 200;
const CY = 200;
const R_HUB = 33;
// Radii shift with focus: browsing the full wheel, the family ring is fat and
// carries radial labels (the vocabulary map); focused, it thins out to give
// the notes ring room to become tappable and labeled.
const RADII = {
  idle: { fam: [33, 118], br: [118, 158], note: [158, 194] },
  focused: { fam: [33, 68], br: [68, 106], note: [106, 194] },
};
const FOCUS_ANGLE = (300 / 360) * TAU; // focused family's share
const BRANCH_FOCUS_SHARE = 0.78; // focused branch's share of its family arc

function textOn(hex) {
  const [r, g, b] = hexToRgb(hex);
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 150 ? "#2c2c2c" : "#ffffff";
}

// Pure layout: Map nodeId -> {a0, a1, r0, r1} for the given focus state.
function computeLayout(focus) {
  const layout = new Map();
  const R = focus.family ? RADII.focused : RADII.idle;
  const counts = FAMILIES.map(leafCount);
  const total = counts.reduce((a, b) => a + b, 0);

  let famAngles;
  if (focus.family) {
    const rest = TAU - FOCUS_ANGLE;
    const otherTotal = total - counts[FAMILIES.findIndex((f) => f.id === focus.family)];
    famAngles = FAMILIES.map((f, i) =>
      f.id === focus.family ? FOCUS_ANGLE : rest * (counts[i] / otherTotal)
    );
  } else {
    famAngles = FAMILIES.map((f, i) => TAU * (counts[i] / total));
  }

  let a = 0;
  FAMILIES.forEach((fam, fi) => {
    const famA0 = a;
    const famA1 = a + famAngles[fi];
    layout.set(fam.id, { a0: famA0, a1: famA1, r0: R.fam[0], r1: R.fam[1] });

    const isFocused = focus.family === fam.id;
    const branchCounts = fam.branches.map((b) => b.notes.length);
    const famTotal = branchCounts.reduce((x, y) => x + y, 0);
    const famSpan = famA1 - famA0;

    let branchAngles;
    if (isFocused && focus.branch) {
      const bi = fam.branches.findIndex((b) => b.id === focus.branch);
      const rest = famSpan * (1 - BRANCH_FOCUS_SHARE);
      const otherTotal = famTotal - branchCounts[bi];
      branchAngles = fam.branches.map((b, i) =>
        i === bi
          ? famSpan * BRANCH_FOCUS_SHARE
          : otherTotal > 0
            ? rest * (branchCounts[i] / otherTotal)
            : rest / Math.max(1, fam.branches.length - 1)
      );
    } else {
      branchAngles = branchCounts.map((c) => famSpan * (c / famTotal));
    }

    let ba = famA0;
    fam.branches.forEach((br, bi) => {
      const brA0 = ba;
      const brA1 = ba + branchAngles[bi];
      layout.set(br.id, { a0: brA0, a1: brA1, r0: R.br[0], r1: R.br[1] });
      const per = (brA1 - brA0) / br.notes.length;
      br.notes.forEach((note, ni) => {
        layout.set(note.id, {
          a0: brA0 + per * ni,
          a1: brA0 + per * (ni + 1),
          r0: R.note[0],
          r1: R.note[1],
        });
      });
      ba = brA1;
    });
    a = famA1;
  });
  return layout;
}

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function useTweenedLayout(target, animate) {
  const [frame, setFrame] = useState(target);
  const prevRef = useRef(target);
  const rafRef = useRef(0);
  useEffect(() => {
    if (!animate) {
      prevRef.current = target;
      setFrame(target);
      return;
    }
    const from = prevRef.current;
    cancelAnimationFrame(rafRef.current);
    const t0 = performance.now();
    const D = 280;
    let done = false;
    const step = (now) => {
      const t = Math.min(1, (now - t0) / D);
      const e = easeInOut(t);
      const cur = new Map();
      for (const [id, tgt] of target) {
        const f = from.get(id) || tgt;
        cur.set(id, {
          a0: f.a0 + (tgt.a0 - f.a0) * e,
          a1: f.a1 + (tgt.a1 - f.a1) * e,
          r0: f.r0 + (tgt.r0 - f.r0) * e,
          r1: f.r1 + (tgt.r1 - f.r1) * e,
        });
      }
      prevRef.current = cur;
      setFrame(cur);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
      else done = true;
    };
    rafRef.current = requestAnimationFrame(step);
    // Throttled/background tabs may never fire rAF — snap to the target so
    // the wheel is never stuck mid-layout.
    const snap = setTimeout(() => {
      if (!done) {
        cancelAnimationFrame(rafRef.current);
        prevRef.current = target;
        setFrame(target);
      }
    }, D + 120);
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(snap);
    };
  }, [target, animate]);
  return frame;
}

export default function Sunburst({
  ratings = {},
  focus = { family: null, branch: null },
  onFocusChange = () => {},
  onTapNote = () => {},
  colors,
  dark = false,
  interactive = true,
  idPrefix = "sb",
}) {
  const targetLayout = useMemo(() => computeLayout(focus), [focus]);
  const layout = useTweenedLayout(targetLayout, interactive);

  const famColor = (fam) => (dark ? fam.colorDark || fam.color : fam.color);

  const tapFamily = (fam) => {
    if (!interactive) return;
    if (focus.family === fam.id) onFocusChange({ family: null, branch: null });
    else onFocusChange({ family: fam.id, branch: null });
  };
  const tapBranch = (fam, br) => {
    if (!interactive) return;
    if (focus.family !== fam.id) onFocusChange({ family: fam.id, branch: br.id });
    else if (focus.branch === br.id) onFocusChange({ family: fam.id, branch: null });
    else onFocusChange({ family: fam.id, branch: br.id });
  };

  const wedges = [];
  const labels = [];

  FAMILIES.forEach((fam) => {
    const fl = layout.get(fam.id);
    if (!fl) return;
    const color = famColor(fam);
    const span = fl.a1 - fl.a0;
    wedges.push(
      <path
        key={fam.id}
        d={arcPath(CX, CY, fl.r0, fl.r1, fl.a0, fl.a1)}
        fill={color}
        stroke={colors.surface}
        strokeWidth="1.5"
        role={interactive ? "button" : undefined}
        aria-label={`${fam.label} family${focus.family === fam.id ? " (focused — tap to zoom out)" : " — tap to focus"}`}
        style={interactive ? { cursor: "pointer" } : undefined}
        onClick={() => tapFamily(fam)}
      />
    );
    // Family label: radial inside the fat idle ring; curved along the arc
    // when this family is focused (its arc is wide, its ring thin).
    const rMid = (fl.r0 + fl.r1) / 2;
    const arcLen = span * rMid;
    const ringDepth = fl.r1 - fl.r0;
    if (ringDepth > 34 && arcLen >= 10) {
      const mid = (fl.a0 + fl.a1) / 2;
      const t = radialLabelTransform(CX, CY, fl.r0 + 6, mid);
      const showHanzi = fam.hanzi && arcLen >= 30;
      labels.push(
        <g key={`lbl-${fam.id}`} aria-hidden="true" pointerEvents="none">
          <text
            x={t.x}
            y={t.y}
            transform={t.transform}
            textAnchor={t.anchor}
            dominantBaseline="middle"
            fontSize="11.5"
            fontWeight="600"
            fill={textOn(color)}
            letterSpacing="0.02em"
          >
            {fam.label}
          </text>
          {showHanzi && (
            <text
              x={t.x}
              y={t.y}
              dy="12"
              transform={t.transform}
              textAnchor={t.anchor}
              dominantBaseline="middle"
              fontSize="9"
              fill={textOn(color)}
              opacity="0.85"
            >
              {fam.hanzi}
            </text>
          )}
        </g>
      );
    } else if (arcLen > fam.label.length * 7.5 + 8) {
      const p = arcLabelPath(CX, CY, rMid + 3.5, fl.a0, fl.a1, `${idPrefix}-fl-${fam.id}`);
      labels.push(
        <g key={`lbl-${fam.id}`} aria-hidden="true" pointerEvents="none">
          <defs>
            <path id={p.id} d={p.d} />
          </defs>
          <text fontSize="11" fontWeight="600" fill={textOn(color)} letterSpacing="0.04em">
            <textPath href={`#${p.id}`} startOffset="50%" textAnchor="middle">
              {fam.label}
            </textPath>
          </text>
        </g>
      );
    }

    fam.branches.forEach((br) => {
      const bl = layout.get(br.id);
      if (!bl) return;
      const bSpan = bl.a1 - bl.a0;
      const ratedInBranch = br.notes.some((n) => (ratings[n.id]?.intensity || 0) > 0);
      wedges.push(
        <path
          key={br.id}
          d={arcPath(CX, CY, bl.r0, bl.r1, bl.a0, bl.a1)}
          fill={intensityFill(color, colors.surface2, ratedInBranch ? 2 : 1)}
          stroke={colors.surface}
          strokeWidth="1.5"
          role={interactive ? "button" : undefined}
          aria-label={`${fam.label} › ${br.label} branch — tap to open`}
          style={interactive ? { cursor: "pointer" } : undefined}
          onClick={() => tapBranch(fam, br)}
        />
      );
      const bMid = (bl.r0 + bl.r1) / 2;
      if (bSpan * bMid > br.label.length * 6.5 + 6) {
        const p = arcLabelPath(CX, CY, bMid + 3, bl.a0, bl.a1, `${idPrefix}-bl-${br.id.replace(/\./g, "-")}`);
        labels.push(
          <g key={`lbl-${br.id}`} aria-hidden="true" pointerEvents="none">
            <defs>
              <path id={p.id} d={p.d} />
            </defs>
            <text fontSize="9.5" fontWeight="500" fill={colors.text}>
              <textPath href={`#${p.id}`} startOffset="50%" textAnchor="middle">
                {br.label}
              </textPath>
            </text>
          </g>
        );
      }

      br.notes.forEach((note) => {
        const nl = layout.get(note.id);
        if (!nl) return;
        const rating = ratings[note.id];
        const intensity = rating?.intensity || 0;
        const nSpan = nl.a1 - nl.a0;
        wedges.push(
          <path
            key={note.id}
            d={arcPath(CX, CY, nl.r0, nl.r1, nl.a0, nl.a1)}
            fill={intensity ? intensityFill(color, colors.surface, intensity) : colors.surface}
            stroke={intensity ? colors.surface : colors.line}
            strokeWidth={intensity ? 1.5 : 0.75}
            role={interactive ? "button" : undefined}
            aria-label={`${note.label}${intensity ? `, rated ${intensity} of 5` : ", unrated"} — tap to rate`}
            style={interactive ? { cursor: "pointer" } : undefined}
            onClick={() => interactive && onTapNote(note.id)}
          />
        );
        // Radial note label once the wedge is wide enough to hold it (and the
        // ring deep enough — the idle notes ring is a thin indicator only).
        const labelR = nl.r0 + 5;
        const wedgePx = nSpan * ((nl.r0 + nl.r1) / 2);
        if (wedgePx >= 13 && nl.r1 - nl.r0 > 60) {
          const mid = (nl.a0 + nl.a1) / 2;
          const t = radialLabelTransform(CX, CY, labelR, mid);
          const maxChars = 15;
          const txt =
            note.label.length > maxChars ? `${note.label.slice(0, maxChars - 1)}…` : note.label;
          const darkFill = intensity >= 4;
          const showHanzi = note.hanzi && wedgePx >= 26;
          labels.push(
            <g key={`lbl-${note.id}`} aria-hidden="true" pointerEvents="none">
              <text
                x={t.x}
                y={t.y}
                transform={t.transform}
                textAnchor={t.anchor}
                dominantBaseline="middle"
                fontSize="10"
                fill={darkFill ? textOn(color) : colors.text}
              >
                {txt}
              </text>
              {showHanzi && (
                <text
                  x={t.x}
                  y={t.y}
                  dy={t.anchor === "start" ? 11 : 11}
                  transform={t.transform}
                  textAnchor={t.anchor}
                  dominantBaseline="middle"
                  fontSize="8"
                  fill={darkFill ? textOn(color) : colors.muted}
                >
                  {note.hanzi}
                </text>
              )}
              {rating?.note ? (
                <circle
                  cx={t.x}
                  cy={t.y}
                  r="2"
                  transform={`${t.transform} translate(${t.anchor === "start" ? -8 : 8} 0)`}
                  fill={darkFill ? textOn(color) : colors.muted}
                />
              ) : null}
            </g>
          );
        }
      });
    });
  });

  const focusedFamily = focus.family ? FAMILIES.find((f) => f.id === focus.family) : null;

  return (
    <svg
      viewBox="0 0 400 400"
      className="w-full h-auto select-none"
      style={{ touchAction: "manipulation" }}
      role="group"
      aria-label="Flavor sunburst wheel. Tap a family, then a branch, then a note to rate it. A list view with the same controls is available below."
    >
      {wedges}
      {labels}
      {/* Hub: shows context, taps back out one level. */}
      <circle
        cx={CX}
        cy={CY}
        r={R_HUB - 1}
        fill={focusedFamily ? famColor(focusedFamily) : colors.surface2}
        stroke={colors.surface}
        strokeWidth="1.5"
        role={interactive ? "button" : undefined}
        aria-label={focusedFamily ? "Zoom out to full wheel" : "Wheel center"}
        style={interactive && focusedFamily ? { cursor: "pointer" } : undefined}
        onClick={() => interactive && onFocusChange({ family: null, branch: null })}
      />
      <g aria-hidden="true" pointerEvents="none">
        {focusedFamily ? (
          <>
            <text
              x={CX}
              y={CY - 3}
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="600"
              fill={textOn(famColor(focusedFamily))}
            >
              {focusedFamily.label.length > 9 ? focusedFamily.label.slice(0, 8) + "…" : focusedFamily.label}
            </text>
            <text
              x={CX}
              y={CY + 11}
              textAnchor="middle"
              fontSize="8.5"
              fill={textOn(famColor(focusedFamily))}
              opacity="0.85"
            >
              ⟲ back
            </text>
          </>
        ) : (
          <text x={CX} y={CY + 3} textAnchor="middle" fontSize="10" fill={colors.muted}>
            aroma
          </text>
        )}
      </g>
    </svg>
  );
}
