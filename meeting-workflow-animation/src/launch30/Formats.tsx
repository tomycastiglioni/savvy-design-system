import React, { useState } from "react";
import { AbsoluteFill } from "remotion";
import { loadDiatype } from "../launch/fonts";
import { LiveBackground, LiveTracker } from "./components/Live";
import { lerp, ramp } from "./components/Motion";
import { Launch30Cursor } from "./Cursor";
import { Voiceover } from "./Launch30";
import { Launch30Music } from "./Music";
import { PeekContext } from "./peek";
import { shiftAt } from "./Peek";
import { CloseScene } from "./scenes/Close";
import { CommunicateScene } from "./scenes/Communicate";
import { DeliverScene } from "./scenes/Deliver";
import { Intro } from "./scenes/Intro";
import { PrepScene } from "./scenes/Prep";
import { Launch30Sfx } from "./Sfx";
import { C, EASE_MORPH, FONT } from "./theme";
import { TIMELINE, TimelineContext, useL, useT } from "./timeline";

// Launch30 resized for 4:5, 1:1 and 9:16 (1080 wide), same timing and sound.
// The 16:9 picture (the "stage", 1920×1080) is drawn in layers, each placed
// on the frame on its own:
//   UI      the product UI only, centred as in the sneak peek (Peek.tsx), in
//           the lower part of the frame; its bottom edge fades out, so the
//           phone and the email still rise in from out of view and the phone
//           close-up runs off softly
//   copy    each phase's headline (and the client's question) top left, on
//           the 75 px margin
//   intro   the opening title and the client list, together as one page,
//           centred; the list then moves down into the UI's place as the
//           client is picked
//   close   "Prep. Meet. Deliver.", the tagline and the logo, centred
//   tracker top centre

export type Format = "4x5" | "1x1" | "9x16";
// A stage point `from` lands on the frame at `to`, scaled by `s`.
type Place = { readonly s: number; readonly from: readonly [number, number]; readonly to: readonly [number, number] };
type Spec = { readonly w: number; readonly h: number; readonly intro: Place; readonly ui: Place; readonly copy: Place; readonly close: Place; readonly tracker: Place };

const MARGIN = 75;
const HEADLINE_X = 174; // the headlines' left edge on the stage
export const FORMATS: Record<Format, Spec> = {
  "4x5": {
    w: 1080,
    h: 1350,
    intro: { s: 0.95, from: [960, 570], to: [540, 675] },
    ui: { s: 0.9, from: [960, 540], to: [540, 860] },
    copy: { s: 0.95, from: [HEADLINE_X, 540], to: [MARGIN, 320] },
    close: { s: 1.05, from: [960, 540], to: [540, 675] },
    tracker: { s: 0.95, from: [960, 0], to: [540, 20] },
  },
  "1x1": {
    w: 1080,
    h: 1080,
    intro: { s: 0.85, from: [960, 570], to: [540, 540] },
    ui: { s: 0.72, from: [960, 540], to: [540, 690] },
    copy: { s: 0.8, from: [HEADLINE_X, 540], to: [MARGIN, 250] },
    close: { s: 1, from: [960, 540], to: [540, 540] },
    tracker: { s: 0.8, from: [960, 0], to: [540, 8] },
  },
  "9x16": {
    w: 1080,
    h: 1920,
    intro: { s: 1, from: [960, 570], to: [540, 960] },
    ui: { s: 1.1, from: [960, 540], to: [540, 1180] },
    copy: { s: 1.1, from: [HEADLINE_X, 540], to: [MARGIN, 560] },
    close: { s: 1.15, from: [960, 540], to: [540, 960] },
    tracker: { s: 1.15, from: [960, 0], to: [540, 175] },
  },
};

// translate + scale for a placement, so two can be blended
const toXY = (p: Place) => ({ s: p.s, x: p.to[0] - p.from[0] * p.s, y: p.to[1] - p.from[1] * p.s });
const blend = (a: Place, b: Place, k: number) => {
  const [p, q] = [toXY(a), toXY(b)];
  return { s: lerp(p.s, q.s, k), x: lerp(p.x, q.x, k), y: lerp(p.y, q.y, k) };
};
const FEATHER = 130; // the UI layer's soft bottom edge, frame px
const Stage: React.FC<{ readonly at: { s: number; x: number; y: number }; readonly style?: React.CSSProperties; readonly children: React.ReactNode }> = ({ at, style, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${at.x}px, ${at.y}px) scale(${at.s})`, ...style }}>
    {children}
  </div>
);

const Layers: React.FC<{ readonly format: Format }> = ({ format }) => {
  const L = useL();
  const t = useT();
  const f = FORMATS[format];
  // The UI moves from the intro page to its own place as the client is picked.
  const ui = blend(f.intro, f.ui, ramp(t, ...L.pickMorph, EASE_MORPH));
  const feather = FEATHER / ui.s;
  // The copy changes place only while none is on screen: after the title has
  // gone, and after the Deliver headline has.
  const copy = toXY(t < L.pickClick ? f.intro : f.copy);
  return (
    <>
      <LiveBackground />
      <Stage at={ui} style={{ maskImage: `linear-gradient(to bottom, #000 calc(100% - ${feather}px), transparent 100%)` }}>
        <PeekContext.Provider value>
          <AbsoluteFill style={{ translate: `${-shiftAt(L, t)}px 0px` }}>
            <PrepScene />
            <CommunicateScene />
            <DeliverScene />
            <Intro />
            <Launch30Cursor />
          </AbsoluteFill>
        </PeekContext.Provider>
      </Stage>
      {t < L.deliverOut + 0.42 ? (
        // Every scene again with only its text showing (the text pieces set
        // themselves visible).
        <Stage at={copy} style={{ visibility: "hidden" }}>
          <PrepScene />
          <CommunicateScene />
          <DeliverScene />
          <Intro />
        </Stage>
      ) : (
        <Stage at={toXY(f.close)}>
          <CloseScene />
        </Stage>
      )}
      <Stage at={toXY(f.tracker)}>
        <LiveTracker />
      </Stage>
    </>
  );
};

export const Launch30Format: React.FC<{ readonly format: Format }> = ({ format }) => {
  useState(loadDiatype);
  return (
    <TimelineContext.Provider value={TIMELINE}>
      <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.ink, overflow: "hidden" }}>
        <style>{"*{box-sizing:border-box;}"}</style>
        <Layers format={format} />
        <Launch30Music />
        <Launch30Sfx />
        <Voiceover />
      </AbsoluteFill>
    </TimelineContext.Provider>
  );
};
