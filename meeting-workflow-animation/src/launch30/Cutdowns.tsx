import { Audio } from "@remotion/media";
import React, { useState } from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Logo } from "../launch/components/Logo";
import { loadDiatype } from "../launch/fonts";
import { LiveBackground, LiveTracker } from "./components/Live";
import { Launch30Cursor } from "./Cursor";
import { Card, CenteredLine } from "./components/Bits";
import { ramp, slideText } from "./components/Motion";
import { PresentationContent } from "./frames/Communicate";
import { END_LOGO, END_LOGO_H } from "./frames/Bookends";
import { SentBannerContent } from "./frames/Deliver";
import { PrepCardContent } from "./frames/Prep";
import { musicVolume } from "./Music";
import { CloseScene } from "./scenes/Close";
import { CommunicateScene } from "./scenes/Communicate";
import { DeliverScene } from "./scenes/Deliver";
import { Intro } from "./scenes/Intro";
import { PrepScene } from "./scenes/Prep";
import { Launch30Sfx } from "./Sfx";
import { C, EASE_IN_OUT, FONT } from "./theme";
import { Timeline, TIMELINE, TimelineContext, useT } from "./timeline";

// The 15 s and 6 s cutdowns of Launch30 (1920×1080, 60 fps), each with its own
// edit of the music (scripts/launch30-cutdowns-audio.sh), its final hit on
// the logo, and no tagline.
//   15 s: stretches of the 30 s scenes (their beats, their sound effects) one
//         after another, crossfading: prep (card, review, the prep document),
//         the plan lifted into the meeting and its what-if, the recap; three
//         voiceover lines; then the close on the voiceover ("Prep. Meet.
//         Deliver." / "And so much more.") at the 30 s pace, and the logo.
//   6 s:  three beats, each its word on top and one simple card under it, as
//         the word is said: "Prep." and the prep-ready card, "Meet." and the
//         retirement plan (its line rising with the what-if), "Deliver." and
//         "Email sent"; "and so much more" is only said; then the logo.

type Vo = { readonly src: string; readonly at: number; readonly len: number };
// A stretch of a source (`src` s in, `len` long) at `at` s, fading in over
// `fade` s on top of what's before it.
type Seg = { readonly kind: "story" | "close"; readonly at: number; readonly src: number; readonly len: number; readonly fade: number };
type Close = { readonly src: string; readonly at: number; readonly said: readonly number[]; readonly len: number; readonly logoIn: number };
type Cut = { readonly end: number; readonly segs: readonly Seg[]; readonly vo: readonly Vo[]; readonly close: Close; readonly music: string };

const LEAD = 0.1; // the close's words arrive this long before they're said (as in the 30 s)
const PAD = 0.06; // silence at the end of each voiceover file

export const CUTS: Record<"15s", Cut> = {
  "15s": {
    end: 14.9, // just under 15 s: YouTube caps non-skippable in-stream ads at 15 s
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
};

// A timeline where nothing happens (every beat pushed past the end) but what
// `o` sets: the cutdowns' closes, and the 6 s cut's backgrounds and logo.
const NEVER = 999;
const quiet = (o: Partial<Timeline>): Timeline => {
  const off = Object.fromEntries(
    Object.entries(TIMELINE).map(([k, v]) => [k, typeof v === "number" ? NEVER : Array.isArray(v) ? v.map((x) => (typeof x === "number" ? NEVER : [NEVER, NEVER])) : v]),
  );
  return { ...(off as unknown as Timeline), vo: [], ...o };
};
// The close's beats, on the blue background, with no tracker or tagline.
const closeTimeline = (cut: Cut): Timeline => {
  const { at, said, len, logoIn } = cut.close;
  const w = (i: number) => at + said[i] - LEAD;
  return quiet({
    sweep1: [-2, -1],
    sweep2: [-2, -1],
    words: [w(0), w(1), w(2)],
    more: w(3),
    wordsOut: Math.min(at + len - PAD, logoIn - 0.25), // leaves as the line ends (and before the logo)
    logoIn,
    end: cut.end,
  });
};

// The 30 s story as is.
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
        <Sequence from={-Math.round(seg.src * fps)}>{seg.kind === "story" ? <Story /> : <CloseStory L={close} />}</Sequence>
      </FadeIn>
    </Sequence>
  );
};

