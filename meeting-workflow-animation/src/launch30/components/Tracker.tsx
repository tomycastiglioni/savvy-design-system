import { Check } from "lucide-react";
import React from "react";
import { C, DIATYPE, PHASES } from "../theme";

// The story's spine, docked at the top of every phase frame. `step` is the
// active phase (0–2); 3 means all done. `toward` fills the connector after
// the active phase, for hand-off frames.
export const Tracker: React.FC<{ readonly step: number; readonly toward?: number }> = ({ step, toward = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: 48,
      display: "flex",
      justifyContent: "center",
      fontFamily: DIATYPE,
    }}
  >
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
      {PHASES.map((p, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <React.Fragment key={p.key}>
            {i > 0 ? (
              <div style={{ position: "relative", width: 64, height: 2, borderRadius: 1, background: "rgba(16, 24, 40, 0.14)" }}>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: `${(i <= step ? 1 : i === step + 1 ? toward : 0) * 100}%`,
                    background: PHASES[i - 1].accent,
                    borderRadius: 1,
                  }}
                />
              </div>
            ) : null}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 700,
                  background: done || active ? p.accent : "transparent",
                  border: done || active ? "none" : `1.5px solid rgba(16, 24, 40, 0.25)`,
                  color: done || active ? C.white : "rgba(16, 24, 40, 0.45)",
                }}
              >
                {done ? <Check size={18} strokeWidth={3} /> : i + 1}
              </div>
              <div
                style={{
                  fontSize: 23,
                  fontWeight: active ? 700 : 400,
                  color: done || active ? "#000000" : "rgba(16, 24, 40, 0.45)",
                }}
              >
                {p.label}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  </div>
);

// Large three-step map for the opening and closing frames. `done` swaps the
// numbers for checks.
export const PhaseMap: React.FC<{ readonly top: number; readonly done?: boolean }> = ({ top, done = false }) => {
  const tile = { w: 420, h: 236, gap: 74 };
  const left = (1920 - (3 * tile.w + 2 * tile.gap)) / 2;
  return (
    <div style={{ position: "absolute", left, top, display: "flex", alignItems: "center", gap: 0, fontFamily: DIATYPE }}>
      {PHASES.map((p, i) => (
        <React.Fragment key={p.key}>
          {i > 0 ? (
            <svg width={tile.gap} height={24} viewBox={`0 0 ${tile.gap} 24`} style={{ display: "block" }}>
              <path d={`M14 12H${tile.gap - 16}M${tile.gap - 24} 5l8 7-8 7`} fill="none" stroke="rgba(16,24,40,0.35)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : null}
          <div
            style={{
              position: "relative",
              width: tile.w,
              height: tile.h,
              borderRadius: 26,
              background: `linear-gradient(135deg, rgba(255,255,255,0.75), rgba(255,255,255,0.35))`,
              border: "1px solid rgba(255, 255, 255, 0.95)",
              boxShadow: "0 24px 50px -28px rgba(16, 24, 40, 0.35)",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 10, background: p.accent }} />
            <div
              style={{
                position: "absolute",
                left: 34,
                top: 34,
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: p.accent,
                color: C.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 21,
                fontWeight: 700,
              }}
            >
              {done ? <Check size={24} strokeWidth={3} /> : i + 1}
            </div>
            <div style={{ position: "absolute", left: 34, top: 108, fontSize: 48, color: "#000000" }}>{p.label}</div>
            <div style={{ position: "absolute", left: 36, top: 172, fontSize: 21, color: "rgba(16, 24, 40, 0.6)" }}>{p.when}</div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};
