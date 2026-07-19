// SVG polar helpers shared by the sunburst and radar.
// Angles in radians, 0 = 12 o'clock, increasing clockwise.

export function polar(cx, cy, r, angle) {
  return [cx + r * Math.sin(angle), cy - r * Math.cos(angle)];
}

// Annular sector path from angle a0 to a1 between radii r0 and r1.
export function arcPath(cx, cy, r0, r1, a0, a1) {
  const gap = 1e-4;
  if (a1 - a0 < gap) a1 = a0 + gap;
  // SVG arcs can't draw a full 360° in one command; split large sweeps.
  if (a1 - a0 >= Math.PI * 2 - 1e-3) a1 = a0 + Math.PI * 2 - 1e-3;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const [x0o, y0o] = polar(cx, cy, r1, a0);
  const [x1o, y1o] = polar(cx, cy, r1, a1);
  const [x0i, y0i] = polar(cx, cy, r0, a0);
  const [x1i, y1i] = polar(cx, cy, r0, a1);
  if (r0 <= 0.01) {
    return `M ${cx} ${cy} L ${x0o} ${y0o} A ${r1} ${r1} 0 ${large} 1 ${x1o} ${y1o} Z`;
  }
  return [
    `M ${x0o} ${y0o}`,
    `A ${r1} ${r1} 0 ${large} 1 ${x1o} ${y1o}`,
    `L ${x1i} ${y1i}`,
    `A ${r0} ${r0} 0 ${large} 0 ${x0i} ${y0i}`,
    "Z",
  ].join(" ");
}

// Path for a text label following the arc midline (for curved family labels).
export function arcLabelPath(cx, cy, r, a0, a1, id) {
  const mid = (a0 + a1) / 2;
  // Flip the path direction on the bottom half so text stays upright.
  const flip = mid > Math.PI / 2 && mid < (3 * Math.PI) / 2;
  const [x0, y0] = polar(cx, cy, r, flip ? a1 : a0);
  const [x1, y1] = polar(cx, cy, r, flip ? a0 : a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return {
    id,
    d: `M ${x0} ${y0} A ${r} ${r} 0 ${large} ${flip ? 0 : 1} ${x1} ${y1}`,
  };
}

// Orientation for radial note labels: rotate so text runs outward along the
// wedge midline, flipped on the left side so it never renders upside-down.
export function radialLabelTransform(cx, cy, r, angle) {
  const [x, y] = polar(cx, cy, r, angle);
  let deg = (angle * 180) / Math.PI - 90;
  let anchor = "start";
  if (deg > 90) {
    deg -= 180;
    anchor = "end";
  }
  return { x, y, transform: `rotate(${deg} ${x} ${y})`, anchor };
}

export const TAU = Math.PI * 2;

export function clamp(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v));
}
