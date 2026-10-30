import React, { useState } from "react";
import { AbsoluteFill } from "remotion";
import { loadDiatype } from "../launch/fonts";
import { LiveBackground, LiveTracker } from "./components/Live";
import { Launch30Cursor } from "./Cursor";
import { CloseScene } from "./scenes/Close";
import { CommunicateScene } from "./scenes/Communicate";
import { DeliverScene } from "./scenes/Deliver";
import { Intro } from "./scenes/Intro";
import { PrepScene } from "./scenes/Prep";
import { Launch30Sfx } from "./Sfx";
import { C, FONT } from "./theme";

// Savvy Intelligence 2.0 launch video, 30 s (1920×1080, 60 fps): one client
// meeting followed through Prep → Communicate → Deliver, built from the
// storyboard frames (src/launch30/frames/). Beats in timeline.ts.
export const Launch30: React.FC = () => {
  useState(loadDiatype);
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.ink, overflow: "hidden" }}>
      <style>{"*{box-sizing:border-box;}"}</style>
      <LiveBackground />
      <PrepScene />
      <CommunicateScene />
      <DeliverScene />
      <Intro />
      <CloseScene />
      <LiveTracker />
      <Launch30Cursor />
      <Launch30Sfx />
    </AbsoluteFill>
  );
};
