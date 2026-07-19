"use client";
// The flavor *record*: one axis per family, 0–5, max-intensity polygon with a
// fainter mean polygon behind it. In editable mode a vertex can be dragged to
// set a family-level intensity directly (fast logging without the drill-down).
import { useRef, useState } from "react";
import { FAMILIES } from "../lib/taxonomy";
import { polar, TAU, clamp } from "../lib/geometry";

const CX = 200;
const CY = 200;
const R_MAX = 148;
const R_LABEL = 165;

function axisAngle(i) {
  return (i / FAMILIES.length) * TAU;
}

function polygonPoints(values) {
  return FAMILIES.map((fam, i) => {
    const v = clamp(values[fam.id] || 0, 0, 5);
    return polar(CX, CY, (v / 5) * R_MAX, axisAngle(i)).join(",");
  }).join(" ");
}

export default function RadarChart({
  series, // [{ maxValues: {famId: 0-5}, meanValues?: {famId}, stroke, fill, label }]
  colors,
  dark = false,
  editable = false,
  onSetFamily = () => {},
  onTapAxis = null,
  showVertices = true,
}) {
  const svgRef = useRef(null);
  const [dragAxis, setDragAxis] = useState(null);

  const famColor = (fam) => (dark ? fam.colorDark || fam.color : fam.color);

  const pointerToValue = (e) => {
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const { x, y } = pt.matrixTransform(svg.getScreenCTM().inverse());
    const dx = x - CX;
    const dy = y - CY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    let angle = Math.atan2(dx, -dy);
    if (angle < 0) angle += TAU;
    const idx = Math.round(angle / (TAU / FAMILIES.length)) % FAMILIES.length;
    const value = Math.round(clamp((dist / R_MAX) * 5, 0, 5));
    return { famId: FAMILIES[idx].id, value };
  };

  const handlePointerDown = (e) => {
    if (!editable) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const { famId, value } = pointerToValue(e);
    setDragAxis(famId);
    onSetFamily(famId, value);
  };
  const handlePointerMove = (e) => {
    if (!editable || dragAxis == null) return;
    const { value } = pointerToValue(e);
    onSetFamily(dragAxis, value);
  };
  const handlePointerUp = () => setDragAxis(null);

  const primary = series[0];

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 400"
      className="w-full h-auto select-none"
      style={{ touchAction: editable ? "none" : "manipulation" }}
      role="group"
      aria-label={`Flavor radar. ${FAMILIES.map(
        (f) => `${f.label}: ${((primary?.maxValues || {})[f.id] || 0).toFixed(0)} of 5`
      ).join(", ")}.`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Intensity rings 1–5 */}
      {[1, 2, 3, 4, 5].map((v) => (
        <circle
          key={v}
          cx={CX}
          cy={CY}
          r={(v / 5) * R_MAX}
          fill="none"
          stroke={colors.line}
          strokeWidth={v === 5 ? 1.2 : 0.7}
          aria-hidden="true"
        />
      ))}
      {/* Spokes + rim color ticks + labels */}
      {FAMILIES.map((fam, i) => {
        const a = axisAngle(i);
        const [x1, y1] = polar(CX, CY, R_MAX, a);
        const [tx, ty] = polar(CX, CY, R_LABEL, a);
        const [cx2, cy2] = polar(CX, CY, R_MAX + 6, a);
        const anchor =
          Math.abs(Math.sin(a)) < 0.15 ? "middle" : Math.sin(a) > 0 ? "start" : "end";
        return (
          <g key={fam.id}>
            <line x1={CX} y1={CY} x2={x1} y2={y1} stroke={colors.line} strokeWidth="0.7" aria-hidden="true" />
            <circle cx={cx2} cy={cy2} r="3.5" fill={famColor(fam)} aria-hidden="true" />
            <text
              x={tx}
              y={ty + 3}
              textAnchor={anchor}
              fontSize="11"
              fontWeight="500"
              fill={colors.text}
              role={onTapAxis ? "button" : undefined}
              aria-label={onTapAxis ? `Open ${fam.label} on the sunburst` : undefined}
              style={onTapAxis ? { cursor: "pointer" } : undefined}
              onClick={onTapAxis ? () => onTapAxis(fam.id) : undefined}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {fam.label}
            </text>
          </g>
        );
      })}
      {/* Mean polygon (fainter), single-series only */}
      {series.length === 1 && primary.meanValues && (
        <polygon
          points={polygonPoints(primary.meanValues)}
          fill={primary.stroke}
          fillOpacity="0.10"
          stroke={primary.stroke}
          strokeOpacity="0.35"
          strokeWidth="1"
          strokeDasharray="4 3"
          aria-hidden="true"
        />
      )}
      {/* Max polygons */}
      {series.map((s, si) => (
        <polygon
          key={si}
          points={polygonPoints(s.maxValues)}
          fill={s.stroke}
          fillOpacity={series.length > 1 ? 0.12 : 0.22}
          stroke={s.stroke}
          strokeWidth="2"
          strokeLinejoin="round"
          aria-hidden="true"
        />
      ))}
      {/* Vertex handles (primary series) */}
      {showVertices &&
        FAMILIES.map((fam, i) => {
          const v = clamp((primary?.maxValues || {})[fam.id] || 0, 0, 5);
          const [x, y] = polar(CX, CY, (v / 5) * R_MAX, axisAngle(i));
          return (
            <g key={fam.id} aria-hidden="true">
              {editable && <circle cx={x} cy={y} r="16" fill="transparent" />}
              <circle
                cx={x}
                cy={y}
                r={dragAxis === fam.id ? 7 : 4.5}
                fill={famColor(fam)}
                stroke={colors.surface}
                strokeWidth="1.5"
              />
            </g>
          );
        })}
    </svg>
  );
}
