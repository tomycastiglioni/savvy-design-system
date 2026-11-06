import { Audio } from "@remotion/media";
import React, { useState } from "react";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { loadDiatype } from "../launch/fonts";
import { LiveBackground, LiveTracker } from "./components/Live";
import { Launch30Cursor } from "./Cursor";
import { CloseScene } from "./scenes/Close";
import { CommunicateScene } from "./scenes/Communicate";
import { DeliverScene } from "./scenes/Deliver";
import { Intro } from "./scenes/Intro";
import { PrepScene } from "./scenes/Prep";
import { Launch30Music } from "./Music";
import { Launch30Sfx } from "./Sfx";
import { C, FONT } from "./theme";
import { TIMELINE, TimelineContext, useL } from "./timeline";

// Savvy Intelligence launch video (1920×1080, 60 fps): one client meeting
// followed through Prep → Meet → Deliver, built from the storyboard frames
// (src/launch30/frames/). 32.4 s; beats in timeline.ts.
//
// The voiceover is Jeremy B. (ElevenLabs v4), one file per line, placed by the
// timeline and level-matched at −16 LUFS; it plays at half level against the
// sound effects, and the music (Music.tsx) dips under it. The export adds 4 dB
// with a limiter on top.
const Voiceover: React.FC = () => {
  const L = useL();
  const { fps } = useVideoConfig();
  return (
    <>
      {L.vo.map(({ src, at, len }) => (
        <Sequence key={src} name={`vo ${src}`} from={Math.round(at * fps)} durationInFrames={Math.ceil(len * fps)} layout="none">
          <Audio src={staticFile(`audio/launch30/vo/${src}.mp3`)} volume={0.5} />
        </Sequence>
      ))}
    </>
  );
};

export const Launch30: React.FC = () => {
  useState(loadDiatype);
  return (
    <TimelineContext.Provider value={TIMELINE}>
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
        <Launch30Music />
        <Launch30Sfx />
        <Voiceover />
      </AbsoluteFill>
    </TimelineContext.Provider>
  );
};
