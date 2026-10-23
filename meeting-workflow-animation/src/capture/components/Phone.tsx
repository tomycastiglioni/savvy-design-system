import React from "react";
import { BEZEL, M, Rect } from "../layout";

const SignalIcon: React.FC = () => (
  <svg width={17} height={11} viewBox="0 0 17 11">
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={i * 4.4} y={8 - i * 2.6} width={3} height={3 + i * 2.6} rx={0.8} fill="#111111" />
    ))}
  </svg>
);

const BatteryIcon: React.FC = () => (
  <svg width={25} height={12} viewBox="0 0 25 12">
    <rect x={0.6} y={0.6} width={21} height={10.8} rx={3.2} fill="none" stroke="#111111" strokeOpacity={0.4} strokeWidth={1.1} />
    <rect x={2.2} y={2.2} width={14} height={7.6} rx={1.8} fill="#111111" />
    <rect x={22.6} y={3.8} width={1.8} height={4.4} rx={0.9} fill="#111111" fillOpacity={0.4} />
  </svg>
);

// Side buttons as fractions of the frame height, so they track the frame as it grows.
const BUTTONS = [
  { side: "left", at: 0.175, len: 0.039 },
  { side: "left", at: 0.242, len: 0.07 },
  { side: "left", at: 0.327, len: 0.07 },
  { side: "right", at: 0.294, len: 0.108 },
] as const;

// Vector iPhone. `screen` is the screen rect; the frame is drawn around it so
// the whole phone can grow. `frame` fades the hardware, `chrome` the island and
// status bar.
export const Phone: React.FC<{
  readonly screen: Rect;
  readonly radius: number;
  readonly frame?: number;
  readonly chrome?: number;
  readonly screenStyle?: React.CSSProperties;
  readonly children?: React.ReactNode;
}> = ({ screen, radius, frame = 1, chrome = 1, screenStyle, children }) => {
  const outer = { x: screen.x - BEZEL, y: screen.y - BEZEL, w: screen.w + 2 * BEZEL, h: screen.h + 2 * BEZEL };

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: outer.x,
          top: outer.y,
          width: outer.w,
          height: outer.h,
          opacity: frame,
        }}
      >
        {BUTTONS.map((b) => (
          <div
            key={`${b.side}${b.at}`}
            style={{
              position: "absolute",
              left: b.side === "left" ? -3.5 : outer.w - 0.5,
              top: outer.h * b.at,
              width: 4,
              height: outer.h * b.len,
              borderRadius: 2,
              background: "linear-gradient(90deg, #5E7282, #A9BCCB 55%, #6A8294)",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: radius + BEZEL,
            background: `linear-gradient(140deg, #9AA8B2 0%, ${M.titanium} 22%, #4F5B64 50%, #7F8D97 78%, #56626B 100%)`,
            boxShadow: "0 40px 80px -30px rgba(16, 24, 40, 0.35), 0 8px 20px -10px rgba(16, 24, 40, 0.2)",
          }}
        />
        <div style={{ position: "absolute", inset: 2.5, borderRadius: radius + BEZEL - 2.5, background: "#0A0A0A" }} />
      </div>

      <div
        style={{
          position: "absolute",
          left: screen.x,
          top: screen.y,
          width: screen.w,
          height: screen.h,
          borderRadius: radius,
          overflow: "hidden",
          background: "#FFFFFF",
          ...screenStyle,
        }}
      >
        {children}
        <div style={{ position: "absolute", inset: 0, opacity: chrome, pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 30, top: 16, fontSize: 15.5, fontWeight: 600, color: "#111111", letterSpacing: "-0.01em" }}>9:32</div>
          <div
            style={{
              position: "absolute",
              left: screen.w / 2 - 52,
              top: 11,
              width: 104,
              height: 30,
              borderRadius: 15,
              background: "#050505",
            }}
          >
            <div style={{ position: "absolute", right: 12, top: 10, width: 10, height: 10, borderRadius: 5, background: "#141A26" }} />
          </div>
          <div style={{ position: "absolute", right: 24, top: 18, display: "flex", alignItems: "center", gap: 6 }}>
            <SignalIcon />
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111111" }}>5G</span>
            <BatteryIcon />
          </div>
        </div>
      </div>
    </>
  );
};
