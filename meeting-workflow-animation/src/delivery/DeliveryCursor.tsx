import React from "react";
import { CursorKey, CursorLayer } from "../shared/components/CursorLayer";
import { GRAPH_CARD, GRAPH_SLOTS, knobCenter, presentButtonCenter, slotCenter } from "./layout";
import { T } from "./timeline";
import { DRAGS, SLIDERS } from "./whatif";

const ADD = slotCenter(GRAPH_SLOTS.add, GRAPH_CARD);
const PRESENT = presentButtonCenter(GRAPH_SLOTS.add, GRAPH_CARD);
// Out of the way, below the card, while the projection builds.
const REST = { x: ADD.x + 70, y: GRAPH_SLOTS.add.y + GRAPH_CARD.h + 70 };

// Each drag: arrive at the knob, then follow it with the same easing the
// slider uses, so the fingertip stays on the knob.
const dragKeys = (): CursorKey[] =>
  DRAGS.flatMap((d) => {
    const from = knobCenter(d.slider, SLIDERS[d.slider].p0);
    const to = knobCenter(d.slider, d.to);
    return [
      { t: d.start - 0.1, ...from },
      { t: d.start, ...from, ease: "linear" },
      { t: d.end, ...to },
      { t: d.end + 0.1, ...to, ease: "linear" },
    ] satisfies CursorKey[];
  });

export const DeliveryCursor: React.FC = () => (
  <CursorLayer
    path={[
      { t: 1.2, x: 1010, y: 880 },
      { t: 1.85, ...ADD },
      { t: 2.05, ...ADD, ease: "linear" },
      { t: 2.7, ...REST },
      { t: 3.55, ...REST, ease: "linear" },
      { t: 4.25, ...PRESENT },
      { t: 4.6, ...PRESENT, ease: "linear" },
      { t: 6.25, x: 1010, y: 830, ease: "linear" }, // hidden while presenting
      ...dragKeys(),
      { t: 11.2, x: 1100, y: 760 },
    ]}
    opacity={[
      [1.2, 0],
      [1.35, 1],
      [4.55, 1],
      [4.75, 0],
      [6.25, 0],
      [6.4, 1],
    ]}
    clicks={[
      { at: T.clickAdd, ...ADD },
      { at: T.clickPresent, ...PRESENT },
    ]}
    hand={[
      [1.65, 2.1],
      [4.05, 4.75],
      [6.7, 10.7],
    ]}
    holds={DRAGS.map((d) => [d.start - 0.05, d.end + 0.05] as const)}
  />
);
