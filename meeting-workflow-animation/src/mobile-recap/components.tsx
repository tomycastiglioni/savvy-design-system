import { Mic } from "lucide-react";
import React from "react";
import { C } from "../mobile-prep/layout";
import { RECAP } from "./content";

const Waveform: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 2, height: 14 }}>
    {[5, 9, 13, 8, 11, 6, 10, 4].map((h, i) => (
      <div key={i} style={{ width: 2.5, height: h, borderRadius: 2, background: C.green }} />
    ))}
  </div>
);

// "Recorded · 42 min" with a small waveform: the meeting was captured.
export const RecordedPill: React.FC<{ readonly style?: React.CSSProperties }> = ({ style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      height: 28,
      padding: "0 12px",
      borderRadius: 14,
      background: C.green50,
      color: C.green,
      fontSize: 12.5,
      fontWeight: 600,
      ...style,
    }}
  >
    <Mic size={14} strokeWidth={2.4} /> Recorded · {RECAP.minutes} min <Waveform />
  </div>
);
