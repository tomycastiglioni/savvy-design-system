import React from "react";
import { Easing, EasingFunction, interpolate } from "remotion";
import { Cam, CLAMP, EASE_IN_OUT } from "../theme";

export type CamKey = {
  readonly t: number;
  readonly cam: Cam;
  readonly ease?: EasingFunction;
};

// Camera at time `t` from keys (holds between moves). Each key's `ease`
// shapes the move arriving at it.
export const camAt = (t: number, keys: readonly CamKey[]): Cam => {
  const ts = keys.map((k) => k.t);
  const easing = keys.slice(1).map((k) => k.ease ?? EASE_IN_OUT);
  const pick = (f: (c: Cam) => number) =>
    keys.length === 1
      ? f(keys[0].cam)
      : interpolate(
          t,
          ts,
          keys.map((k) => f(k.cam)),
          { ...CLAMP, easing: easing.length ? easing : Easing.linear },
        );
  return { k: pick((c) => c.k), x: pick((c) => c.x), y: pick((c) => c.y) };
};

// A 1300×900 design-space box (one of the workflow videos) placed on the
// launch canvas by a camera: x' = cam.x + x · cam.k.
export const Stage: React.FC<{
  readonly cam: Cam;
  readonly w?: number;
  readonly h?: number;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ cam, w = 1300, h = 900, style, children }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      width: w,
      height: h,
      transformOrigin: "0px 0px",
      transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.k})`,
      ...style,
    }}
  >
    {children}
  </div>
);
