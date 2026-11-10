import { Audio } from "@remotion/media";
import React, { useState } from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadDiatype } from "../launch/fonts";
import { LiveBackground, LiveTracker } from "./components/Live";
import { Launch30Cursor } from "./Cursor";
import { musicVolume } from "./Music";
import { shiftAt } from "./Peek";
import { PeekContext } from "./peek";
import { CloseScene } from "./scenes/Close";
import { CommunicateScene } from "./scenes/Communicate";
import { DeliverScene } from "./scenes/Deliver";
import { Intro } from "./scenes/Intro";
import { PrepScene } from "./scenes/Prep";
import { Launch30Sfx } from "./Sfx";
import { C, FONT } from "./theme";
import { PEEK_TIMELINE, Timeline, TIMELINE, TimelineContext, useT } from "./timeline";

// The 15 s and 6 s cutdowns of Launch30 (1920×1080, 60 fps). Each plays
// stretches of the 30 s scenes (its beats, its sound effects) one after
// another, crossfading between them, then its own close on the voiceover:
// "Prep. Meet. Deliver." and "And so much more.", then the logo, with no
// tagline. Each has its own edit of the music (scripts/
// launch30-cutdowns-audio.sh) with the final hit on the logo.
//   15 s: prep (card, review, the prep document), the plan lifted into the
//         meeting and its what-if, the recap; three voiceover lines, then the
//         close at the 30 s video's pace.
//   6 s:  three quick snaps of the product, text-free as in the sneak peek
//         (the prep document, the what-if, the recap), then the close with the
//         pauses between the words tightened.

type Vo = { readonly src: string; readonly at: number; readonly len: number };
// A stretch of a source (`src` s in, `len` long) at `at` s, fading in over
// `fade` s on top of what's before it.
type Seg = { readonly kind: "story" | "peek" | "close"; readonly at: number; readonly src: number; readonly len: number; readonly fade: number };
type Close = { readonly src: string; readonly at: number; readonly said: readonly number[]; readonly len: number; readonly logoIn: number };
type Cut = { readonly end: number; readonly segs: readonly Seg[]; readonly vo: readonly Vo[]; readonly close: Close; readonly music: string };

const LEAD = 0.1; // the close's words arrive this long before they're said (as in the 30 s)
const PAD = 0.06; // silence at the end of each voiceover file

export const CUTS: Record<"15s" | "6s", Cut> = {
  "15s": {
    end: 15,
    segs: [
      { kind: "story", at: 0, src: 6.15, len: 7.7, fade: 0 }, // prep card → document → the plan presented, what-if
      { kind: "story", at: 7.4, src: 18.85, len: 1.95, fade: 0.3 }, // the recap
      { kind: "close", at: 9.05, src: 9.05, len: 5.95, fade: 0.3 },
    ],
    vo: [
      { src: "02-prep", at: 0.3, len: 2.75 }, // "Your agenda is prepped before you even ask."
      { src: "03-meet", at: 4.0, len: 2.64 }, // "Present and adjust plans live in the meeting." (as the plan lifts)
      { src: "05-deliver-first", at: 7.0, len: 2.565 }, // "Afterwards, your recap is ready to send."
    ],
    // "Prep, meet, deliver, and so much more."
    close: { src: "06-close", at: 9.85, said: [0.06, 0.72, 1.39, 2.09], len: 3.38, logoIn: 13.27 },
    music: "music-slaptastic-15",
  },
  "6s": {
    end: 6,
    segs: [
      { kind: "peek", at: 0, src: 6.0, len: 0.65, fade: 0 }, // the prep document filling in
      { kind: "peek", at: 0.5, src: 12.3, len: 0.65, fade: 0.15 }, // the what-if, dragged
      { kind: "peek", at: 1.0, src: 17.9, len: 0.7, fade: 0.15 }, // the recap's tasks
      { kind: "close", at: 1.55, src: 1.55, len: 4.45, fade: 0.15 },
    ],
    vo: [],
    // the same line with ~60 ms between the words
    close: { src: "06-close-tight", at: 1.84, said: [0.06, 0.564, 1.105, 1.75], len: 2.95, logoIn: 4.85 },
    music: "music-slaptastic-6",
  },
};

