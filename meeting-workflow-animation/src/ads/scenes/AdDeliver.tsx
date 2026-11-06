import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Recap } from "../../recap/Recap";
import { DOC_PANEL, EDITOR, EMAIL, LOADING_BOX, TABS_BAR } from "../../recap/layout";
import { T } from "../../recap/timeline";
import { anchor, Camera, CameraKey, viewAt } from "../Camera";
import { AdLayout, byFormat, INNER_W, MARGIN_X, useAdLayout } from "../layout";

// Ad 04 · Deliver: the workflow video through a camera that keeps each step on
// the text margin and every clicked button in frame (scales for 4:5; 1:1 and
// 9:16 fit the same steps to their room, between the copy and the safe bottom).
//   recap              1.15×, running off the right ("Create client document" in frame)
//   editor             1×, so "Save changes" is in frame; the preview runs off the right
//   back on the recap  0.94×, so "Draft client email" fits
//   writing-style card 1.1×, centred across the frame and between the copy and the bottom
//   email and "sent"   fitted between the side margins (Send in frame), centred
//                      between the copy and the bottom
// The ad starts 3.25 s in, on the suggested tasks.
const deliverLayout = (lay: AdLayout) => {
  const TOP = lay.top;
  const mid = (lay.textBottom + lay.safeBottom) / 2;
  const RECAP = anchor(DOC_PANEL.x, TABS_BAR.y, MARGIN_X, TOP, 1.15);
  // The editor fits down to its Save button, 60 px above the safe bottom.
  const editS = Math.min(byFormat(lay.format, { "4x5": 1, "1x1": 1, "9x16": 1.15 }), (lay.safeBottom - 60 - TOP) / 668);
  const EDIT = anchor(EDITOR.x, EDITOR.y, MARGIN_X, TOP, editS);
  const RECAP_WIDE = anchor(DOC_PANEL.x, TABS_BAR.y, MARGIN_X, TOP, 0.94);
  const LOADER = anchor(LOADING_BOX.x + LOADING_BOX.w / 2, LOADING_BOX.y + LOADING_BOX.h / 2, lay.w / 2, mid, byFormat(lay.format, { "4x5": 1.1, "1x1": 0.95, "9x16": 1.2 }));
  // The email card fits between the side margins, and between the copy and the
  // safe bottom with at least the format's gap above and below.
  const mailS = Math.min(INNER_W / EMAIL.w, (lay.safeBottom - lay.textBottom - 2 * lay.gap) / EMAIL.h);
  const MAIL = anchor(EMAIL.x, EMAIL.y + EMAIL.h / 2, MARGIN_X, mid, mailS);
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
  // safe bottom once the camera has pulled back to RECAP_WIDE.
  const TOAST_TOP = (lay.safeBottom - 75 - 42 - RECAP_WIDE.y) / RECAP_WIDE.s;
  return { KEYS, TOAST_TOP };
};

export const AdDeliver: React.FC = () => {
  const lay = useAdLayout("deliver");
  const { KEYS, TOAST_TOP } = useMemo(() => deliverLayout(lay), [lay.format]); // eslint-disable-line react-hooks/exhaustive-deps
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Camera view={viewAt(KEYS, frame / fps)}>
      <Recap transparent toastTop={TOAST_TOP} />
    </Camera>
  );
};
