import React from "react";
import { Easing } from "remotion";
import { Capture } from "../../capture/Capture";
import { Headline } from "../components/Headline";
import { Remap, timeMap } from "../components/Remap";
import { camAt, Stage } from "../components/Stage";
import { EASE_MORPH, EYEBROW, TEXT_X } from "../theme";
import { CAM, L, useT } from "../timeline";

// Launch time → 03 · Meeting capture time. Plays recording → transcribing →
// writing → notes as is, skips the Transcription-tab detour (6.2s → 8.52s,
// the same summary screen on both sides), then the phone grows into the
// desktop recap and its reveal finishes more slowly.
export const CAPTURE_TIME = timeMap([
  [L.captureIn, 0],
  [L.captureGrow, 6.2],
  [L.captureGrow + 0.001, 8.52],
  [L.captureGrow + 0.9, 9.42],
  [L.materialsIn, 10.15],
]);
// 03's desktop recap mounts at 9.0s; at the hand-off its reveal is this far in.
export const RECAP_REVEAL_AT_HANDOFF = 10.15 - 9.0;

// F12 → F16: phone centered, slides right for the headline, then grows into
// the desktop document. Hands over to Client materials at L.materialsIn.
export const CaptureChapter: React.FC = () => {
  const t = useT();
  if (t < L.captureIn - 0.05 || t >= L.materialsIn) {
    return null;
  }
  const cam = camAt(t, [
    { t: L.capturePan, cam: CAM.phone },
    { t: L.capturePan + 0.7, cam: CAM.phoneRight },
    { t: L.captureGrow, cam: CAM.phoneRight, ease: Easing.linear },
    { t: L.captureGrow + 0.9, cam: CAM.desktop, ease: EASE_MORPH },
  ]);

  return (
    <>
      <Stage cam={cam}>
        <Remap to={CAPTURE_TIME}>
          <Capture transparent tabs={false} linkedDocs />
        </Remap>
      </Stage>
      <Headline
        eyebrow="Meeting capture"
        color={EYEBROW.capture}
        lines={["Every conversation,", "on the record"]}
        x={TEXT_X}
        inAt={L.captureText}
        outAt={L.captureTextOut}
      />
    </>
  );
};
