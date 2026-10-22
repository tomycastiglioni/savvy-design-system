import { interpolate } from "remotion";
import { CLAMP, EASE_OUT } from "../../shared/theme";

// Staggered 0→1 progress for item `i` of a chart build driven by `build` (0→1).
export const stagger = (build: number, i: number, step = 0.08, dur = 0.6) =>
  interpolate(build, [i * step, i * step + dur], [0, 1], { ...CLAMP, easing: EASE_OUT });

// Vertical bar with 4px rounded data-end (top), square at the baseline.
export const vBar = (x: number, top: number, w: number, base: number, r = 4) => {
  const h = base - top;
  if (h <= 0.5) {
    return "";
  }
  const rr = Math.min(r, h, w / 2);
  return `M${x},${base} V${top + rr} Q${x},${top} ${x + rr},${top} H${x + w - rr} Q${x + w},${top} ${x + w},${top + rr} V${base} Z`;
};

// Horizontal bar anchored at x0 with a 4px rounded data-end (right).
export const hBar = (x0: number, y: number, len: number, h: number, r = 4) => {
  if (len <= 0.5) {
    return "";
  }
  const rr = Math.min(r, len, h / 2);
  return `M${x0},${y} H${x0 + len - rr} Q${x0 + len},${y} ${x0 + len},${y + rr} V${y + h - rr} Q${x0 + len},${y + h} ${x0 + len - rr},${y + h} H${x0} Z`;
};

const polar = (cx: number, cy: number, r: number, a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];

// Annular sector between angles a0 → a1 (radians, clockwise from 3 o'clock).
export const sector = (cx: number, cy: number, r0: number, r1: number, a0: number, a1: number) => {
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const [x0, y0] = polar(cx, cy, r1, a0);
  const [x1, y1] = polar(cx, cy, r1, a1);
  const [x2, y2] = polar(cx, cy, r0, a1);
  const [x3, y3] = polar(cx, cy, r0, a0);
  return `M${x0},${y0} A${r1},${r1} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${r0},${r0} 0 ${large} 0 ${x3},${y3} Z`;
};

export const money = (v: number) => {
  if (v === 0) {
    return "$0";
  }
  if (v >= 1e6) {
    return `$${(v / 1e6).toFixed(1)}M`;
  }
  return `$${Math.round(v / 1e3)}K`;
};
