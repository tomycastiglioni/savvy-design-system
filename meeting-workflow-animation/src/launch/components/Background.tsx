import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { BG, BgName, CLAMP, EASE_IN_OUT } from "../theme";
import { BG_STOPS, useT } from "../timeline";

const gradient = (bg: BgName) =>
  `linear-gradient(102deg, ${BG[bg][0]} 20%, ${BG[bg][1]} 80%)`;

// Cream to start; each chapter's gradient crossfades in on top of the last.
export const Background: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill style={{ background: gradient("cream") }}>
      {BG_STOPS.map(([from, to, bg]) => {
        const p = interpolate(t, [from, to], [0, 1], {
          ...CLAMP,
          easing: EASE_IN_OUT,
        });
        return p > 0 ? (
          <AbsoluteFill
            key={from}
            style={{ background: gradient(bg), opacity: p }}
          />
        ) : null;
      })}
    </AbsoluteFill>
  );
};
