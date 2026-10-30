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
