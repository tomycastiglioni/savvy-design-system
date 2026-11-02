import { ChevronLeft, TrendingUp } from "lucide-react";
import React, { useId } from "react";
import { BUTTON_BG, C, PAD, SAFE_TOP } from "../mobile-prep/layout";
import { HOUSEHOLD } from "./content";

export const Label: React.FC<{ readonly children: React.ReactNode; readonly style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: C.label, ...style }}>{children}</div>
);

export const Card: React.FC<{ readonly children: React.ReactNode; readonly style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      background: C.white,
      border: `1px solid ${C.borderSoft}`,
      borderRadius: 20,
      boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04), 0 10px 28px -14px rgba(16, 24, 40, 0.14)",
      ...style,
    }}
  >
    {children}
  </div>
);

// iOS-style back link to the morning screen.
export const NavBar: React.FC = () => (
  <div style={{ position: "absolute", left: PAD - 8, top: SAFE_TOP + 6, display: "flex", alignItems: "center", gap: 2, color: BUTTON_BG, fontSize: 16.5, fontWeight: 500 }}>
    <ChevronLeft size={24} strokeWidth={2.2} /> {HOUSEHOLD.back}
  </div>
);

export const Up: React.FC<{ readonly children: React.ReactNode; readonly size?: number; readonly style?: React.CSSProperties }> = ({ children, size = 13, style }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "4px 10px",
      borderRadius: 999,
      background: C.green50,
      color: C.green,
      fontSize: size,
      fontWeight: 600,
      ...style,
    }}
  >
    <TrendingUp size={size + 1} strokeWidth={2.4} /> {children}
  </span>
);

// Rising line with a soft area. `build` draws it in from the left, its dot
// riding the tip.
export const Sparkline: React.FC<{ readonly w: number; readonly h: number; readonly build?: number }> = ({ w, h, build = 1 }) => {
  const uid = useId().replace(/:/g, "");
  const pts = Array.from({ length: 41 }, (_, i) => {
    const t = i / 40;
    const v = 0.25 + 0.55 * Math.pow(t, 1.4) + 0.05 * Math.sin(t * 11);
    return [t * w, h - v * h] as const;
  });
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const [tx, ty] = pts[Math.round(build * (pts.length - 1))];
  return (
    <svg width={w} height={h} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={`spark-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.green} stopOpacity={0.16} />
          <stop offset="1" stopColor={C.green} stopOpacity={0} />
        </linearGradient>
        <clipPath id={`draw-${uid}`}>
          <rect x={-4} y={-10} width={w * build + 4} height={h + 20} />
        </clipPath>
      </defs>
      {build > 0 ? (
        <>
          <g clipPath={`url(#draw-${uid})`}>
            <path d={`${line} L${w} ${h} L0 ${h} Z`} fill={`url(#spark-${uid})`} />
            <path d={line} fill="none" stroke={C.green} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <circle cx={tx} cy={ty} r={4.5} fill={C.white} stroke={C.green} strokeWidth={2.5} />
        </>
      ) : null}
    </svg>
  );
};
