import React from "react";
import { interpolate } from "remotion";
import { CLAMP, DIATYPE, EASE_IN_OUT, EASE_OUT, HEADLINE } from "../theme";
import { useT } from "../timeline";

// Diatype metrics (per em): the cap top sits 0.395em above the middle of a
// line box, so a line whose cap top is at Y starts at Y − lh/2 + 0.395·size.
const lineTop = (capTop: number, size: number, lh: number) =>
  capTop - lh / 2 + 0.395 * size;

const EYEBROW = { size: 21, lh: 24, tracking: "0.04em" };
const EYEBROW_GAP = 88; // eyebrow cap top → first headline cap top
const STORYBOARD_LH = 96;

// Chapter headline: small uppercase eyebrow, then 2–3 lines of Diatype.
// Lines rise in one after another at `inAt`, and leave together at `outAt`.
export const Headline: React.FC<{
  readonly eyebrow?: string;
  readonly color?: string;
  readonly lines: readonly string[];
  readonly x: number;
  readonly capTop?: number; // eyebrow cap top; defaults to the keyframes' block position
  readonly align?: "left" | "center";
  readonly inAt: number;
  readonly outAt: number;
}> = ({ eyebrow, color, lines, x, capTop, align = "left", inAt, outAt }) => {
  const t = useT();
  if (t < inAt || t > outAt + 0.5) {
    return null;
  }
  // Block positions come from the storyboard frames, set at 96px leading;
  // tighter leading pulls the lines in toward the same center.
  const top0 =
    (capTop ?? 397 - 48 * (lines.length - 2)) +
    ((STORYBOARD_LH - HEADLINE.lh) * (lines.length - 1)) / 2;
  const out = interpolate(t, [outAt, outAt + 0.4], [0, 1], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const item = (i: number): React.CSSProperties => {
    const p = interpolate(t, [inAt + i * 0.08, inAt + i * 0.08 + 0.7], [0, 1], {
      ...CLAMP,
      easing: EASE_OUT,
    });
    return {
      opacity: p * (1 - out),
      translate: `0px ${(1 - p) * 28 - out * 14}px`,
      filter: p < 1 || out > 0 ? `blur(${(1 - p) * 6 + out * 4}px)` : undefined,
    };
  };
  const pos = (top: number): React.CSSProperties =>
    align === "center"
      ? { position: "absolute", left: 0, width: 1920, top, textAlign: "center" }
      : { position: "absolute", left: x, top };
  const headTop = eyebrow ? top0 + EYEBROW_GAP : top0;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        fontFamily: DIATYPE,
        whiteSpace: "nowrap",
      }}
    >
      {eyebrow ? (
        <div
          style={{
            ...pos(lineTop(top0, EYEBROW.size, EYEBROW.lh)),
            fontSize: EYEBROW.size,
            lineHeight: `${EYEBROW.lh}px`,
            fontWeight: 700,
            letterSpacing: EYEBROW.tracking,
            textTransform: "uppercase",
            color,
            ...item(0),
          }}
        >
          {eyebrow}
        </div>
      ) : null}
      {lines.map((line, i) => (
        <div
          key={line}
          style={{
            ...pos(
              lineTop(headTop + i * HEADLINE.lh, HEADLINE.size, HEADLINE.lh),
            ),
            fontSize: HEADLINE.size,
            lineHeight: `${HEADLINE.lh}px`,
            color: HEADLINE.color,
            ...item(i + 1),
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};
