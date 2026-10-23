import React from "react";
import { Freeze, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP } from "../theme";

// Plays children (a workflow video's scenes) on their own clock: `to` maps the
// enclosing time (seconds) to the source time (seconds). Lets the launch video
// speed up, hold or skip parts of the existing animations.
export const Remap: React.FC<{
  readonly to: (t: number) => number;
  readonly children: React.ReactNode;
}> = ({ to, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return <Freeze frame={to(frame / fps) * fps}>{children}</Freeze>;
};

// Piecewise-linear time map through [launch, source] pairs (clamped).
export const timeMap =
  (pairs: readonly (readonly [number, number])[]) =>
  (t: number): number =>
    interpolate(
      t,
      pairs.map((p) => p[0]),
      pairs.map((p) => p[1]),
      CLAMP,
    );