export const Launch30Cut: React.FC<{ readonly cut: "15s" }> = ({ cut }) => {
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

// —— 6 s ——
const SIX_END = 5.9; // just under 6 s: YouTube rejects a bumper over 6 s
const WORD_SIZE = 100;
const WORD_TO_CARD = 150; // the word's cap top → the card's top
// Each beat's word and card are centred together on the frame.
type Beat = {
  readonly word: string;
  readonly in: number;
  readonly out: number;
  readonly card: { readonly w: number; readonly h: number; readonly s: number; readonly Content: React.FC<{ readonly t: number }> };
};
const BEATS: readonly Beat[] = [
  // the prep, waiting before the advisor asks
  { word: "Prep.", in: 0.15, out: 1.35, card: { w: 700, h: 300, s: 1.45, Content: () => <PrepCardContent /> } },
  // the plan presented (title, chart and its value; the sliders cropped off),
  // its line rising with the what-if
  { word: "Meet.", in: 1.55, out: 2.8, card: { w: 780, h: 466, s: 1.3, Content: ({ t }) => <PresentationContent drag={ramp(t, 2.0, 2.6, EASE_IN_OUT)} /> } },
  // the follow-up sent, its check drawing in
  { word: "Deliver.", in: 3.0, out: 4.4, card: { w: 700, h: 170, s: 1.55, Content: ({ t }) => <SentBannerContent draw={ramp(t, 3.2, 3.6)} /> } },
];
// "Prep," "meet," "deliver," as each word lands, then "and so much more."
// (parts of the close line; the first sound of each is `said` in)
const SIX_VO = [
  { src: "06a-prep", said: 0.063, word: 0 },
  { src: "06b-meet", said: 0.03, word: 1 },
  { src: "06c-deliver", said: 0.03, word: 2 },
].map(({ src, said, word }) => ({ src, at: BEATS[word].in + LEAD - said, len: 0.6 }));
const SIX_VO_ALL: Vo[] = [...SIX_VO, { src: "06d-more", at: 3.75, len: 1.25 }];
const SIX_LOGO = 4.7; // on the music's final hit
const SIX_L = quiet({ sweep1: [1.3, 1.8], sweep2: [2.75, 3.25], end: SIX_END });

const SixBeat: React.FC<{ readonly beat: Beat }> = ({ beat }) => {
  const t = useT();
  const enter = ramp(t, beat.in - 0.05, beat.in + 0.4);
  const leave = ramp(t, beat.out, beat.out + 0.3, EASE_IN_OUT);
  if (t < beat.in - 0.05 || leave >= 1) return null;
  const { w, h, s, Content } = beat.card;
  const cap = 540 - (WORD_TO_CARD + h * s) / 2;
  return (
    <>
      <CenteredLine capTop={cap} size={WORD_SIZE}>
        <span style={slideText(t, beat.in, beat.out)}>{beat.word}</span>
      </CenteredLine>
      <div
        style={{
          position: "absolute",
          left: 960 - (w * s) / 2,
          top: cap + WORD_TO_CARD,
          width: w,
          height: h,
          scale: s,
          transformOrigin: "0 0",
          opacity: enter * (1 - leave),
          translate: `0px ${(1 - enter) * 44 - leave * 26}px`,
        }}
      >
        <Card style={{ left: 0, top: 0, width: w, height: h }}>
          <Content t={t} />
        </Card>
      </div>
    </>
  );
};

// The wordmark, as the 30 s close brings it in (out of a blur).
const SixLogo: React.FC = () => {
  const t = useT();
  const logo = ramp(t, SIX_LOGO, SIX_LOGO + 0.6); // quicker than the 30 s, so it holds before the end
  if (logo <= 0) return null;
  return (
    <div style={{ position: "absolute", left: END_LOGO.x, top: END_LOGO.y, opacity: logo, scale: 0.96 + 0.04 * logo, filter: logo < 1 ? `blur(${(1 - logo) * 8}px)` : undefined }}>
      <Logo h={END_LOGO_H} />
    </div>
  );
};

export const Launch30Six: React.FC = () => {
  useState(loadDiatype);
  const { fps } = useVideoConfig();
  const sfx = [...BEATS.map((b) => ({ src: "launch30/swish", at: b.in - 0.05, volume: 0.1, dur: 0.6 })), { src: "launch/success", at: 3.2, volume: 0.08, dur: 1.6 }];
  return (
    <TimelineContext.Provider value={SIX_L}>
      <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.ink, overflow: "hidden" }}>
        <style>{"*{box-sizing:border-box;}"}</style>
        <LiveBackground />
        {BEATS.map((b) => (
          <SixBeat key={b.word} beat={b} />
        ))}
        <SixLogo />
        {SIX_VO_ALL.map(({ src, at, len }) => (
          <Sequence key={src} name={`vo ${src}`} from={Math.round(at * fps)} durationInFrames={Math.ceil(len * fps)} layout="none">
            <Audio src={staticFile(`audio/launch30/vo/${src}.mp3`)} volume={0.5} />
          </Sequence>
        ))}
        {sfx.map((x, i) => (
          <Sequence key={i} name={`sfx ${x.src}`} from={Math.round(x.at * fps)} durationInFrames={Math.ceil(x.dur * fps)} layout="none">
            <Audio src={staticFile(`audio/${x.src}.mp3`)} volume={x.volume} />
          </Sequence>
        ))}
        <Audio src={staticFile("audio/launch30/music-slaptastic-6.mp3")} volume={(f) => musicVolume({ vo: SIX_VO_ALL, end: SIX_END }, f / fps)} />
      </AbsoluteFill>
    </TimelineContext.Provider>
  );
};

export const cutFrames = (cut: "15s" | "6s", fps = 60) => Math.round((cut === "6s" ? SIX_END : CUTS[cut].end) * fps);
