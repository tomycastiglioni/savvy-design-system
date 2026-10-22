import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, CLAMP, EASE_IN_OUT, EASE_OUT } from "../theme";

// Supplied cursor SVGs, drawn at 1.5× their 31×33 / 30×32 artboards.
// Hotspots are the arrow tip and the index fingertip.
const SCALE = 1.5;
const ARROW = { src: "images/cursor-arrow.svg", w: 31, h: 33, hotX: 9.15, hotY: 6.03 };
const HAND = { src: "images/cursor-hand.svg", w: 30, h: 32, hotX: 9.4, hotY: 4.4 };

// `ease` describes the segment arriving at this key: "move" (default) is an
// eased glide, "linear" is used for holds and drags that must track a value.
export type CursorKey = {
  readonly t: number;
  readonly x: number;
  readonly y: number;
  readonly ease?: "move" | "linear" | "drag";
};
export type CursorClick = { readonly at: number; readonly x: number; readonly y: number };
type Range = readonly [number, number];

const Ripple: React.FC<CursorClick> = ({ at, x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [at * fps, (at + 0.45) * fps], [0, 1], {
    ...CLAMP,
    easing: EASE_OUT,
  });
  if (p <= 0 || p >= 1) {
    return null;
  }
  const size = 12 + p * 52;
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        background: "rgba(23, 82, 66, 0.12)",
        border: `2px solid ${C.green300}`,
        opacity: 0.9 * (1 - p),
      }}
    />
  );
};

const CursorImage: React.FC<{ readonly c: typeof ARROW; readonly visible: boolean }> = ({ c, visible }) => (
  <Img
    src={staticFile(c.src)}
    style={{
      position: "absolute",
      left: -c.hotX * SCALE,
      top: -c.hotY * SCALE,
      width: c.w * SCALE,
      height: c.h * SCALE,
      opacity: visible ? 1 : 0,
    }}
  />
);

export const CursorLayer: React.FC<{
  readonly path: readonly CursorKey[];
  readonly opacity: readonly Range[]; // [time, opacity] keyframes
  readonly clicks?: readonly CursorClick[];
  readonly hand?: readonly Range[]; // [from, to) in seconds
  readonly holds?: readonly Range[]; // pressed for the whole range (drags)
}> = ({ path, opacity, clicks = [], hand = [], holds = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const keys = path.map((k) => k.t * fps);
  const easing = path.slice(1).map((k) => (k.ease === "linear" ? Easing.linear : EASE_IN_OUT));
  const x = interpolate(frame, keys, path.map((k) => k.x), { ...CLAMP, easing });
  const y = interpolate(frame, keys, path.map((k) => k.y), { ...CLAMP, easing });

  const alpha = interpolate(frame, opacity.map((o) => o[0] * fps), opacity.map((o) => o[1]), CLAMP);

  const press = Math.max(
    0,
    ...clicks.map((c) =>
      interpolate(frame, [(c.at - 0.03) * fps, (c.at + 0.05) * fps, (c.at + 0.18) * fps], [0, 1, 0], CLAMP),
    ),
    ...holds.map(([a, b]) =>
      interpolate(frame, [(a - 0.03) * fps, (a + 0.05) * fps, b * fps, (b + 0.13) * fps], [0, 1, 1, 0], CLAMP),
    ),
  );

  const isHand = hand.some(([a, b]) => t >= a && t < b);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {clicks.map((c) => (
        <Ripple key={c.at} {...c} />
      ))}
      <div style={{ position: "absolute", left: x, top: y, opacity: alpha, scale: 1 - 0.14 * press, transformOrigin: "0px 0px" }}>
        <CursorImage c={ARROW} visible={!isHand} />
        <CursorImage c={HAND} visible={isHand} />
      </div>
    </AbsoluteFill>
  );
};
