import { Audio } from "@remotion/media";
import React from "react";
import { Sequence, staticFile, useVideoConfig } from "remotion";
import { L } from "./timeline";

// Sounds, kept soft and warm (public/audio/launch30/, ElevenLabs text to sound
// v2, trimmed, filtered and peak-normalized; levels are set here): a short
// swish on text reveals, a rounded whoosh on the big moves, a two-note chime
// when the phone starts recording and a rising shimmer as it starts writing the
// recap. The logo sound was supplied by the Savvy team (faded out to end with
// the video). Clicks and the sent chime come from the launch kit
// (public/audio/launch/).
const SOUNDS = {
  swish: { src: "launch30/swish", dur: 0.6 },
  whoosh: { src: "launch30/whoosh", dur: 1.05 },
  record: { src: "launch30/record", dur: 1.0 },
  shimmer: { src: "launch30/shimmer", dur: 1.47 },
  logo: { src: "launch30/logo", dur: 1.75 },
  click: { src: "launch/click", dur: 0.15 },
  success: { src: "launch/success", dur: 1.6 },
} as const;
type Cue = { readonly sound: keyof typeof SOUNDS; readonly at: number; readonly volume: number };

// Each sound is cued so its loudest point meets the motion: the swish peaks
// 0.2 s in, the whoosh 0.4 s, the shimmer 0.77 s; the logo sound starts on its hit.
const swish = (textIn: number): Cue => ({ sound: "swish", at: textIn - 0.05, volume: 0.1 });
const whoosh = (peak: number): Cue => ({ sound: "whoosh", at: peak - 0.4, volume: 0.16 });
const click = (at: number): Cue => ({ sound: "click", at: at - 0.02, volume: 0.4 });

const CUES: readonly Cue[] = [
  // Text reveals that no move already covers
  swish(L.titleIn),
  ...L.meetingIn.map(swish),
  swish(L.presentText),
  ...L.words.map(swish),
  ...L.tagline.map(swish),
  // Moves (each phase's headline arrives with one of these)
  whoosh(L.pillFly[0] + 0.3), // the pill flies into the prep card
  whoosh(L.docMorph[0] + 0.25), // card → prep document
  whoosh(L.lift[0] + 0.25), // the plan lifts out
  whoosh(L.phoneIn[0] + 0.3), // the phone slides in
  whoosh(L.toRecap[0] + 0.3), // phone → recap
  whoosh(L.toDoc[0] + 0.25), // recap → document and email
  whoosh(L.toSent[0] + 0.25), // email → "Email sent"
  // The phone: recording starts, then it writes the recap
  { sound: "record", at: L.phoneIn[1] - 0.2, volume: 0.08 },
  { sound: "shimmer", at: L.writing[1] - 0.77, volume: 0.14 },
  // Where the advisor acts
  click(L.reviewClick),
  click(L.planClick),
  click(L.drag[0] - 0.05),
  click(L.sendClick),
  { sound: "success", at: L.sentCheck[0], volume: 0.08 },
  { sound: "logo", at: L.logoIn, volume: 0.34 },
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
