import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, CLAMP, EASE_IN_OUT, EASE_OUT } from "../theme";
import { T } from "../timeline";

const ARROW_SIZE = { w: 30, h: 36, hotX: 3, hotY: 1.5 };
const HAND_SIZE = { w: 34, h: 40, hotX: 14.2, hotY: 1.4 };

const Arrow: React.FC = () => (
  <svg width={ARROW_SIZE.w} height={ARROW_SIZE.h} viewBox="0 0 20 24" style={{ overflow: "visible" }}>
    <path
      d="M2 1 L2 19.5 L6.6 15.3 L9.6 22.3 L12.6 21 L9.7 14.2 L15.8 14.2 Z"
      fill="#111111"
      stroke="#FFFFFF"
      strokeWidth={1.4}
      strokeLinejoin="round"
    />
  </svg>
);

const HandShapes: React.FC = () => (
  <>
    <rect x={8} y={1} width={4} height={15} rx={2} />
    <rect x={12} y={8.2} width={4} height={9} rx={2} />
    <rect x={16} y={9.2} width={3.6} height={8} rx={1.8} />
    <rect x={19.6} y={10.6} width={3.4} height={7} rx={1.7} />
    <path d="M8 13.5 H23 V19.5 C23 24 20.5 26.5 16.5 26.5 H12.8 C10.4 26.5 9 25.6 7.6 24 L3.3 18.6 C2.6 17.6 2.8 16.6 3.7 16 C4.6 15.4 5.6 15.6 6.3 16.4 L8 18.4 Z" />
  </>
);

const Hand: React.FC = () => (
  <svg width={HAND_SIZE.w} height={HAND_SIZE.h} viewBox="0 0 24 28" style={{ overflow: "visible" }}>
    <g fill="#111111" stroke="#111111" strokeWidth={2.2} strokeLinejoin="round">
      <HandShapes />
    </g>
    <g fill="#FFFFFF">
      <HandShapes />
    </g>
    <path
      d="M12 12.6 V15.6 M16 13.2 V15.9 M19.6 14 V16.3"
      stroke="#111111"
      strokeWidth={0.9}
      strokeLinecap="round"
    />
  </svg>
);

const CLICKS = [T.clickReview, T.clickAgenda, T.clickTasks];

const Ripple: React.FC<{ readonly at: number; readonly x: number; readonly y: number }> = ({ at, x, y }) => {
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

export const Cursor: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Path keyframes (seconds → canvas px). Moves between 2.75s and 5.8s happen
  // while the cursor is hidden.
  const keys = [1.35, 2.2, 2.75, 5.8, 6.4, 6.6, 7.4, 7.85, 8.28, 8.85, 9.4].map((s) => s * fps);
  const lin = Easing.linear;
  const easing = [EASE_IN_OUT, lin, lin, EASE_IN_OUT, lin, EASE_IN_OUT, lin, EASE_IN_OUT, lin, EASE_IN_OUT];
  const x = interpolate(frame, keys, [960, 380, 380, 820, 427, 427, 560, 560, 591, 591, 330], { ...CLAMP, easing });
  const y = interpolate(frame, keys, [905, 688, 688, 600, 116, 116, 380, 380, 116, 116, 352], { ...CLAMP, easing });

  const opacity = interpolate(
    frame,
    [1.35, 1.5, 2.55, 2.75, 5.8, 5.95].map((s) => s * fps),
    [0, 1, 1, 0, 0, 1],
    CLAMP,
  );

  const press = Math.max(
    ...CLICKS.map((c) =>
      interpolate(frame, [(c - 0.03) * fps, (c + 0.05) * fps, (c + 0.18) * fps], [0, 1, 0], CLAMP),
    ),
  );

  const hand = (t >= 2.02 && t < 2.75) || (t >= 6.22 && t < 6.75) || (t >= 8.1 && t < 8.95) || t >= 9.25;
  const size = hand ? HAND_SIZE : ARROW_SIZE;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {CLICKS.map((c, i) => (
        <Ripple key={c} at={c} x={[380, 427, 591][i]} y={[688, 116, 116][i]} />
      ))}
      <div
        style={{
          position: "absolute",
          left: x - size.hotX,
          top: y - size.hotY,
          opacity,
          scale: 1 - 0.14 * press,
          transformOrigin: `${size.hotX}px ${size.hotY}px`,
          filter: "drop-shadow(0 2px 2.5px rgba(0,0,0,0.28))",
        }}
      >
        {hand ? <Hand /> : <Arrow />}
      </div>
    </AbsoluteFill>
  );
};
