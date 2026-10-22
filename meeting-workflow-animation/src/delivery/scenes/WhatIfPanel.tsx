import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Reveal } from "../../shared/components/Reveal";
import { C, CHART, CLAMP, EASE_OUT, PANEL } from "../layout";
import { T } from "../timeline";
import { SLIDERS, sliderActive, sliderLabel, sliderP } from "../whatif";

// Mounted at T.panelStart. Slider positions come from whatif.ts so the knobs,
// labels, cursor and chart all read the same values.
export const WhatIfPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = T.panelStart + frame / fps;
  const enter = interpolate(frame, [0, 0.5 * fps], [0, 1], { ...CLAMP, easing: EASE_OUT });

  return (
    <AbsoluteFill style={{ opacity: enter, translate: `${(1 - enter) * 40}px 0px` }}>
      <Reveal at={0.05} style={{ position: "absolute", left: PANEL.x, top: PANEL.titleY, fontSize: 17, fontWeight: 600, color: C.ink }}>
        What-if controls
      </Reveal>

      {SLIDERS.map((s, i) => {
        const p = sliderP(i, t);
        const active = sliderActive(i, t);
        const top = PANEL.rowY + i * PANEL.rowGap;
        return (
          <Reveal key={s.label} at={0.12 + i * 0.06} style={{ position: "absolute", left: PANEL.x, top, width: PANEL.w }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15 }}>
              <span style={{ color: C.body, fontWeight: 500 }}>{s.label}</span>
              <span style={{ color: active > 0.5 ? C.green : C.ink, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{sliderLabel(i, p)}</span>
            </div>
            <div style={{ position: "absolute", left: 0, top: PANEL.trackOffset, width: PANEL.w, height: 4, borderRadius: 2, background: CHART.track }}>
              <div style={{ width: p * PANEL.w, height: 4, borderRadius: 2, background: C.green }} />
              <div
                style={{
                  position: "absolute",
                  left: p * PANEL.w - 9,
                  top: -7,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: C.green,
                  border: `3px solid ${C.white}`,
                  boxShadow: `0 1px 3px rgba(16, 24, 40, 0.3), 0 0 0 ${6 * active}px rgba(23, 82, 66, 0.15)`,
                  scale: 1 + 0.15 * active,
                }}
              />
            </div>
          </Reveal>
        );
      })}
    </AbsoluteFill>
  );
};
