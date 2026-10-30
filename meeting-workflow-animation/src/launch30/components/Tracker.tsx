import { Check } from "lucide-react";
import React from "react";
import { C, DIATYPE, PHASES } from "../theme";

export type StepState = {
  readonly status: "todo" | "active" | "done";
  readonly ring?: number; // 0–1: time used in the active step
  readonly pop?: number; // 0–1: the check landing on a step just done
};

const DOT = 32;
const RING = 46;

const Step: React.FC<{ readonly i: number; readonly s: StepState }> = ({ i, s }) => {
  const p = PHASES[i];
  const lit = s.status !== "todo";
  const done = s.status === "done";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ position: "relative", width: DOT, height: DOT }}>
        {s.ring !== undefined && s.status === "active" ? (
          <svg
            width={RING}
            height={RING}
            viewBox={`0 0 ${RING} ${RING}`}
            style={{ position: "absolute", left: (DOT - RING) / 2, top: (DOT - RING) / 2, overflow: "visible", rotate: "-90deg" }}
          >
            <circle cx={RING / 2} cy={RING / 2} r={RING / 2 - 2} fill="none" stroke={p.accent} strokeOpacity={0.18} strokeWidth={3} />
            <circle
              cx={RING / 2}
              cy={RING / 2}
              r={RING / 2 - 2}
              fill="none"
              stroke={p.accent}
              strokeWidth={3}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - s.ring}
            />
          </svg>
        ) : null}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 700,
            background: lit ? p.accent : "transparent",
            border: lit ? "none" : "1.5px solid rgba(16, 24, 40, 0.25)",
            color: lit ? C.white : "rgba(16, 24, 40, 0.45)",
            scale: done && s.pop !== undefined ? 0.7 + 0.3 * s.pop : 1,
          }}
        >
          {done ? <Check size={18} strokeWidth={3} /> : i + 1}
        </div>
      </div>
      {/* Bold copy reserves the active width so the pill never changes size. */}
      <div style={{ position: "relative", fontSize: 23 }}>
        <span style={{ visibility: "hidden", fontWeight: 700 }}>{p.label}</span>
        <span
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            fontWeight: s.status === "active" ? 700 : 400,
            color: lit ? "#000000" : "rgba(16, 24, 40, 0.45)",
          }}
        >
          {p.label}
        </span>
      </div>
    </div>
  );
};

// The story's spine, docked at the top: the three phases, the active one's
// ring filling with the time left in it, and the lines between them filling
// at each hand-off.
export const TrackerView: React.FC<{
  readonly steps: readonly StepState[];
  readonly lines: readonly [number, number];
  readonly style?: React.CSSProperties;
}> = ({ steps, lines, style }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 48, display: "flex", justifyContent: "center", fontFamily: DIATYPE, ...style }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        height: 62,
        padding: "0 28px 0 16px",
        borderRadius: 31,
        background: "rgba(255, 255, 255, 0.62)",
        border: "1px solid rgba(255, 255, 255, 0.9)",
        boxShadow: "0 8px 24px -14px rgba(16, 24, 40, 0.25)",
      }}
    >
      {PHASES.map((p, i) => (
        <React.Fragment key={p.key}>
          {i > 0 ? (
            <div style={{ position: "relative", width: 64, height: 2, borderRadius: 1, background: "rgba(16, 24, 40, 0.14)" }}>
              <div style={{ position: "absolute", inset: 0, width: `${lines[i - 1] * 100}%`, background: PHASES[i - 1].accent, borderRadius: 1 }} />
            </div>
          ) : null}
          <Step i={i} s={steps[i]} />
        </React.Fragment>
      ))}
    </div>
  </div>
);

// Storyboard version: `step` is the active phase (0–2), 3 means all done;
// `toward` fills the line after the active phase (hand-off frames).
export const Tracker: React.FC<{ readonly step: number; readonly toward?: number }> = ({ step, toward = 0 }) => (
  <TrackerView
    steps={PHASES.map((_, i) => ({ status: i < step ? "done" : i === step ? "active" : "todo" }))}
    lines={[1, 2].map((i) => (i <= step ? 1 : i === step + 1 ? toward : 0)) as unknown as readonly [number, number]}
  />
);
