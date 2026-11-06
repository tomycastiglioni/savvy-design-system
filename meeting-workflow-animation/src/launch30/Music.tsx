import { Audio } from "@remotion/media";
import React from "react";
import { staticFile, useVideoConfig } from "remotion";
import { Timeline, useL } from "./timeline";

// "Slaptastic" (Steven Beddall, Creative Cut · Beat; licensed, approved by the
// team), cut to each ending at 120 BPM by scripts/launch30-music.sh: it comes
// in partway through its soft intro bar, keeps its one-bar break (on the
// meeting capture), drops one repeated bar before its ending, and lands its
// final hit on the logo. public/audio/launch30/music-slaptastic-{a,b}.mp3.
//
// It dips under each voiceover line and comes back up between them, and fades
// out over the last half second.
const OPEN = 0.17; // between lines
const UNDER = 0.075; // under the voice
const ATTACK = 0.2; // dip starts this long before a line
const RELEASE = 0.4; // and recovers over this long after it

const smooth = (p: number) => {
  const c = Math.min(1, Math.max(0, p));
  return c * c * (3 - 2 * c);
};

// The last line only half dips, so the final hit still lands with the logo.
const duck = (L: Timeline, t: number) =>
  Math.max(
    0,
    ...L.vo.map(({ at, len }, i) => {
      const [a, b] = [at + 0.06, at + len - 0.06];
      const depth = i === L.vo.length - 1 ? 0.5 : 1;
      return depth * (t < a ? smooth((t - (a - ATTACK)) / ATTACK) : t > b ? 1 - smooth((t - b) / RELEASE) : 1);
    }),
  );

const musicVolume = (L: Timeline, t: number) => {
  const level = OPEN + (UNDER - OPEN) * duck(L, t);
  const fadeOut = 1 - smooth((t - (L.end - 0.5)) / 0.5);
  return level * fadeOut;
};

export const Launch30Music: React.FC = () => {
  const L = useL();
  const { fps } = useVideoConfig();
  return <Audio src={staticFile(`audio/launch30/music-slaptastic-${L.ending ?? "a"}.mp3`)} volume={(f) => musicVolume(L, f / fps)} />;
};
