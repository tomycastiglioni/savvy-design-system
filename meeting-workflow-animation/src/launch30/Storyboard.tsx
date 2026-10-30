import React, { useState } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadDiatype } from "../launch/fonts";
import { F01Intro, F02Map, F13Recap, F14Logo } from "./frames/Bookends";
import { F06Present, F07WhatIf, F08Capture, F09Writing } from "./frames/Communicate";
import { F10Recap, F11Email, F12Sent } from "./frames/Deliver";
import { F03PrepReady, F04PrepDoc, F05Handoff } from "./frames/Prep";
import { C, FONT } from "./theme";

// Storyboard for the 30 s launch video, one static frame per video frame
// (frame i = storyboard frame i + 1). Render with `remotion still`.
export const FRAMES = [
  F01Intro,
  F02Map,
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
  F13Recap,
  F14Logo,
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