// The close's beats on a timeline where nothing else happens (every other beat
// pushed past the end), on the blue background, with no tracker or tagline.
const NEVER = 999;
const closeTimeline = (cut: Cut): Timeline => {
  const off = Object.fromEntries(
    Object.entries(TIMELINE).map(([k, v]) => [k, typeof v === "number" ? NEVER : Array.isArray(v) ? v.map((x) => (typeof x === "number" ? NEVER : [NEVER, NEVER])) : v]),
  );
  const { at, said, len, logoIn } = cut.close;
  const w = (i: number) => at + said[i] - LEAD;
  return {
    ...(off as unknown as Timeline),
    sweep1: [-2, -1],
    sweep2: [-2, -1],
    words: [w(0), w(1), w(2)],
    more: w(3),
    wordsOut: Math.min(at + len - PAD, logoIn - 0.25), // leaves as the line ends (and before the logo)
    tagline: [NEVER, NEVER],
    taglineOut: NEVER,
    logoIn,
    end: cut.end,
    vo: [],
  };
};

// The 30 s story as is, and the sneak peek's text-free version.
const Story: React.FC = () => (
  <TimelineContext.Provider value={TIMELINE}>
    <LiveBackground />
    <PrepScene />
    <CommunicateScene />
    <DeliverScene />
    <Intro />
    <LiveTracker />
    <Launch30Cursor />
    <Launch30Sfx />
  </TimelineContext.Provider>
);
const PeekStory: React.FC = () => {
  const t = useT();
  return (
    <TimelineContext.Provider value={PEEK_TIMELINE}>
      <PeekContext.Provider value>
        <LiveBackground />
        <AbsoluteFill style={{ translate: `${-shiftAt(PEEK_TIMELINE, t)}px 0px` }}>
          <PrepScene />
          <CommunicateScene />
          <DeliverScene />
          <Intro />
          <Launch30Cursor />
        </AbsoluteFill>
      </PeekContext.Provider>
    </TimelineContext.Provider>
  );
};
const CloseStory: React.FC<{ readonly L: Timeline }> = ({ L }) => (
  <TimelineContext.Provider value={L}>
    <LiveBackground />
    <CloseScene />
    <Launch30Sfx />
  </TimelineContext.Provider>
);

const FadeIn: React.FC<{ readonly frames: number; readonly children: React.ReactNode }> = ({ frames, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: frames ? interpolate(f, [0, frames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1 }}>{children}</AbsoluteFill>;
};

const Segment: React.FC<{ readonly seg: Seg; readonly close: Timeline }> = ({ seg, close }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence name={`${seg.kind} ${seg.src}s`} from={Math.round(seg.at * fps)} durationInFrames={Math.round(seg.len * fps)}>
      <FadeIn frames={Math.round(seg.fade * fps)}>
        <Sequence from={-Math.round(seg.src * fps)}>{seg.kind === "story" ? <Story /> : seg.kind === "peek" ? <PeekStory /> : <CloseStory L={close} />}</Sequence>
      </FadeIn>
    </Sequence>
  );
};

export const Launch30Cut: React.FC<{ readonly cut: "15s" | "6s" }> = ({ cut }) => {
  useState(loadDiatype);
  const { fps } = useVideoConfig();
  const c = CUTS[cut];
  const close = closeTimeline(c);
  const vo: Vo[] = [...c.vo, { src: c.close.src, at: c.close.at, len: c.close.len }];
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.ink, overflow: "hidden" }}>
      <style>{"*{box-sizing:border-box;}"}</style>
      {c.segs.map((seg) => (
        <Segment key={`${seg.kind}${seg.at}`} seg={seg} close={close} />
      ))}
      {vo.map(({ src, at, len }) => (
        <Sequence key={src} name={`vo ${src}`} from={Math.round(at * fps)} durationInFrames={Math.ceil(len * fps)} layout="none">
          <Audio src={staticFile(`audio/launch30/vo/${src}.mp3`)} volume={0.5} />
        </Sequence>
      ))}
      <Audio src={staticFile(`audio/launch30/${c.music}.mp3`)} volume={(f) => musicVolume({ vo, end: c.end }, f / fps)} />
    </AbsoluteFill>
  );
};
export const cutFrames = (cut: "15s" | "6s", fps = 60) => Math.round(CUTS[cut].end * fps);
