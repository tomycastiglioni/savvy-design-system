import React from "react";
import { CursorKey, CursorLayer } from "../shared/components/CursorLayer";
import { SLIDERS } from "../delivery/whatif";
import { SEND_POINT } from "./scenes/FollowUp";
import { MIC_CENTER, REVIEW_BTN } from "./scenes/Intro";
import {
  CREATE_POINT,
  DRAFT_POINT,
  GRAPH_POINT,
  SERIF_POINT,
} from "./scenes/Materials";
import {
  ADD_POINT,
  knobPoint,
  PLAN_DRAGS,
  PRESENT_POINT,
} from "./scenes/Planning";
import { CURSOR_SCALE } from "./theme";
import { L } from "./timeline";

const REVIEW = {
  x: REVIEW_BTN.x + REVIEW_BTN.w / 2,
  y: REVIEW_BTN.y + REVIEW_BTN.h / 2 + 2,
};

// Arrive at a target, rest on it through the click, then move on.
const click = (
  at: number,
  p: { x: number; y: number },
  arrive = 0.15,
  leave = 0.15,
): CursorKey[] => [
  { t: at - arrive, ...p },
  { t: at + leave, ...p, ease: "linear" },
];

// Drags follow the knob with the slider's own easing.
const drags = (): CursorKey[] =>
  PLAN_DRAGS.flatMap((d) => {
    const from = knobPoint(d.slider, SLIDERS[d.slider].p0);
    const to = knobPoint(d.slider, d.to);
    return [
      { t: d.start - 0.1, ...from },
      { t: d.start, ...from, ease: "linear" },
      { t: d.end, ...to },
      { t: d.end + 0.1, ...to, ease: "linear" },
    ] satisfies CursorKey[];
  });

// One cursor for the whole video, shown only around its clicks and drags.
export const LaunchCursor: React.FC = () => (
  <CursorLayer
    scale={CURSOR_SCALE}
    path={[
      { t: 3.35, x: 1700, y: 900 },
      ...click(L.micClick, MIC_CENTER, 0.12),
      { t: 4.65, x: 1650, y: 780 },
      { t: 6.75, x: 760, y: 600, ease: "linear" },
      ...click(L.reviewClick, REVIEW),
      { t: 12.75, x: 1560, y: 900, ease: "linear" },
      ...click(L.addClick, ADD_POINT),
      ...click(L.presentClick, PRESENT_POINT),
      { t: 15.4, x: 1560, y: 520 },
      { t: 17.0, x: 330, y: 1010, ease: "linear" },
      ...drags(),
      { t: 19.6, x: 470, y: 960 },
      { t: 29.6, x: 1560, y: 520, ease: "linear" },
      ...click(L.createClick, CREATE_POINT),
      ...click(L.createClick + 1.45, GRAPH_POINT),
      ...click(L.createClick + 2.35, SERIF_POINT),
      ...click(L.draftClick, DRAFT_POINT),
      { t: 33.85, x: 1060, y: 960 },
      { t: 37.9, x: 1500, y: 1040, ease: "linear" },
      ...click(L.sendClick, SEND_POINT),
      { t: 39.0, x: SEND_POINT.x + 50, y: SEND_POINT.y + 60 },
    ]}
    opacity={[
      [3.35, 0],
      [3.5, 1],
      [4.45, 1],
      [4.65, 0],
      [6.75, 0],
      [6.9, 1],
      [7.7, 1],
      [7.9, 0],
      [12.75, 0],
      [12.9, 1],
      [15.15, 1],
      [15.35, 0],
      [17.0, 0],
      [17.15, 1],
      [19.4, 1],
      [19.6, 0],
      [29.6, 0],
      [29.75, 1],
      [33.6, 1],
      [33.8, 0],
      [37.9, 0],
      [38.05, 1],
      [38.75, 1],
      [38.95, 0],
    ]}
    clicks={[
      { at: L.micClick, ...MIC_CENTER },
      { at: L.reviewClick, ...REVIEW },
      { at: L.addClick, ...ADD_POINT },
      { at: L.presentClick, ...PRESENT_POINT },
      { at: L.createClick, ...CREATE_POINT },
      { at: L.createClick + 1.45, ...GRAPH_POINT },
      { at: L.createClick + 2.35, ...SERIF_POINT },
      { at: L.draftClick, ...DRAFT_POINT },
      { at: L.sendClick, ...SEND_POINT },
    ]}
    hand={[
      [3.75, 4.3],
      [7.25, 7.9],
      [13.25, 13.75],
      [14.75, 15.35],
      [17.3, 19.45],
      [30.0, 30.5],
      [31.45, 31.95],
      [32.35, 32.85],
      [33.2, 33.8],
      [38.3, 38.95],
    ]}
    holds={PLAN_DRAGS.map((d) => [d.start - 0.05, d.end + 0.05] as const)}
  />
);
