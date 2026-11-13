import React from "react";
import { IOS, SAFE_TOP, W } from "../layout";

const Signal: React.FC<{ readonly c?: string }> = ({ c = IOS.label }) => (
  <svg width={17} height={11} viewBox="0 0 17 11">
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={i * 4.6} y={7.6 - i * 2.4} width={3.2} height={3.4 + i * 2.4} rx={0.9} fill={c} />
    ))}
  </svg>
);

const Wifi: React.FC<{ readonly c?: string }> = ({ c = IOS.label }) => (
  <svg width={15} height={11} viewBox="0 0 15 11">
    <path d="M7.5 2.3c2.1 0 4 .8 5.5 2.1l1.1-1.1C12.3 1.7 10 .8 7.5.8S2.7 1.7.9 3.3L2 4.4c1.5-1.3 3.4-2.1 5.5-2.1Z" fill={c} />
    <path d="M7.5 5.4c1.2 0 2.3.4 3.2 1.2l1.1-1.1C10.6 4.5 9.1 3.9 7.5 3.9s-3.1.6-4.3 1.6l1.1 1.1c.9-.8 2-1.2 3.2-1.2Z" fill={c} />
    <path d="M7.5 8.5c.4 0 .7.1 1 .4L7.5 10 6.5 8.9c.3-.3.6-.4 1-.4Z M7.5 7c-.8 0-1.6.3-2.1.8l2.1 2.2 2.1-2.2c-.5-.5-1.3-.8-2.1-.8Z" fill={c} />
  </svg>
);

const Battery: React.FC<{ readonly c?: string }> = ({ c = IOS.label }) => (
  <svg width={26} height={12} viewBox="0 0 26 12">
    <rect x={0.5} y={0.5} width={22} height={11} rx={3.4} fill="none" stroke={c} strokeOpacity={0.35} />
    <rect x={2} y={2} width={17} height={8} rx={2} fill={c} />
    <path d="M24 4v4c.8-.3 1.3-1.1 1.3-2S24.8 4.3 24 4Z" fill={c} fillOpacity={0.4} />
  </svg>
);

// iOS status bar as it appears in a screen recording: no notch or island,
// just the time and the right-hand indicators.
// `time` and `light` (white, for dark screens) are optional.
export const StatusBar: React.FC<{ readonly time?: string; readonly light?: boolean }> = ({ time = "9:41", light = false }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: W, height: SAFE_TOP, fontFamily: IOS.font, pointerEvents: "none" }}>
    <div
      style={{
        position: "absolute",
        left: 0,
        width: 104,
        top: 15,
        textAlign: "center",
        fontSize: 16.5,
        lineHeight: "20px",
        fontWeight: 600,
        letterSpacing: "-0.01em",
        color: light ? "#ffffff" : IOS.label,
      }}
    >
      {time}
    </div>
    <div style={{ position: "absolute", right: 22, top: 19, display: "flex", alignItems: "center", gap: 5 }}>
      <Signal c={light ? "#ffffff" : IOS.label} />
      <Wifi c={light ? "#ffffff" : IOS.label} />
      <Battery c={light ? "#ffffff" : IOS.label} />
    </div>
  </div>
);

export const HomeIndicator: React.FC<{ readonly light?: boolean }> = ({ light = false }) => (
  <div
    style={{
      position: "absolute",
      left: (W - 134) / 2,
      bottom: 8,
      width: 134,
      height: 5,
      borderRadius: 3,
      background: light ? "#ffffff" : IOS.label,
    }}
  />
);
