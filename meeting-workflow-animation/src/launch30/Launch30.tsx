import { Audio } from "@remotion/media";
import React, { useState } from "react";
import { AbsoluteFill, staticFile } from "remotion";
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

// Savvy Intelligence launch video, 30 s (1920×1080, 60 fps): one client
// meeting followed through Prep → Meet → Deliver, built from the storyboard
// frames (src/launch30/frames/). Beats in timeline.ts.
//
// The voiceover is Jeremy B. (ElevenLabs v4), already timed to the beats and
// loudness-normalized to −16 LUFS; it plays at half level against the sound
// effects, and the export adds 6 dB with a limiter on top.
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
      <Audio src={staticFile("audio/launch30/vo-jeremy.mp3")} volume={0.5} />
    </AbsoluteFill>
  );
};
