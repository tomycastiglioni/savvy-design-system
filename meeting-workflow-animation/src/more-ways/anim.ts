import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_IN_OUT, EASE_MORPH, EASE_OUT } from "../shared/theme";

export { EASE_IN_OUT, EASE_MORPH, EASE_OUT };
export const POP = Easing.out(Easing.back(2));
export const LINEAR = Easing.linear;

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
// 0 → 1 between a and b.
export const ramp = (t: number, a: number, b: number, easing: (n: number) => number = EASE_OUT) => interpolate(t, [a, b], [0, 1], { ...CLAMP, easing });
// In over [a, a + inDur], out over [b, b + outDur].
export const window = (t: number, a: number, b: number, inDur = 0.35, outDur = 0.35, easing = EASE_OUT) => ramp(t, a, a + inDur, easing) * (1 - ramp(t, b, b + outDur, EASE_IN_OUT));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

// Text caret blinking (on 0.53 s, off 0.53 s).
export const blink = (t: number) => t % 1.06 < 0.53;
// The first p of a string, by characters, or (words) only at word ends, as
// dictation lands.
export const typeOut = (s: string, p: number, words = false) => {
  const n = Math.round(clamp01(p) * s.length);
  if (!words || n >= s.length) return s.slice(0, n);
  const cut = s.lastIndexOf(" ", n);
  return cut > 0 ? s.slice(0, cut) : "";
};
// A key or button press: 0 → 1 → 0 around `at`.
export const press = (t: number, at: number) => {
  if (t < at - 0.03 || t > at + 0.18) return 0;
  return t < at + 0.05 ? (t - at + 0.03) / 0.08 : 1 - (t - at - 0.05) / 0.13;
};
// Cursor path: [time, x, y] keys, eased between.
export const along = (t: number, keys: readonly (readonly [number, number, number])[]) => {
  if (t <= keys[0][0]) return { x: keys[0][1], y: keys[0][2] };
  for (let i = 1; i < keys.length; i++) {
    const [t1, x1, y1] = keys[i];
    const [t0, x0, y0] = keys[i - 1];
    if (t <= t1) {
      const p = EASE_IN_OUT((t - t0) / (t1 - t0));
      return { x: lerp(x0, x1, p), y: lerp(y0, y1, p) };
    }
  }
  const last = keys[keys.length - 1];
  return { x: last[1], y: last[2] };
};

export const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};
