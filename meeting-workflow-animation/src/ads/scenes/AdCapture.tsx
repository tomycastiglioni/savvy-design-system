import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Capture } from "../../capture/Capture";
import { DOC_PANEL, PHONE, TABS_BAR } from "../../capture/layout";
import { T } from "../../capture/timeline";
import { anchor, Camera, CameraKey, SOURCE, viewAt } from "../Camera";
import { AD, graphicTop, MARGIN_X } from "../layout";

// Ad 03 · Capture: the workflow video through a camera. The phone is centred
// at 1.15×, 30 px under the graphic line, with its recording screen's content
// moved up 30 px so it clears the bottom edge; as it grows into the desktop
// recap the camera
// moves to 1.2× with the recap's tab bar on the text margin, so the recap runs
// off the right and bottom instead of crowding both side margins.
const TOP = graphicTop("capture");
const PHONE_S = 1.15;
const PHONE_VIEW = { x: (AD.w - PHONE_S * SOURCE.w) / 2, y: TOP + 30 - PHONE.y * PHONE_S, s: PHONE_S };
const DESK_VIEW = anchor(DOC_PANEL.x, TABS_BAR.y, MARGIN_X, TOP, 1.2);
const KEYS: CameraKey[] = [
  { t: 0, ...PHONE_VIEW },
  { t: T.growStart, ...PHONE_VIEW },
  { t: T.growEnd, ...DESK_VIEW },
];

export const AdCapture: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Camera view={viewAt(KEYS, frame / fps)}>
      <Capture transparent screenShift={30} />
    </Camera>
  );
};
