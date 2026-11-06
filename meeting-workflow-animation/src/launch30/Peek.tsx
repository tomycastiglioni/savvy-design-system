import React, { useState } from "react";
import { AbsoluteFill } from "remotion";
import { loadDiatype } from "../launch/fonts";
import { LiveBackground } from "./components/Live";
import { ramp } from "./components/Motion";
import { Launch30Cursor } from "./Cursor";
import { PeekContext } from "./peek";
import { CommunicateScene } from "./scenes/Communicate";
import { DeliverScene } from "./scenes/Deliver";
import { Intro } from "./scenes/Intro";
import { PrepScene } from "./scenes/Prep";
import { C, EASE_MORPH, FONT } from "./theme";
import { PEEK_TIMELINE as L, TimelineContext, useT } from "./timeline";

// Sneak peek of Launch30 for the website: the same scenes with no text (no
// opening line, headlines or client question), no tracker and no sound, and
// the product UI centred. Without the headline column, the UI layer slides
// left by how far right of centre the current card sits, eased with the
// transition that brings each card in. Render from 0:02 (frame 120); the loop
// edits are made from that render (see README).
//
// How far right of the frame's centre each stage of the UI sits (px):
// client list 0, prep card and document 350, presentation 410, capture (CRM
// profile + phone) 278, phone close-up 0, recap 350.
const SHIFTS: readonly (readonly [readonly [number, number], number])[] = [
  [L.pickMorph, 350],
  [L.lift, 410],
  [L.stepBack, 278],
  [L.closeUp, 0],
  [L.toRecap, 350],
];
const shiftAt = (t: number) => SHIFTS.reduce((dx, [[a, b], to]) => dx + (to - dx) * ramp(t, a, b, EASE_MORPH), 0);

export const Launch30Peek: React.FC = () => {
  useState(loadDiatype);
  const t = useT();
  return (
    <TimelineContext.Provider value={L}>
    <PeekContext.Provider value>
      <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.ink, overflow: "hidden" }}>
        <style>{"*{box-sizing:border-box;}"}</style>
        <LiveBackground />
        <AbsoluteFill style={{ translate: `${-shiftAt(t)}px 0px` }}>
          <PrepScene />
          <CommunicateScene />
          <DeliverScene />
          <Intro />
          <Launch30Cursor />
        </AbsoluteFill>
      </AbsoluteFill>
    </PeekContext.Provider>
    </TimelineContext.Provider>
  );
};
