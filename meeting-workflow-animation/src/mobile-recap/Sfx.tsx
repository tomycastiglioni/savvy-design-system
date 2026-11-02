import { Audio } from "@remotion/media";
import React from "react";
import { Sequence, staticFile, useVideoConfig } from "remotion";
import { T } from "./timeline";

// The MobilePrep sound set (public/audio/mobile-prep/), so the clips sound like
// one app: the five climbing plucks for the three points, the email row and
// the button, the launch kit's soft click on the press, and the chime as it
// turns to "Sent".
const CUES = [
  ...[...T.points, T.email, T.button].map((at, i) => ({ src: `mobile-prep/row-${i + 1}`, dur: 0.45, at: at + 0.02, volume: 0.14 - 0.01 * i })),
  { src: "launch/click", dur: 0.15, at: T.press - 0.02, volume: 0.35 },
  { src: "mobile-prep/ready", dur: 1.04, at: T.sent + 0.05 - 0.09, volume: 0.3 },
];

export const MobileRecapSfx: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <>
      {CUES.map((cue) => (
        <Sequence key={cue.src} name={`sfx ${cue.src}`} from={Math.round(cue.at * fps)} durationInFrames={Math.ceil(cue.dur * fps)} layout="none">
          <Audio src={staticFile(`audio/${cue.src}.mp3`)} volume={cue.volume} />
        </Sequence>
      ))}
    </>
  );
};
