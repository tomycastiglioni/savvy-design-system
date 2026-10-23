import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, CLAMP, EASE_OUT } from "../layout";

// A finger tap: a soft touch point that lands, then the same green ring the
// desktop clicks use. `at` is absolute seconds; x/y are canvas px.
export const Touch: React.FC<{ readonly at: number; readonly x: number; readonly y: number }> = ({ at, x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (t < at - 0.12 || t > at + 0.6) {
    return null;
  }

  const land = interpolate(t, [at - 0.12, at], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const lift = interpolate(t, [at + 0.12, at + 0.32], [1, 0], CLAMP);
  const ring = interpolate(t, [at, at + 0.45], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const dot = 40 * (0.75 + 0.25 * land);
  const ringSize = 14 + ring * 56;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - ringSize / 2,
          top: y - ringSize / 2,
          width: ringSize,
          height: ringSize,
          borderRadius: "50%",
          border: `2px solid ${C.green300}`,
          background: "rgba(23, 82, 66, 0.10)",
          opacity: ring > 0 && ring < 1 ? 0.9 * (1 - ring) : 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - dot / 2,
          top: y - dot / 2,
          width: dot,
          height: dot,
          borderRadius: "50%",
          background: "rgba(29, 35, 52, 0.16)",
          border: "1.5px solid rgba(255, 255, 255, 0.85)",
          boxShadow: "0 2px 8px rgba(16, 24, 40, 0.18)",
          opacity: land * lift,
        }}
      />
    </>
  );
};
