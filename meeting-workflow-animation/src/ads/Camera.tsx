import React from "react";
import { interpolate } from "remotion";
import { CLAMP, EASE_MORPH } from "../shared/theme";

// A workflow video's 1300×900 canvas seen through a moving camera: `x`, `y`
// place the canvas's top-left in the ad and `s` scales it. Between two keys
// the camera eases (EASE_MORPH); two keys with the same view hold it.
export type View = { readonly x: number; readonly y: number; readonly s: number };
export type CameraKey = View & { readonly t: number };

export const SOURCE = { w: 1300, h: 900 };

export const viewAt = (keys: readonly CameraKey[], t: number): View => {
  const ts = keys.map((k) => k.t);
  const at = (f: (k: CameraKey) => number) =>
    keys.length === 1 ? f(keys[0]) : interpolate(t, ts, keys.map(f), { ...CLAMP, easing: EASE_MORPH });
  return { x: at((k) => k.x), y: at((k) => k.y), s: at((k) => k.s) };
};

// Source point → ad point, and back, for one view.
export const toAd = (v: View, p: { x: number; y: number }) => ({ x: v.x + p.x * v.s, y: v.y + p.y * v.s });
export const toSource = (v: View, r: { x: number; y: number; w: number; h: number }) => ({
  x: (r.x - v.x) / v.s,
  y: (r.y - v.y) / v.s,
  w: r.w / v.s,
  h: r.h / v.s,
});

// The view that puts source point (sx, sy) at ad point (ax, ay) at scale s.
export const anchor = (sx: number, sy: number, ax: number, ay: number, s: number): View => ({ x: ax - sx * s, y: ay - sy * s, s });

export const Camera: React.FC<{ readonly view: View; readonly children: React.ReactNode }> = ({ view, children }) => (
  <div style={{ position: "absolute", left: view.x, top: view.y, width: SOURCE.w, height: SOURCE.h, scale: view.s, transformOrigin: "0 0" }}>{children}</div>
);
