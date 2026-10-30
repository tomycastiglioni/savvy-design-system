import React from "react";
import { C, FONT } from "../theme";

// Abstract projection: one curve, soft area, three faint gridlines, an end
// value. `growth` bends the curve up; `ghost` dashes an earlier curve.
export const AbstractChart: React.FC<{
  readonly w: number;
  readonly h: number;
  readonly color: string;
  readonly growth?: number;
  readonly ghost?: number;
  readonly endLabel?: string;
  readonly years?: boolean;
}> = ({ w, h, color, growth = 1, ghost, endLabel, years = false }) => {
  const pad = { l: 8, r: endLabel ? 120 : 16, t: 18, b: years ? 34 : 10 };
  const pw = w - pad.l - pad.r;
  const ph = h - pad.t - pad.b;
  const curve = (g: number) =>
    Array.from({ length: 61 }, (_, i) => {
      const t = i / 60;
      const v = 0.22 + 0.62 * g * Math.pow(t, 1.6);
      return [pad.l + t * pw, pad.t + ph * (1 - Math.min(v, 1))] as const;
    });
  const pts = curve(growth);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const [ex, ey] = pts[pts.length - 1];
  const id = `area-${color.slice(1)}-${Math.round(growth * 100)}`;

  return (
    <svg width={w} height={h} style={{ display: "block", overflow: "visible", fontFamily: FONT.sans }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity={0.2} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {[0, 1, 2].map((i) => (
        <line key={i} x1={pad.l} x2={pad.l + pw} y1={pad.t + (ph * i) / 3} y2={pad.t + (ph * i) / 3} stroke="#EEF0F3" strokeWidth={1.5} />
      ))}
      <line x1={pad.l} x2={pad.l + pw} y1={pad.t + ph} y2={pad.t + ph} stroke="#DDE1E6" strokeWidth={1.5} />
      {ghost !== undefined ? (
        <path
          d={curve(ghost)
            .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`)
            .join(" ")}
          fill="none"
          stroke={color}
          strokeOpacity={0.35}
          strokeWidth={3}
          strokeDasharray="8 8"
        />
      ) : null}
      <path d={`${d} L${ex} ${pad.t + ph} L${pad.l} ${pad.t + ph} Z`} fill={`url(#${id})`} />
      <path d={d} fill="none" stroke={color} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={ex} cy={ey} r={8} fill={C.white} stroke={color} strokeWidth={4} />
      {endLabel ? (
        <g transform={`translate(${ex + 16}, ${ey - 20})`}>
          <rect width={98} height={40} rx={10} fill={color} />
          <text x={49} y={27} textAnchor="middle" fontSize={19} fontWeight={600} fill={C.white}>
            {endLabel}
          </text>
        </g>
      ) : null}
      {years ? (
        <g fontSize={15} fill={C.faint}>
          <text x={pad.l} y={h - 6}>
            2026
          </text>
          <text x={pad.l + pw} y={h - 6} textAnchor="end">
            2048
          </text>
        </g>
      ) : null}
    </svg>
  );
};
