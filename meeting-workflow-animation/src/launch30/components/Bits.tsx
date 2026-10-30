import { Users } from "lucide-react";
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { BAR, BgName, bgGradient, C, CARD_SHADOW, CY, DIATYPE, HOUSEHOLD, MEETING } from "../theme";

export const Bg: React.FC<{ readonly bg: BgName | string }> = ({ bg }) => (
  <AbsoluteFill style={{ background: bg in { cream: 1, mint: 1, gold: 1, blue: 1 } ? bgGradient(bg as BgName) : bg }} />
);

// Mid-transition background: `from` on the left, `to` sweeping in from the right.
export const BgSweep: React.FC<{ readonly from: BgName; readonly to: BgName; readonly at?: number }> = ({ from, to, at = 0.62 }) => (
  <>
    <Bg bg={from} />
    <AbsoluteFill
      style={{
        background: bgGradient(to),
        maskImage: `linear-gradient(90deg, transparent ${at * 100 - 18}%, #000 ${at * 100 + 18}%)`,
      }}
    />
  </>
);

// A line of placeholder copy.
export const Bar: React.FC<{ readonly w: number | string; readonly h?: number; readonly strong?: boolean; readonly style?: React.CSSProperties }> = ({
  w,
  h = 12,
  strong = false,
  style,
}) => <div style={{ width: w, height: h, borderRadius: h / 2, background: strong ? BAR.strong : BAR.color, ...style }} />;

export const Card: React.FC<{ readonly style?: React.CSSProperties; readonly children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ position: "absolute", background: C.white, borderRadius: 22, boxShadow: CARD_SHADOW, overflow: "hidden", ...style }}>{children}</div>
);

// The household the video follows, tagged on every screen.
export const HouseholdChip: React.FC<{ readonly meeting?: boolean; readonly size?: number; readonly style?: React.CSSProperties }> = ({
  meeting = true,
  size = 17,
  style,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.5,
      padding: `${size * 0.35}px ${size * 0.8}px ${size * 0.35}px ${size * 0.35}px`,
      borderRadius: 999,
      background: "#F1F3F5",
      fontSize: size,
      fontWeight: 500,
      color: C.ink,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    <div
      style={{
        width: size * 1.6,
        height: size * 1.6,
        borderRadius: "50%",
        background: C.green100,
        color: C.green,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Users size={size * 0.9} strokeWidth={2.2} />
    </div>
    {HOUSEHOLD}
    {meeting ? <span style={{ color: C.muted, fontWeight: 400 }}>· {MEETING}</span> : null}
  </div>
);

// Small uppercase section label inside abstract cards.
export const Label: React.FC<{ readonly children: React.ReactNode; readonly style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: C.label, ...style }}>{children}</div>
);

// Diatype metrics: cap top sits 0.395em above the middle of a line box.
export const lineTop = (capTop: number, size: number, lh: number) => capTop - lh / 2 + 0.395 * size;
// Headlines: 110% leading and -1.5% tracking (a touch tighter than the 44 s cut).
export const HEAD = { size: 79.6, lh: 79.6 * 1.1, tracking: "-0.015em" };
const EYEBROW = { size: 21, lh: 24, gap: 88 };

// Chapter headline: eyebrow (the workflow) and two lines of Diatype, centred
// on `cy`, in the left column. `lineStyle(i)` animates each line (0 is the
// eyebrow); static by default.
export const Headline: React.FC<{
  readonly eyebrow: string;
  readonly color: string;
  readonly lines: readonly string[];
  readonly x?: number;
  readonly cy?: number;
  readonly lineStyle?: (i: number) => React.CSSProperties;
}> = ({ eyebrow, color, lines, x = 174, cy = CY, lineStyle = () => ({}) }) => {
  const block = EYEBROW.gap + (lines.length - 1) * HEAD.lh + 0.7 * HEAD.size;
  const top0 = cy - block / 2;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: DIATYPE, whiteSpace: "nowrap" }}>
      <div
        style={{
          position: "absolute",
          left: x,
          top: lineTop(top0, EYEBROW.size, EYEBROW.lh),
          fontSize: EYEBROW.size,
          lineHeight: `${EYEBROW.lh}px`,
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color,
          ...lineStyle(0),
        }}
      >
        {eyebrow}
      </div>
      {lines.map((line, i) => (
        <div
          key={line}
          style={{
            position: "absolute",
            left: x,
            top: lineTop(top0 + EYEBROW.gap + i * HEAD.lh, HEAD.size, HEAD.lh),
            fontSize: HEAD.size,
            lineHeight: `${HEAD.lh}px`,
            letterSpacing: HEAD.tracking,
            color: "#000000",
            ...lineStyle(i + 1),
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};

// The supplied cursors at the launch video's size (1.5 × 1.3), placed by
// their hotspot (arrow tip / index fingertip). Only where the advisor acts.
const CURSORS = {
  arrow: { src: "images/cursor-arrow.svg", w: 31, h: 33, hotX: 9.15, hotY: 6.03 },
  hand: { src: "images/cursor-hand.svg", w: 30, h: 32, hotX: 9.4, hotY: 4.4 },
};
export const CURSOR_SCALE = 1.95;
export const Cursor: React.FC<{ readonly x: number; readonly y: number; readonly kind?: keyof typeof CURSORS }> = ({ x, y, kind = "hand" }) => {
  const c = CURSORS[kind];
  return (
    <Img
      src={staticFile(c.src)}
      style={{ position: "absolute", left: x - c.hotX * CURSOR_SCALE, top: y - c.hotY * CURSOR_SCALE, width: c.w * CURSOR_SCALE, height: c.h * CURSOR_SCALE }}
    />
  );
};

// The 44 s cut's title metrics: Diatype 78.5px, -2% tracking.
export const TITLE = { size: 78.5, lh: 79.6 * 1.15, tracking: "-0.02em" };

// One centred line of Diatype with its cap top at `capTop`. Children are the
// line's parts (spans), so each can animate on its own and still land in its
// place in the finished line.
export const CenteredLine: React.FC<{
  readonly capTop: number;
  readonly size?: number;
  readonly tracking?: string;
  readonly children: React.ReactNode;
}> = ({ capTop, size = HEAD.size, tracking = HEAD.tracking, children }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: lineTop(capTop, size, HEAD.lh),
      display: "flex",
      justifyContent: "center",
      gap: size * 0.26,
      fontFamily: DIATYPE,
      fontSize: size,
      lineHeight: `${HEAD.lh}px`,
      letterSpacing: tracking,
      color: "#000000",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);
