import React from "react";
import { CursorLayer } from "../shared/components/CursorLayer";
import { CURSOR_SCALE } from "./components/Bits";
import { KNOB, knobAt } from "./frames/Communicate";
import { SEND_BTN } from "./frames/Deliver";
import { AGENDA_ITEM, REVIEW_BTN } from "./frames/Prep";
import { L } from "./timeline";

// On "Retirement plan", agenda item 3.
const PLAN = { x: AGENDA_ITEM.x + 120, y: AGENDA_ITEM.y + AGENDA_ITEM.h / 2 + 2 };
const GRAB = knobAt(KNOB.from);
const DROP = knobAt(KNOB.to);

// Only where the advisor acts: Review prep, Retirement plan, the what-if drag,
// Send. The drag
// uses the slider's own easing over the same window, so the fingertip stays
// on the knob.
export const Launch30Cursor: React.FC = () => (
  <CursorLayer
    scale={CURSOR_SCALE}
    path={[
      { t: 4.9, x: 1500, y: 1000 },
      { t: 5.55, ...REVIEW_BTN },
      { t: 5.95, ...REVIEW_BTN, ease: "linear" },
      { t: 6.35, x: REVIEW_BTN.x + 80, y: REVIEW_BTN.y + 130 },
      { t: 7.9, x: 1520, y: 1000, ease: "linear" },
      { t: L.planClick - 0.2, ...PLAN },
      { t: L.planClick + 0.35, ...PLAN, ease: "linear" },
      { t: 9.3, x: PLAN.x - 60, y: PLAN.y + 140 },
      { t: 12.1, x: 1320, y: 1000, ease: "linear" },
      { t: L.drag[0] - 0.2, ...GRAB },
      { t: L.drag[0], ...GRAB, ease: "linear" },
      { t: L.drag[1], ...DROP },
      { t: L.drag[1] + 0.2, ...DROP, ease: "linear" },
      { t: 14.25, x: DROP.x + 110, y: DROP.y + 150 },
      { t: 21.4, x: 1520, y: 1010, ease: "linear" },
      { t: L.sendClick - 0.2, ...SEND_BTN },
      { t: L.sendClick + 0.15, ...SEND_BTN, ease: "linear" },
      { t: 22.75, x: SEND_BTN.x + 60, y: SEND_BTN.y + 90 },
    ]}
    opacity={[
      [4.9, 0],
      [5.05, 1],
      [6.15, 1],
      [6.35, 0],
      [7.9, 0],
      [8.05, 1],
      [9.05, 1],
      [9.25, 0],
      [12.1, 0],
      [12.25, 1],
      [14.05, 1],
      [14.25, 0],
      [21.4, 0],
      [21.55, 1],
      [22.55, 1],
      [22.75, 0],
    ]}
    clicks={[
      { at: L.reviewClick, ...REVIEW_BTN },
      { at: L.planClick, ...PLAN },
      { at: L.sendClick, ...SEND_BTN },
    ]}
    hand={[
      [5.3, 6.35],
      [8.2, 9.25],
      [12.45, 14.25],
      [21.75, 22.75],
    ]}
    holds={[[L.drag[0] - 0.05, L.drag[1] + 0.05]]}
  />
);
