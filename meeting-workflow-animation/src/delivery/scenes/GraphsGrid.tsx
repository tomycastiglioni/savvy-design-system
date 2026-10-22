import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Reveal } from "../../shared/components/Reveal";
import { AccountBreakdownChart } from "../charts/AccountBreakdownChart";
import { AllocationChart } from "../charts/AllocationChart";
import { TaxBracketChart } from "../charts/TaxBracketChart";
import { AddGraphLabel, BuildSpinner, CardHeader, cardStyle, useAddGraph } from "../components/GraphCard";
import { C, CARD, CARD_HEADER_H, CLAMP, EASE_IN_OUT, HEADER, SLOTS } from "../layout";
import { T } from "../timeline";

const BODY_H = CARD.h - CARD_HEADER_H;

// Mounted at frame 0 (local = absolute). Everything here steps back when the
// Retirement projection card goes into presentation mode.
export const GraphsGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = (s: number) => s * fps;

  const exit = interpolate(frame, [sec(T.presentStart), sec(T.presentStart + 0.4)], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const buildTL = interpolate(frame, [sec(0.35), sec(1.15)], [0, 1], CLAMP);
  const buildTR = interpolate(frame, [sec(0.45), sec(1.3)], [0, 1], CLAMP);
  const br = useAddGraph(T.clickAddB);
  const buildBR = interpolate(frame, [sec(br.buildFrom), sec(br.buildFrom + 0.7)], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{ opacity: 1 - exit, scale: 1 - 0.015 * exit, filter: `blur(${exit * 4}px)` }}>
      <Reveal at={0} style={{ position: "absolute", left: HEADER.x, top: HEADER.y }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: C.ink }}>Graphs</div>
        <div style={{ fontSize: 15, color: C.muted, marginTop: 6 }}>Visuals for the meeting. Edit assumptions live when presenting.</div>
      </Reveal>

      <Reveal at={0.15} y={14} style={cardStyle(SLOTS.tl.x, SLOTS.tl.y, CARD.w, CARD.h)}>
        <CardHeader title="Tax bracket impact" subtitle="Taxable income vs. federal brackets." />
        <div style={{ position: "absolute", left: 0, top: CARD_HEADER_H, width: CARD.w, height: BODY_H }}>
          <TaxBracketChart w={CARD.w} h={BODY_H} build={buildTL} />
        </div>
      </Reveal>

      <Reveal at={0.25} y={14} style={cardStyle(SLOTS.tr.x, SLOTS.tr.y, CARD.w, CARD.h)}>
        <CardHeader title="Account breakdown" subtitle="What each account adds to the total." />
        <div style={{ position: "absolute", left: 0, top: CARD_HEADER_H, width: CARD.w, height: BODY_H }}>
          <AccountBreakdownChart w={CARD.w} h={BODY_H} build={buildTR} />
        </div>
      </Reveal>

      {/* Bottom-right: "Add graph" slot that becomes Allocation vs. target */}
      <Reveal
        at={0.45}
        y={14}
        style={{
          ...cardStyle(SLOTS.br.x, SLOTS.br.y, CARD.w, CARD.h),
          background: frame < sec(T.clickAddB) ? `rgba(249, 250, 251, ${br.hover})` : C.white,
          borderColor: frame < sec(T.clickAddB) && br.hover > 0.5 ? C.border : C.statsBorder,
          scale: 1 - 0.01 * br.press,
        }}
      >
        <div style={{ opacity: br.label }}>
          <AddGraphLabel hover={br.hover} />
        </div>
        <BuildSpinner opacity={br.spinner} spin={br.spin} />
        <Reveal at={br.headerAt}>
          <CardHeader title="Allocation vs. target" subtitle="Current mix vs. target allocation." />
        </Reveal>
        <div style={{ position: "absolute", left: 0, top: CARD_HEADER_H, width: CARD.w, height: BODY_H }}>
          <AllocationChart w={CARD.w} h={BODY_H} build={buildBR} />
        </div>
      </Reveal>
    </AbsoluteFill>
  );
};
