import { Easing, interpolate } from "remotion";
import { CLAMP } from "./layout";

// Global timeline, in seconds. Screens mounted with <Sequence from={...}> use
// times local to their own start; everything here is absolute.
export const T = {
  bannerIn: 0.15, // notification drops in
  ready: 0.35, // Dave R. row: "Preparing…" → "Prep ready"
  bannerOut: 1.62, // banner leaves, as if tapped
  push: 1.68, // prep screen pushes in
  reveal: 1.78, // summary and agenda rows fade in while the screen lands
  end: 3.5,
};

export const DURATION = Math.round(T.end * 60);

// UINavigationController-style push: 0.5 s, fast start, long settle.
const PUSH_DUR = 0.5;
const EASE_PUSH = Easing.bezier(0.32, 0.72, 0, 1);
export const pushAt = (t: number) =>
  interpolate(t, [T.push, T.push + PUSH_DUR], [0, 1], { ...CLAMP, easing: EASE_PUSH });
