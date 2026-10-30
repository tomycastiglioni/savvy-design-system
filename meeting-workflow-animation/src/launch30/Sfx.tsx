import { Audio } from "@remotion/media";
import React from "react";
import { Sequence, staticFile, useVideoConfig } from "remotion";
import { L } from "./timeline";

// Sounds, kept subtle: a soft air whoosh on the big moves and a muted tap on
// each text reveal (public/audio/launch30/, ElevenLabs text to sound v2,
// high-passed, trimmed and loudness-normalized), plus the launch kit's click,
// success and sting (public/audio/launch/).
const SOUNDS = {
  whoosh: { src: "launch30/whoosh-soft", dur: 0.8 },
  text: { src: "launch30/text", dur: 0.45 },
  click: { src: "launch/click", dur: 0.15 },
  success: { src: "launch/success", dur: 1.6 },
  sting: { src: "launch/sting", dur: 3.2 },
} as const;
type Cue = { readonly sound: keyof typeof SOUNDS; readonly at: number; readonly volume: number };

// The soft whoosh swells to its peak 0.36 s in; cue it so the peak meets the move.
const whoosh = (peak: number): Cue => ({ sound: "whoosh", at: peak - 0.36, volume: 0.35 });
const text = (at: number, volume = 0.5): Cue => ({ sound: "text", at: at + 0.04, volume });
const click = (at: number): Cue => ({ sound: "click", at: at - 0.02, volume: 0.5 });

const CUES: readonly Cue[] = [
  // Text reveals
  text(L.titleIn),
  ...L.meetingIn.map((at) => text(at)),
  ...[L.prepText, L.presentText, L.captureText, L.deliverText].map((at) => text(at)),
  ...L.results.map((at) => text(at, 0.3)),
  ...L.words.map((at) => text(at)),
  ...L.tagline.map((at) => text(at)),
  // Moves
  whoosh(L.pillFly[0] + 0.3), // the pill flies into the prep card
  whoosh(L.docMorph[0] + 0.25), // card → prep document
  whoosh(L.lift[0] + 0.25), // the plan lifts out
  whoosh(L.phoneIn[0] + 0.3), // the phone slides in
  whoosh(L.closeUp[0] + 0.25), // close-up
  whoosh(L.toRecap[0] + 0.3), // phone → recap
  whoosh(L.toDoc[0] + 0.25), // recap → document and email
  whoosh(L.toSent[0] + 0.25), // email → "Email sent"
  // Where the advisor acts
  click(L.reviewClick),
  click(L.planClick),
  click(L.drag[0] - 0.05),
  click(L.sendClick),
  { sound: "success", at: L.sentCheck[0], volume: 0.4 },
  { sound: "sting", at: L.logoIn - 0.15, volume: 0.55 },
];

export const Launch30Sfx: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <>
      {CUES.map((cue, i) => (
        <Sequence key={i} name={`sfx ${cue.sound}`} from={Math.round(cue.at * fps)} durationInFrames={Math.ceil(SOUNDS[cue.sound].dur * fps)} layout="none">
          <Audio src={staticFile(`audio/${SOUNDS[cue.sound].src}.mp3`)} volume={cue.volume} />
        </Sequence>
      ))}
    </>
  );
};
