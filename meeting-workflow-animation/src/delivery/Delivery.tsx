import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { DeliveryCursor } from "./DeliveryCursor";
import { bgGradient, C, FONT } from "./layout";
import { GraphsGrid } from "./scenes/GraphsGrid";
import { RetirementCard } from "./scenes/RetirementCard";
import { WhatIfPanel } from "./scenes/WhatIfPanel";
import { T } from "./timeline";

// Workflow 02 · Delivery — live charts and what-ifs.
// Graphs (1 + 1 added) → present Retirement projection → drag what-if sliders.
export const Delivery: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: bgGradient("mint"), fontFamily: FONT.sans, color: C.ink }}>
      <style>{"*{box-sizing:border-box;}"}</style>

      <Sequence name="Graphs grid" durationInFrames={Math.round((T.presentStart + 0.5) * fps)}>
        <GraphsGrid />
      </Sequence>

      <Sequence name="Retirement projection">
        <RetirementCard />
      </Sequence>

      <Sequence name="What-if controls" from={Math.round(T.panelStart * fps)}>
        <WhatIfPanel />
      </Sequence>

      <Sequence name="Cursor">
        <DeliveryCursor />
      </Sequence>
    </AbsoluteFill>
  );
};
