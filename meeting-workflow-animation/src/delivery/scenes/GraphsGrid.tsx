import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Reveal } from "../../shared/components/Reveal";
import { AccountBreakdownChart } from "../charts/AccountBreakdownChart";
import { CardHeader, cardStyle } from "../components/GraphCard";
import { C, CARD_HEADER_H, CLAMP, EASE_IN_OUT, GRAPH_CARD, GRAPH_SLOTS, GRAPHS_HEADER } from "../layout";
import { T } from "../timeline";

const BODY_H = GRAPH_CARD.h - CARD_HEADER_H;

// Mounted at frame 0 (local = absolute): the header and the default graph.
// The "Add graph" slot beside it is the Retirement projection card. Steps back
// when that card goes into presentation mode.
export const GraphsGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = (s: number) => s * fps;

  const exit = interpolate(frame, [sec(T.presentStart), sec(T.presentStart + 0.4)], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const build = interpolate(frame, [sec(0.35), sec(1.2)], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{ opacity: 1 - exit, scale: 1 - 0.015 * exit, filter: `blur(${exit * 4}px)` }}>
      <Reveal at={0} style={{ position: "absolute", left: GRAPHS_HEADER.x, top: GRAPHS_HEADER.y }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: C.ink }}>Graphs</div>
      </Reveal>

      <Reveal at={0.15} y={14} style={cardStyle(GRAPH_SLOTS.default.x, GRAPH_SLOTS.default.y, GRAPH_CARD.w, GRAPH_CARD.h)}>
        <CardHeader title="Account breakdown" subtitle="What each account adds to the total." />
        <div style={{ position: "absolute", left: 0, top: CARD_HEADER_H, width: GRAPH_CARD.w, height: BODY_H }}>
          <AccountBreakdownChart w={GRAPH_CARD.w} h={BODY_H} build={build} />
        </div>
      </Reveal>
    </AbsoluteFill>
  );
};
