import React, { useState } from "react";
import { AbsoluteFill } from "remotion";
import { Background } from "./components/Background";
import { loadDiatype } from "./fonts";
import { LaunchCursor } from "./LaunchCursor";
import { Sfx } from "./Sfx";
import { CaptureChapter } from "./scenes/CaptureChapter";
import { Close } from "./scenes/Close";
import { FollowUp } from "./scenes/FollowUp";
import { Intro } from "./scenes/Intro";
import { Materials } from "./scenes/Materials";
import { Planning } from "./scenes/Planning";
import { Prep } from "./scenes/Prep";
import { C, FONT } from "./theme";

// Savvy Intelligence 2.0 launch video (1920×1080, 44s). Seven chapters, each
// built from the workflow animations (01–04) placed by a camera on the
// chapter's gradient, with a headline on the left.
export const Launch: React.FC = () => {
  useState(loadDiatype);
  return (
    <AbsoluteFill
      style={{ fontFamily: FONT.sans, color: C.ink, overflow: "hidden" }}
    >
      <style>{"*{box-sizing:border-box;}"}</style>
      <Background />
      <Intro />
      <Prep />
      <Planning />
      <CaptureChapter />
      <Materials />
      <FollowUp />
      <Close />
      <LaunchCursor />
      <Sfx />
    </AbsoluteFill>
  );
};
