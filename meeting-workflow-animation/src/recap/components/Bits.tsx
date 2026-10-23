import { CircleCheck } from "lucide-react";
import React from "react";
import { interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { C, CLAMP, EASE_OUT } from "../layout";

// Two versions of the same element stacked in one grid cell, crossfaded by `p`
// (0 = a, 1 = b). Used for the typeface switch, which can't be interpolated.
export const Swap: React.FC<{ readonly p: number; readonly a: React.ReactNode; readonly b: React.ReactNode }> = ({ p, a, b }) => (
  <div style={{ display: "grid" }}>
    <div style={{ gridArea: "1 / 1", opacity: 1 - p }}>{a}</div>
    <div style={{ gridArea: "1 / 1", opacity: p }}>{b}</div>
  </div>
);

// Hover / press values for a control clicked at `at` (absolute seconds).
export const useClick = (at: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return {
    hover: interpolate(t, [at - 0.32, at - 0.2], [0, 1], CLAMP),
    press: interpolate(t, [at - 0.03, at + 0.05, at + 0.18], [0, 1, 0], CLAMP),
  };
};

// Outline button matching the recap's "Draft client email" button.
export const OutlineButton: React.FC<{
  readonly w: number;
  readonly h: number;
  readonly hover?: number;
  readonly press?: number;
  readonly children: React.ReactNode;
}> = ({ w, h, hover = 0, press = 0, children }) => (
  <div
    style={{
      width: w,
      height: h,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderRadius: 8,
      border: `1px solid ${interpolateColors(hover, [0, 1], [C.border, C.faint])}`,
      background: interpolateColors(hover, [0, 1], [C.white, C.panel]),
      boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
      fontSize: 14,
      fontWeight: 500,
      color: C.ink,
      whiteSpace: "nowrap",
      scale: 1 - 0.03 * press,
    }}
  >
    {children}
  </div>
);

// Confirmation toast, bottom center. `at` is absolute seconds.
export const Toast: React.FC<{ readonly at: number; readonly dur: number; readonly children: React.ReactNode }> = ({ at, dur, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const p =
    interpolate(t, [at, at + 0.35], [0, 1], { ...CLAMP, easing: EASE_OUT }) *
    interpolate(t, [at + dur - 0.3, at + dur], [1, 0], CLAMP);
  if (p <= 0) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: 812,
        translate: `-50% ${(1 - p) * 16}px`,
        opacity: p,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "11px 18px 11px 14px",
        borderRadius: 12,
        background: C.ink,
        color: C.white,
        fontSize: 15,
        fontWeight: 500,
        boxShadow: "0 10px 30px -10px rgba(16, 24, 40, 0.45)",
        whiteSpace: "nowrap",
      }}
    >
      <CircleCheck size={18} strokeWidth={2.2} color={C.green300} />
      {children}
    </div>
  );
};
