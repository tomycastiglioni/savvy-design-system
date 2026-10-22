import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, CLAMP, EASE_OUT, TABS, TABS_BAR } from "../theme";
import { T } from "../timeline";

// Mounted at T.tabsStart. The active pill slides when the cursor clicks a tab.
export const DocTabs: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = interpolate(frame, [0, 0.45 * fps], [0, 1], { ...CLAMP, easing: EASE_OUT });

  const toAgenda = T.tabToAgenda - T.tabsStart;
  const toTasks = T.tabToTasks - T.tabsStart;
  const keys = [toAgenda * fps, (toAgenda + 0.32) * fps, toTasks * fps, (toTasks + 0.32) * fps];
  const easing = [EASE_OUT, Easing.linear, EASE_OUT];
  const pillX = interpolate(frame, keys, [TABS[0].x, TABS[1].x, TABS[1].x, TABS[2].x], { ...CLAMP, easing });
  const pillW = interpolate(frame, keys, [TABS[0].w, TABS[1].w, TABS[1].w, TABS[2].w], { ...CLAMP, easing });

  // Dividers only show between two inactive tabs.
  const divider1 = interpolate(pillX, [TABS[1].x, TABS[2].x], [0, 1], CLAMP);
  const divider2 = interpolate(pillX, [TABS[0].x, TABS[1].x], [1, 0], CLAMP);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: TABS_BAR.x,
          top: TABS_BAR.y,
          width: TABS_BAR.w,
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
            left: pillX,
            top: 8,
            width: pillW,
            height: TABS_BAR.h - 16,
            borderRadius: 9,
            background: C.tabActive,
          }}
        />
        {[
          { x: TABS[1].x, o: divider1 },
          { x: TABS[2].x, o: divider2 },
        ].map((d) => (
          <div key={d.x} style={{ position: "absolute", left: d.x, top: 22, width: 1, height: 22, background: "#D5DAE0", opacity: d.o }} />
        ))}
        {TABS.map((tab) => (
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
              whiteSpace: "nowrap",
            }}
          >
            {tab.label}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
