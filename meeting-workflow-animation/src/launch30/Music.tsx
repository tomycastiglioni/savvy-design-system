import { Audio } from "@remotion/media";
import React from "react";
import { staticFile, useVideoConfig } from "remotion";
import { L } from "./timeline";

// "Slaptastic" (Steven Beddall, Creative Cut · Beat; licensed, approved by the
// team), cut to the video at 120 BPM: it starts at the end of its intro bar so
// the groove lands at 0:00.45, two repeated bars are dropped before its ending,
// its one-bar break falls on the meeting capture (0:14.45) and its final hit on
// the logo (0:28.45). public/audio/launch30/music-slaptastic.mp3 is that edit.
//
// It dips under each voiceover line and comes back up between them, and fades
// out over the last half second.

// The voiceover's lines as placed in vo-jeremy.mp3 (s).
const VO_LINES: readonly (readonly [number, number])[] = [
  [0.15, 5.76],
  [5.86, 8.61],
  [9.7, 12.34],
  [14.3, 17.44],
  [17.9, 23.75],
  [24.5, 26.37],
  [26.5, 28.86],
];
const OPEN = 0.17; // between lines
const UNDER = 0.075; // under the voice
const ATTACK = 0.2; // dip starts this long before a line
const RELEASE = 0.4; // and recovers over this long after it

const smooth = (p: number) => {
  const c = Math.min(1, Math.max(0, p));
  return c * c * (3 - 2 * c);
};
// The last line only half dips, so the final hit still lands with the logo.
const DEPTH = [1, 1, 1, 1, 1, 1, 0.5];
const duck = (t: number) =>
  Math.max(0, ...VO_LINES.map(([a, b], i) => DEPTH[i] * (t < a ? smooth((t - (a - ATTACK)) / ATTACK) : t > b ? 1 - smooth((t - b) / RELEASE) : 1)));

export const musicVolume = (t: number) => {
  const level = OPEN + (UNDER - OPEN) * duck(t);
  const fadeOut = 1 - smooth((t - (L.end - 0.5)) / 0.5);
  return level * fadeOut;
};

export const Launch30Music: React.FC = () => {
  const { fps } = useVideoConfig();
  return <Audio src={staticFile("audio/launch30/music-slaptastic.mp3")} volume={(f) => musicVolume(f / fps)} />;
};
