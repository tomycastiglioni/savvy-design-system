import React from "react";
import { CursorLayer } from "../shared/components/CursorLayer";
import { CURSOR_SCALE } from "./components/Bits";
import { LIST_SCROLL, pickPoint } from "./frames/Clients";
import { KNOB, knobAt } from "./frames/Communicate";
import { SEND_BTN } from "./frames/Deliver";
import { AGENDA_ITEM, REVIEW_BTN } from "./frames/Prep";
import { useL } from "./timeline";

// On Allison & Frank Marlowe's row once the list has scrolled.
const PICK = pickPoint(LIST_SCROLL);
// On "Retirement plan", agenda item 3.
const PLAN = { x: AGENDA_ITEM.x + 120, y: AGENDA_ITEM.y + AGENDA_ITEM.h / 2 + 2 };
const GRAB = knobAt(KNOB.from);
const DROP = knobAt(KNOB.to);

// Only where the advisor acts: picking the client, Review prep, Retirement
// plan, the what-if drag, Send. Each visit is timed from its click. The drag
// uses the slider's own easing over the same window, so the fingertip stays
// on the knob.
export const Launch30Cursor: React.FC = () => {
  const L = useL();
  return (
  <CursorLayer
    scale={CURSOR_SCALE}
    path={[
      { t: L.listScroll[0] + 0.3, x: 1560, y: 1010 },
      { t: L.pickClick - 0.15, ...PICK },
      { t: L.pickClick + 0.1, ...PICK, ease: "linear" },
      { t: L.pickMorph[0] + 0.3, x: PICK.x + 70, y: PICK.y + 110 },
      { t: L.reviewClick - 0.85, x: 1500, y: 1000 },
      { t: L.reviewClick - 0.2, ...REVIEW_BTN },
      { t: L.reviewClick + 0.2, ...REVIEW_BTN, ease: "linear" },
      { t: L.reviewClick + 0.6, x: REVIEW_BTN.x + 80, y: REVIEW_BTN.y + 130 },
      { t: L.planClick - 0.7, x: 1520, y: 1000, ease: "linear" },
      { t: L.planClick - 0.2, ...PLAN },
      { t: L.planClick + 0.35, ...PLAN, ease: "linear" },
      { t: L.planClick + 0.7, x: PLAN.x - 60, y: PLAN.y + 140 },
      { t: L.drag[0] - 0.7, x: 1320, y: 1000, ease: "linear" },
      { t: L.drag[0] - 0.2, ...GRAB },
      { t: L.drag[0], ...GRAB, ease: "linear" },
      { t: L.drag[1], ...DROP },
      { t: L.drag[1] + 0.2, ...DROP, ease: "linear" },
      { t: L.presentOut - 0.05, x: DROP.x + 110, y: DROP.y + 150 },
      { t: L.sendClick - 0.75, x: 1520, y: 1010, ease: "linear" },
      { t: L.sendClick - 0.2, ...SEND_BTN },
      { t: L.sendClick + 0.15, ...SEND_BTN, ease: "linear" },
      { t: L.sendClick + 0.6, x: SEND_BTN.x + 60, y: SEND_BTN.y + 90 },
    ]}
    opacity={[
      [L.listScroll[0] + 0.3, 0],
      [L.listScroll[0] + 0.45, 1],
      [L.pickClick + 0.15, 1],
      [L.pickMorph[0] + 0.3, 0],
      [L.reviewClick - 0.85, 0],
      [L.reviewClick - 0.7, 1],
      [L.reviewClick + 0.4, 1],
      [L.reviewClick + 0.6, 0],
      [L.planClick - 0.7, 0],
      [L.planClick - 0.55, 1],
      [L.planClick + 0.45, 1],
      [L.planClick + 0.65, 0],
      [L.drag[0] - 0.7, 0],
      [L.drag[0] - 0.55, 1],
      [L.presentOut - 0.25, 1],
      [L.presentOut - 0.05, 0],
      [L.sendClick - 0.75, 0],
      [L.sendClick - 0.6, 1],
      [L.sendClick + 0.4, 1],
      [L.sendClick + 0.6, 0],
    ]}
    clicks={[
      { at: L.pickClick, ...PICK },
      { at: L.reviewClick, ...REVIEW_BTN },
      { at: L.planClick, ...PLAN },
      { at: L.sendClick, ...SEND_BTN },
    ]}
    hand={[
      [L.pickClick - 0.35, L.pickMorph[0] + 0.3],
      [L.reviewClick - 0.45, L.reviewClick + 0.6],
      [L.planClick - 0.4, L.planClick + 0.65],
      [L.drag[0] - 0.35, L.presentOut - 0.05],
      [L.sendClick - 0.4, L.sendClick + 0.6],
    ]}
    holds={[[L.drag[0] - 0.05, L.drag[1] + 0.05]]}
  />
  );
};
