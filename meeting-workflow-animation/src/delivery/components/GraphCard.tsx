import { ArrowUpRight, GripVertical, Pencil, Plus, X } from "lucide-react";
import React from "react";
import { interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { AIIcon } from "../../shared/components/AIIcon";
import { C, CARD_HEADER_H, CLAMP, EASE_IN_OUT, PRESENT_BTN } from "../layout";

export const PresentButton: React.FC<{ readonly hover?: number; readonly press?: number }> = ({ hover = 0, press = 0 }) => (
  <div
    style={{
      width: PRESENT_BTN.w,
      height: PRESENT_BTN.h,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      borderRadius: 8,
      border: `1px solid ${interpolateColors(hover, [0, 1], [C.border, C.faint])}`,
      background: interpolateColors(hover, [0, 1], [C.white, C.panel]),
      fontSize: 13,
      fontWeight: 500,
      color: C.ink,
      scale: 1 - 0.04 * press,
    }}
  >
    <ArrowUpRight size={14} strokeWidth={2} /> Present
  </div>
);

export const CardHeader: React.FC<{
  readonly title: string;
  readonly subtitle: string;
  readonly hover?: number;
  readonly press?: number;
}> = ({ title, subtitle, hover, press }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: CARD_HEADER_H, borderBottom: "1px solid #EEF0F2" }}>
    <div style={{ position: "absolute", left: 12, top: 16, color: C.faint }}>
      <GripVertical size={16} strokeWidth={2} />
    </div>
    <div style={{ position: "absolute", left: 36, top: 14, fontSize: 15, fontWeight: 600, color: C.ink, whiteSpace: "nowrap" }}>{title}</div>
    <div style={{ position: "absolute", left: 36, top: 37, fontSize: 12.5, color: C.muted, whiteSpace: "nowrap" }}>{subtitle}</div>
    <div style={{ position: "absolute", right: 14, top: PRESENT_BTN.top, display: "flex", alignItems: "center", gap: 12, color: C.faint }}>
      <PresentButton hover={hover} press={press} />
      <Pencil size={15} strokeWidth={1.8} />
      <X size={15} strokeWidth={1.8} />
    </div>
  </div>
);

export const AddGraphLabel: React.FC<{ readonly hover: number }> = ({ hover }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      fontSize: 17,
      color: interpolateColors(hover, [0, 1], [C.muted, C.ink]),
    }}
  >
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: "50%",
        background: interpolateColors(hover, [0, 1], ["#EEF0F2", C.borderSoft]),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Plus size={14} strokeWidth={2} />
    </div>
    Add graph
  </div>
);

// Timing for a slot that becomes a graph when clicked at `clickAt` (seconds,
// local to the enclosing Sequence).
export const useAddGraph = (clickAt: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return {
    hover: interpolate(frame, [(clickAt - 0.3) * fps, (clickAt - 0.18) * fps], [0, 1], CLAMP),
    press: interpolate(frame, [(clickAt - 0.03) * fps, (clickAt + 0.05) * fps, (clickAt + 0.18) * fps], [0, 1, 0], CLAMP),
    label: interpolate(frame, [clickAt * fps, (clickAt + 0.12) * fps], [1, 0], CLAMP),
    spinner:
      interpolate(frame, [(clickAt + 0.05) * fps, (clickAt + 0.15) * fps], [0, 1], CLAMP) *
      interpolate(frame, [(clickAt + 0.32) * fps, (clickAt + 0.42) * fps], [1, 0], CLAMP),
    spin: interpolate(frame, [clickAt * fps, (clickAt + 0.45) * fps], [0, 360], { ...CLAMP, easing: EASE_IN_OUT }),
    headerAt: clickAt + 0.35,
    buildFrom: clickAt + 0.45,
  };
};

export const BuildSpinner: React.FC<{ readonly opacity: number; readonly spin: number }> = ({ opacity, spin }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity }}>
    <AIIcon size={34} style={{ rotate: `${spin}deg` }} />
  </div>
);

export const cardStyle = (x: number, y: number, w: number, h: number): React.CSSProperties => ({
  position: "absolute",
  left: x,
  top: y,
  width: w,
  height: h,
  background: C.white,
  border: `1px solid ${C.statsBorder}`,
  borderRadius: 12,
  overflow: "hidden",
});
