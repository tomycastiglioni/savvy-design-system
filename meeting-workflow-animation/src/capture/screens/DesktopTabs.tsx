import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, CLAMP, DESKTOP_TABS, EASE_OUT, TABS_BAR } from "../layout";

// Overview / Transcript, styled like the 01 prep document's tab bar.
export const DesktopTabs: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = interpolate(frame, [0, 0.45 * fps], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const width = DESKTOP_TABS[DESKTOP_TABS.length - 1].x + DESKTOP_TABS[DESKTOP_TABS.length - 1].w + 8;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: TABS_BAR.x,
          top: TABS_BAR.y,
          width,
          height: TABS_BAR.h,
          background: C.tabsBg,
          borderRadius: 12,
          opacity: enter,
          translate: `0px ${(1 - enter) * -14}px`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: DESKTOP_TABS[0].x,
            top: 8,
            width: DESKTOP_TABS[0].w,
            height: TABS_BAR.h - 16,
            borderRadius: 9,
            background: C.tabActive,
          }}
        />
        {DESKTOP_TABS.map((tab) => (
          <div
            key={tab.label}
            style={{
              position: "absolute",
              left: tab.x,
              top: 8,
              width: tab.w,
              height: TABS_BAR.h - 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 500,
              color: C.ink,
            }}
          >
            {tab.label}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
