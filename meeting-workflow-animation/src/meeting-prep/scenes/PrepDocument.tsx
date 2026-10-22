import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AIIcon } from "../../shared/components/AIIcon";
import { C, CLAMP, DOC_PANEL, EASE_IN_OUT, EASE_MORPH, LOADING_BOX, REVIEW_BUTTON } from "../theme";

// Local times (seconds from T.prepDocStart).
const GROW = 0.6; // button → loading card
const HOLD_END = 1.55; // loading card holds until here
const EXPAND_END = 2.1; // loading card → document panel

// One box: "Review prep document" button → "Loading household…" card → the
// prep document panel.
export const PrepDocument: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const keys = [0, GROW * fps, HOLD_END * fps, EXPAND_END * fps];
  const easing = [EASE_MORPH, Easing.linear, EASE_MORPH];
  const rect = (a: number, b: number, c: number) =>
    interpolate(frame, keys, [a, b, b, c], { ...CLAMP, easing });

  const left = rect(REVIEW_BUTTON.x, LOADING_BOX.x, DOC_PANEL.x);
  const top = rect(REVIEW_BUTTON.y, LOADING_BOX.y, DOC_PANEL.y);
  const width = rect(REVIEW_BUTTON.w, LOADING_BOX.w, DOC_PANEL.w);
  const height = rect(REVIEW_BUTTON.h, LOADING_BOX.h, DOC_PANEL.h);
  const radius = rect(9, 18, 16);

  const colorKeys = [0, 0.4 * fps, HOLD_END * fps, (EXPAND_END - 0.05) * fps];
  const panel = interpolate(frame, [HOLD_END * fps, EXPAND_END * fps], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const label = interpolate(frame, [0, 0.12 * fps], [1, 0], CLAMP);
  const loading =
    interpolate(frame, [0.4 * fps, 0.65 * fps], [0, 1], CLAMP) *
    interpolate(frame, [HOLD_END * fps, (HOLD_END + 0.15) * fps], [1, 0], CLAMP);
  const spin = interpolate(frame, [0.35 * fps, (HOLD_END + 0.2) * fps], [0, 360], { ...CLAMP, easing: EASE_IN_OUT });
  const shimmer = interpolate(frame, [0.55 * fps, HOLD_END * fps], [130, -30], CLAMP);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left,
          top,
          width,
          height,
          borderRadius: radius,
          overflow: "hidden",
          background: interpolateColors(frame, colorKeys, [C.white, "#F7F8FB", "#F7F8FB", C.white]),
          border: `1px solid ${interpolateColors(frame, colorKeys, [C.faint, "#EEF0F3", "#EEF0F3", C.borderSoft])}`,
          boxShadow: `0 1px 2px rgba(16, 24, 40, ${0.05 * panel}), 0 16px 40px -12px rgba(16, 24, 40, ${0.1 * panel})`,
          // Once it becomes the document, fade its bottom edge like a scroll area.
          maskImage: `linear-gradient(to bottom, #000 calc(100% - 120px), rgba(0, 0, 0, ${1 - panel}))`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            translate: "-50% -50%",
            display: "flex",
            alignItems: "center",
            gap: 9,
            fontSize: 15.5,
            fontWeight: 500,
            color: C.ink,
            whiteSpace: "nowrap",
            opacity: label,
          }}
        >
          <AIIcon size={20} />
          Review prep document
        </div>

        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            translate: "-50% -50%",
            width: 420,
            textAlign: "center",
            opacity: loading,
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <AIIcon size={76} style={{ rotate: `${spin}deg` }} />
          </div>
          <div style={{ fontSize: 26, fontWeight: 600, color: C.ink, marginTop: 38 }}>Loading household…</div>
          <div
            style={{
              fontSize: 19,
              marginTop: 12,
              color: "transparent",
              backgroundImage: `linear-gradient(100deg, ${C.faint} 0%, ${C.faint} 40%, #DDE1E6 50%, ${C.faint} 60%, ${C.faint} 100%)`,
              backgroundSize: "250% 100%",
              backgroundPosition: `${shimmer}% 0`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
            }}
          >
            Loading household data…
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
