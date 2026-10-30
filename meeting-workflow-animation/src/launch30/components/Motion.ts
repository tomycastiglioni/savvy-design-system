import type React from "react";
import { interpolate } from "remotion";
import { CLAMP, EASE_IN_OUT, EASE_OUT } from "../theme";

export type Rect = { x: number; y: number; w: number; h: number };

export const ramp = (t: number, a: number, b: number, easing: (n: number) => number = EASE_OUT) =>
  interpolate(t, [a, b], [0, 1], { ...CLAMP, easing });
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
export const lerpRect = (a: Rect, b: Rect, p: number): Rect => ({
  x: lerp(a.x, b.x, p),
  y: lerp(a.y, b.y, p),
  w: lerp(a.w, b.w, p),
  h: lerp(a.h, b.h, p),
});
export const rectStyle = (r: Rect): React.CSSProperties => ({ left: r.x, top: r.y, width: r.w, height: r.h });

const blur = (px: number) => (px > 0.05 ? `blur(${px}px)` : undefined);

// The launch text effect: slides up from below out of a blur, landing in its
// place; leaves with a fade, a little blur and a small lift.
export const SLIDE = { y: 36, blur: 9 };
export const slideText = (t: number, inAt: number, outAt = Infinity, dur = 0.6): React.CSSProperties => {
  const p = ramp(t, inAt, inAt + dur);
  const out = ramp(t, outAt, outAt + 0.35, EASE_IN_OUT);
  return { opacity: p * (1 - out), translate: `0px ${(1 - p) * SLIDE.y - out * 10}px`, filter: blur((1 - p) * SLIDE.blur + out * 5) };
};

// Headlines rise in line by line out of a blur (as in the 44 s cut) and
// leave together.
export const riseText = (t: number, inAt: number, outAt = Infinity, dur = 0.7): React.CSSProperties => {
  const p = ramp(t, inAt, inAt + dur);
  const out = ramp(t, outAt, outAt + 0.4, EASE_IN_OUT);
  return { opacity: p * (1 - out), translate: `0px ${(1 - p) * 28 - out * 14}px`, filter: blur((1 - p) * 6 + out * 4) };
};
export const headlineMotion = (t: number, inAt: number, outAt: number) => (i: number) => riseText(t, inAt + i * 0.08, outAt);
