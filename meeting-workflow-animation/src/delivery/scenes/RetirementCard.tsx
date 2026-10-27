import React from "react";
import { AbsoluteFill, Easing, interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { Reveal } from "../../shared/components/Reveal";
import { RetirementChart } from "../charts/RetirementChart";
import { AddGraphLabel, BuildSpinner, CardHeader, useAddGraph } from "../components/GraphCard";
import { C, CLAMP, EASE_IN_OUT, EASE_MORPH, FONT, GRAPH_CARD, GRAPH_SLOTS, PRESENT_RECT, SPLIT_RECT } from "../layout";
import { T } from "../timeline";
import { paramsAt } from "../whatif";

// Mounted at frame 0 and kept to the end: "Add graph" slot → Retirement
// projection card → presentation mode → left half beside the what-if controls.
export const RetirementCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = (s: number) => s * fps;

  const add = useAddGraph(T.clickAdd);
  const build = interpolate(frame, [sec(add.buildFrom), sec(add.buildFrom + 0.75)], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const axis = interpolate(frame, [sec(add.headerAt), sec(add.headerAt + 0.3)], [0, 1], CLAMP);

  const keys = [sec(T.presentStart), sec(T.presentEnd), sec(T.splitStart), sec(T.splitEnd)];
  const easing = [EASE_MORPH, Easing.linear, EASE_MORPH];
  const rect = (a: number, b: number, c: number) => interpolate(frame, keys, [a, b, b, c], { ...CLAMP, easing });
  const x = rect(GRAPH_SLOTS.add.x, PRESENT_RECT.x, SPLIT_RECT.x);
  const y = rect(GRAPH_SLOTS.add.y, PRESENT_RECT.y, SPLIT_RECT.y);
  const w = rect(GRAPH_CARD.w, PRESENT_RECT.w, SPLIT_RECT.w);
  const h = rect(GRAPH_CARD.h, PRESENT_RECT.h, SPLIT_RECT.h);

  const m = interpolate(frame, [sec(T.presentStart), sec(T.presentEnd)], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const compactHeader = interpolate(frame, [sec(T.presentStart), sec(T.presentStart + 0.2)], [1, 0], CLAMP);
  const presentHeader = interpolate(frame, [sec(T.presentEnd - 0.25), sec(T.presentEnd + 0.1)], [0, 1], CLAMP);
  const legend = interpolate(frame, [sec(T.presentEnd - 0.15), sec(T.presentEnd + 0.15)], [0, 1], CLAMP);
  const endLabel = interpolate(frame, [sec(T.presentEnd), sec(T.presentEnd + 0.25)], [0, 1], CLAMP);

  const presentHover = interpolate(frame, [sec(T.clickPresent - 0.3), sec(T.clickPresent - 0.18)], [0, 1], CLAMP);
  const presentPress = interpolate(frame, [sec(T.clickPresent - 0.03), sec(T.clickPresent + 0.05), sec(T.clickPresent + 0.18)], [0, 1, 0], CLAMP);
  const slot = frame < sec(T.clickAdd);

  return (
    <AbsoluteFill>
      <Reveal
        at={0.35}
        y={14}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: w,
          height: h,
          borderRadius: 12,
          overflow: "hidden",
          border: `1px solid ${slot && add.hover > 0.5 ? C.border : C.statsBorder}`,
          background: slot ? interpolateColors(add.hover, [0, 1], [C.white, "#F9FAFB"]) : C.white,
          scale: 1 - 0.01 * add.press,
          boxShadow: `0 1px 2px rgba(16, 24, 40, ${0.05 * m}), 0 16px 40px -12px rgba(16, 24, 40, ${0.1 * m})`,
        }}
      >
        <div style={{ opacity: add.label }}>
          <AddGraphLabel hover={add.hover} />
        </div>
        <BuildSpinner opacity={add.spinner} spin={add.spin} />

        <Reveal at={add.headerAt} style={{ opacity: compactHeader }}>
          <CardHeader title="Retirement projection" subtitle="Projected wealth over the plan horizon." hover={presentHover} press={presentPress} />
        </Reveal>

        <div style={{ position: "absolute", left: 44, top: 40, opacity: presentHeader, whiteSpace: "nowrap" }}>
          <div style={{ fontFamily: FONT.serif, fontSize: 30, lineHeight: 1.15, color: C.ink }}>Retirement projection (2026 – 2048)</div>
          <div style={{ fontSize: 15.5, fontStyle: "italic", color: C.muted, marginTop: 8 }}>
            Projected retirement wealth across the plan horizon.
          </div>
        </div>

        <RetirementChart
          w={w}
          h={h}
          m={m}
          build={build}
          axis={axis}
          params={paramsAt(frame / fps)}
          legend={legend}
          endLabel={endLabel}
        />
      </Reveal>
    </AbsoluteFill>
  );
};
