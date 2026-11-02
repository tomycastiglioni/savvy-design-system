import { Audio } from "@remotion/media";
import React from "react";
import { Sequence, staticFile, useVideoConfig } from "remotion";
import { ROWS } from "./content";
import { rowAt, T } from "./timeline";

// Sounds (public/audio/mobile-prep/, ElevenLabs text to sound v2, trimmed and
// peak-normalized; levels are set here): a soft airy rise while the prep
// loads, a bright chime as the chip flips to "Prep ready", and a glassy pluck
// per row, one take tuned up a pentatonic step each time (E G A C E) so the
// rows climb as they fill in. The chime is in C, so the plucks sit with it.
const SOUNDS = {
  loading: { src: "loading", dur: 1.33 },
  ready: { src: "ready", dur: 1.04 },
  row: (i: number) => ({ src: `row-${i + 1}`, dur: 0.45 }),
};
type Cue = { readonly src: string; readonly dur: number; readonly at: number; readonly volume: number };

const CUES: readonly Cue[] = [
  // The rise peaks 0.75 s in, right as loading resolves.
  { ...SOUNDS.loading, at: T.ready - 0.75, volume: 0.2 },
  // The chime peaks 0.09 s in; land it on the new chip's pop.
  { ...SOUNDS.ready, at: T.ready + 0.06 - 0.09, volume: 0.33 },
  // Four rows, then the button; higher notes read louder, so they taper.
  ...Array.from({ length: ROWS.length + 1 }, (_, i) => ({ ...SOUNDS.row(i), at: rowAt(i) + 0.02, volume: 0.14 - 0.01 * i })),
];

export const MobilePrepSfx: React.FC = () => {
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
