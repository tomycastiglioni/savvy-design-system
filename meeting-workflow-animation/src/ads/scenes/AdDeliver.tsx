import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Recap } from "../../recap/Recap";
import { DOC_PANEL, EDITOR, EMAIL, LOADING_BOX, TABS_BAR } from "../../recap/layout";
import { T } from "../../recap/timeline";
import { anchor, Camera, CameraKey, viewAt } from "../Camera";
import { AD, graphicTop, INNER_W, MARGIN_X, TEXT_BOTTOM } from "../layout";

// Ad 04 · Deliver: the workflow video through a camera that keeps each step on
// the text margin and every clicked button in frame.
//   recap              1.15×, running off the right ("Create client document" in frame)
//   editor             1×, so "Save changes" is in frame; the preview runs off the right
//   back on the recap  0.94×, so "Draft client email" fits
//   writing-style card 1.1×, centred across the frame and between the copy and the bottom
//   email and "sent"   fitted between the side margins (Send in frame), centred
//                      between the copy and the bottom
// The ad starts 3.25 s in, on the suggested tasks.
const TOP = graphicTop("deliver");
const RECAP = anchor(DOC_PANEL.x, TABS_BAR.y, MARGIN_X, TOP, 1.15);
const EDIT = anchor(EDITOR.x, EDITOR.y, MARGIN_X, TOP, 1);
const RECAP_WIDE = anchor(DOC_PANEL.x, TABS_BAR.y, MARGIN_X, TOP, 0.94);
const LOADER = anchor(LOADING_BOX.x + LOADING_BOX.w / 2, LOADING_BOX.y + LOADING_BOX.h / 2, AD.w / 2, (TEXT_BOTTOM.deliver + AD.h) / 2, 1.1);
const MAIL = anchor(EMAIL.x, EMAIL.y + EMAIL.h / 2, MARGIN_X, (TEXT_BOTTOM.deliver + AD.h) / 2, INNER_W / EMAIL.w);
const KEYS: CameraKey[] = [
  { t: 0, ...RECAP },
  { t: T.toEditor, ...RECAP },
  { t: T.toEditor + 0.6, ...EDIT },
  { t: T.toRecap, ...EDIT },
  { t: T.toRecap + 0.6, ...RECAP_WIDE },
  { t: T.loadStart, ...RECAP_WIDE },
  { t: T.loadHold, ...LOADER },
  { t: T.loadEnd, ...LOADER },
  { t: T.emailOpen, ...MAIL },
];

// The "Client document saved" toast, raised so it lands ~75 px above the
// bottom of the frame once the camera has pulled back to RECAP_WIDE.
const TOAST_TOP = (AD.h - 75 - 42 - RECAP_WIDE.y) / RECAP_WIDE.s;

export const AdDeliver: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Camera view={viewAt(KEYS, frame / fps)}>
      <Recap transparent toastTop={TOAST_TOP} />
    </Camera>
  );
};
