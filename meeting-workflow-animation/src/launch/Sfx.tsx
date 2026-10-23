import { Audio } from "@remotion/media";
import React from "react";
import { Sequence, staticFile, useVideoConfig } from "remotion";
import { WRITING_STYLE } from "../recap/content";
import { L } from "./timeline";

// Sound effects generated with ElevenLabs (text to sound v2), trimmed and
// peak-normalized in public/audio/launch/. Cues follow the timeline, so a
// moved beat keeps its sound.
const SOUNDS = {
  click: 0.15,
  whoosh: 1.8,
  send: 0.8,
  chime: 1.3,
  mic: 0.7,
  shimmer: 1.7,
  tick: 0.4,
  success: 1.6,
  sting: 3.2,
} as const;
type Sound = keyof typeof SOUNDS;
type Cue = { readonly sound: Sound; readonly at: number; readonly volume: number };

// The whoosh swells to its peak 0.9s in; line that up with the middle of the move.
const WHOOSH_PEAK = 0.9;

const CLICKS = [L.micClick, L.reviewClick, L.addClick, L.presentClick, L.createClick, L.createClick + 1.45, L.createClick + 2.35, L.draftClick, L.sendClick];
const MOVES = [
  L.titleOut + 0.35, // prompt box opens
  L.prepMorph + 0.3, // button → loading card
  L.prepOut + 0.25, // → live planning
  L.present + 0.3, // present the projection
  L.planOut + 0.25, // → meeting capture
  L.captureGrow + 0.45, // phone → desktop
  L.createClick + 0.4, // recap → editor
  L.loaderMorph + 0.3, // button → writing-style loader
  L.emailMorph + 0.3, // loader → email draft
  L.sent + 0.3, // draft → "Email sent"
  L.closeIn + 0.25, // → tagline
];

export const SFX: readonly Cue[] = [
  ...CLICKS.map((at) => ({ sound: "click" as const, at: at - 0.02, volume: 0.55 })),
  ...MOVES.map((peak) => ({ sound: "whoosh" as const, at: peak - WHOOSH_PEAK, volume: 0.3 })),
  { sound: "mic", at: L.micClick + 0.06, volume: 0.35 },
  { sound: "send", at: L.send, volume: 0.45 },
  { sound: "chime", at: L.reply + 0.05, volume: 0.4 },
  { sound: "shimmer", at: L.prepMorph + 0.5, volume: 0.25 },
  { sound: "shimmer", at: L.loaderMorph + 0.5, volume: 0.25 },
  ...WRITING_STYLE.map((_, i) => ({ sound: "tick" as const, at: L.loadHold + i * 0.18, volume: 0.35 })),
  { sound: "success", at: L.sent + 0.45, volume: 0.45 },
  { sound: "sting", at: L.logoIn - 0.15, volume: 0.6 },
];

export const Sfx: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <>
      {SFX.map((cue, i) => (
        <Sequence key={i} name={`sfx ${cue.sound}`} from={Math.round(cue.at * fps)} durationInFrames={Math.ceil(SOUNDS[cue.sound] * fps)} layout="none">
          <Audio src={staticFile(`audio/launch/${cue.sound}.mp3`)} volume={cue.volume} />
        </Sequence>
      ))}
    </>
  );
};
