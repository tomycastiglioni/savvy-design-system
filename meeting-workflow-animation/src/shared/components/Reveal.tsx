import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, EASE_OUT } from "../theme";

// Fade + rise used for staggered content reveals. `at` is in seconds, local
// to the enclosing Sequence.
export const Reveal: React.FC<{
  readonly at: number;
  readonly dur?: number;
  readonly y?: number;
  readonly x?: number;
  readonly style?: React.CSSProperties;
  readonly children?: React.ReactNode;
}> = ({ at, dur = 0.5, y = 10, x = 0, style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [at * fps, (at + dur) * fps], [0, 1], {
    ...CLAMP,
    easing: EASE_OUT,
  });

  return (
    <div
      style={{
        ...style,
        opacity: p * (style?.opacity === undefined ? 1 : Number(style.opacity)),
        translate: `${(1 - p) * x}px ${(1 - p) * y}px`,
      }}
    >
      {children}
    </div>
  );
};
