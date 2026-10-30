import React, { useState } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadDiatype } from "../launch/fonts";
import { F01Intro, F02Meeting, F13aPrep, F13bCommunicate, F13cDeliver, F14Tagline, F15Logo } from "./frames/Bookends";
import { F06Present, F07WhatIf, F08Capture, F09Writing } from "./frames/Communicate";
import { F10Recap, F11Email, F12Sent } from "./frames/Deliver";
import { F03PrepReady, F04PrepDoc, F05Handoff } from "./frames/Prep";
import { C, FONT } from "./theme";

// Storyboard for the 30 s launch video, one static frame per video frame, in
// order (F01 … F15, with F13 in three steps). Render with `remotion still`.
export const FRAMES = [
  F01Intro,
  F02Meeting,
  F03PrepReady,
  F04PrepDoc,
  F05Handoff,
  F06Present,
  F07WhatIf,
  F08Capture,
  F09Writing,
  F10Recap,
  F11Email,
  F12Sent,
  F13aPrep,
  F13bCommunicate,
  F13cDeliver,
  F14Tagline,
  F15Logo,
];

export const Launch30Storyboard: React.FC = () => {
  useState(loadDiatype);
  const Frame = FRAMES[Math.min(useCurrentFrame(), FRAMES.length - 1)];
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.ink, overflow: "hidden" }}>
      <style>{"*{box-sizing:border-box;}"}</style>
      <Frame />
    </AbsoluteFill>
  );
};
