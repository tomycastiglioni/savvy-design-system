import { Audio } from "@remotion/media";
import React from "react";
import { Sequence, staticFile, useVideoConfig } from "remotion";
import { L } from "./timeline";

// Same sound kit as the 44 s cut (public/audio/launch/), cued to this
// timeline: whooshes on the big moves, clicks where the advisor acts, ticks
// as things land, a sting on the wordmark.
const SOUNDS = { click: 0.15, whoosh: 1.8, send: 0.8, mic: 0.7, shimmer: 1.7, tick: 0.4, success: 1.6, sting: 3.2 } as const;
type Cue = { readonly sound: keyof typeof SOUNDS; readonly at: number; readonly volume: number };

// The whoosh swells to its peak 0.9 s in; cue it so the peak meets the move.
const whoosh = (peak: number): Cue => ({ sound: "whoosh", at: peak - 0.9, volume: 0.28 });
const tick = (at: number): Cue => ({ sound: "tick", at, volume: 0.3 });

const CUES: readonly Cue[] = [
  whoosh(L.meetingIn[0] + 0.15), // title → the meeting line
  whoosh(L.pillFly[0] + 0.35), // the pill flies into the prep card
  { sound: "click", at: L.reviewClick - 0.02, volume: 0.55 },
  whoosh(L.docMorph[0] + 0.3), // card → prep document
  { sound: "shimmer", at: L.docReveal[0], volume: 0.22 },
  whoosh(L.lift[0] + 0.3), // the plan lifts out
  whoosh(L.land[0] + 0.35), // … and lands as the presentation
  { sound: "click", at: L.drag[0] - 0.07, volume: 0.5 },
  ...[0.2, 0.45, 0.7].map((d) => tick(L.drag[0] + d)),
  whoosh(L.phoneIn[0] + 0.35), // the phone slides in
  { sound: "mic", at: L.phoneIn[1], volume: 0.3 },
  whoosh(L.closeUp[0] + 0.3), // close-up
  { sound: "shimmer", at: L.writing[0], volume: 0.22 },
  whoosh(L.toRecap[0] + 0.35), // phone → recap
  whoosh(L.toDoc[0] + 0.3), // recap → document and email
  { sound: "click", at: L.sendClick - 0.02, volume: 0.55 },
  { sound: "send", at: L.sendClick + 0.08, volume: 0.4 },
  { sound: "success", at: L.sentCheck[0], volume: 0.42 },
  ...L.results.map((at) => tick(at)),
  ...L.words.map((at) => tick(at + 0.05)),
  whoosh(L.tagline[0] + 0.2), // the tagline
  { sound: "sting", at: L.logoIn - 0.15, volume: 0.6 },
];

export const Launch30Sfx: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <>
      {CUES.map((cue, i) => (
        <Sequence key={i} name={`sfx ${cue.sound}`} from={Math.round(cue.at * fps)} durationInFrames={Math.ceil(SOUNDS[cue.sound] * fps)} layout="none">
          <Audio src={staticFile(`audio/launch/${cue.sound}.mp3`)} volume={cue.volume} />
        </Sequence>
      ))}
    </>
  );
};
