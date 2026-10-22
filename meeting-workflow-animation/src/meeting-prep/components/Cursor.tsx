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
import { C, CLAMP, EASE_IN_OUT, EASE_OUT, REVIEW_BUTTON, TABS, TABS_BAR } from "../theme";
import { T } from "../timeline";

// Supplied cursor SVGs, drawn at 1.5× their 31×33 / 30×32 artboards.
// Hotspots are the arrow tip and the index fingertip.
const SCALE = 1.5;
const ARROW = { src: "images/cursor-arrow.svg", w: 31, h: 33, hotX: 9.15, hotY: 6.03 };
const HAND = { src: "images/cursor-hand.svg", w: 30, h: 32, hotX: 9.4, hotY: 4.4 };

const REVIEW = { x: REVIEW_BUTTON.x + REVIEW_BUTTON.w / 2, y: REVIEW_BUTTON.y + REVIEW_BUTTON.h / 2 + 2 };
const tabCenter = (i: number) => ({ x: TABS_BAR.x + TABS[i].x + TABS[i].w / 2, y: TABS_BAR.y + TABS_BAR.h / 2 + 2 });
const AGENDA_TAB = tabCenter(1);
const TASKS_TAB = tabCenter(2);
const TASK_ROW = { x: 330, y: 330 };

const CLICKS = [
  { at: T.clickReview, ...REVIEW },
  { at: T.clickAgenda, ...AGENDA_TAB },
  { at: T.clickTasks, ...TASKS_TAB },
];

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

export const Cursor: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Path keyframes (seconds → canvas px). Moves between 3.2s and 6.95s happen
  // while the cursor is hidden.
  const keys = [1.6, 2.6, 3.2, 6.95, 7.75, 7.95, 8.9, 9.6, 10.1, 10.75, 11.4].map((s) => s * fps);
  const lin = Easing.linear;
  const easing = [EASE_IN_OUT, lin, lin, EASE_IN_OUT, lin, EASE_IN_OUT, lin, EASE_IN_OUT, lin, EASE_IN_OUT];
  const x = interpolate(
    frame,
    keys,
    [960, REVIEW.x, REVIEW.x, 820, AGENDA_TAB.x, AGENDA_TAB.x, 560, 560, TASKS_TAB.x, TASKS_TAB.x, TASK_ROW.x],
    { ...CLAMP, easing },
  );
  const y = interpolate(
    frame,
    keys,
    [905, REVIEW.y, REVIEW.y, 620, AGENDA_TAB.y, AGENDA_TAB.y, 380, 380, TASKS_TAB.y, TASKS_TAB.y, TASK_ROW.y],
    { ...CLAMP, easing },
  );

  const opacity = interpolate(
    frame,
    [1.6, 1.75, 3.0, 3.2, 6.95, 7.1].map((s) => s * fps),
    [0, 1, 1, 0, 0, 1],
    CLAMP,
  );

  const press = Math.max(
    ...CLICKS.map((c) =>
      interpolate(frame, [(c.at - 0.03) * fps, (c.at + 0.05) * fps, (c.at + 0.18) * fps], [0, 1, 0], CLAMP),
    ),
  );

  const hand = (t >= 2.42 && t < 3.2) || (t >= 7.55 && t < 8.1) || (t >= 9.92 && t < 10.8) || t >= 11.25;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {CLICKS.map((c) => (
        <Ripple key={c.at} at={c.at} x={c.x} y={c.y} />
      ))}
      <div style={{ position: "absolute", left: x, top: y, opacity, scale: 1 - 0.14 * press, transformOrigin: "0px 0px" }}>
        <CursorImage c={ARROW} visible={!hand} />
        <CursorImage c={HAND} visible={hand} />
      </div>
    </AbsoluteFill>
  );
};
