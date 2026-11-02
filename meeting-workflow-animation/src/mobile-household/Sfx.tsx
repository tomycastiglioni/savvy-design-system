import { Audio } from "@remotion/media";
import React from "react";
import { Sequence, staticFile, useVideoConfig } from "remotion";
import { AGENDA } from "./content";
import { T } from "./timeline";

// The MobilePrep sound set (public/audio/mobile-prep/), so the two clips sound
// like one app: the airy rise swells as the total counts up and peaks as it
// lands, the chime meets the "+6.1%" pop, and the agenda rows climb on the
// first three plucks.
const CUES = [
  { src: "loading", dur: 1.33, at: T.pill - 0.75, volume: 0.2 },
  { src: "ready", dur: 1.04, at: T.pill + 0.03 - 0.09, volume: 0.3 },
  ...AGENDA.map((_, i) => ({ src: `row-${i + 1}`, dur: 0.45, at: T.rows[i] + 0.02, volume: 0.14 - 0.01 * i })),
];

export const MobileHouseholdSfx: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <>
      {CUES.map((cue) => (
        <Sequence key={cue.src} name={`sfx ${cue.src}`} from={Math.round(cue.at * fps)} durationInFrames={Math.ceil(cue.dur * fps)} layout="none">
          <Audio src={staticFile(`audio/mobile-prep/${cue.src}.mp3`)} volume={cue.volume} />
        </Sequence>
      ))}
    </>
  );
};
