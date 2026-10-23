import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

const BARS = 34;

// Live audio waveform. `energy` scales the motion (1 while recording, lower
// while transcribing); heights are a deterministic function of time.
export const Waveform: React.FC<{ readonly color: string; readonly energy: number }> = ({ color, energy }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2.2, height: 30 }}>
      {Array.from({ length: BARS }, (_, i) => {
        const envelope = 0.35 + 0.65 * Math.sin((Math.PI * i) / (BARS - 1));
        const motion = Math.abs(Math.sin(t * 7.3 + i * 0.9) * Math.cos(t * 3.1 + i * 0.37));
        const h = 5 + 22 * envelope * (0.4 * (1 - energy) + energy * (0.35 + 0.65 * motion));
        return <div key={i} style={{ width: 3, height: h, borderRadius: 1.5, background: color }} />;
      })}
    </div>
  );
};
