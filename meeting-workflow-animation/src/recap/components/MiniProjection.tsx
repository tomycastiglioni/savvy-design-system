import React from "react";
import { C, CHART, FONT, SERIES } from "../layout";
import { paramsAt, project, YEARS } from "../../delivery/whatif";
import { money } from "../../delivery/charts/marks";

const LINES = [
  { key: "taxable", label: "Taxable", color: SERIES[0] },
  { key: "pretax", label: "Pre-tax", color: SERIES[1] },
  { key: "roth", label: "Roth", color: SERIES[2] },
] as const;

// The Retirement projection from 02 · Delivery (default assumptions), sized for
// the client document. `build` draws it left → right.
export const MiniProjection: React.FC<{ readonly w: number; readonly h: number; readonly build: number }> = ({ w, h, build }) => {
  const L = 46;
  const R = w - 64;
  const TOP = 30;
  const B = h - 24;
  const params = paramsAt(0);
  const samples = Array.from({ length: YEARS * 2 + 1 }, (_, i) => ({ t: i / 2, ...project(params, i / 2) }));
  const yMax = 24e6;
  const x = (t: number) => L + (t / YEARS) * (R - L);
  const y = (v: number) => B - (v / yMax) * (B - TOP);
  const path = (k: (typeof LINES)[number]["key"]) =>
    samples.map((s, i) => `${i ? "L" : "M"}${x(s.t).toFixed(1)},${y(s[k]).toFixed(1)}`).join(" ");
  const last = samples[samples.length - 1];
  const end = Math.max(0, Math.min(1, (build - 0.85) / 0.15));

  return (
    <svg width={w} height={h} style={{ display: "block", fontFamily: FONT.sans }}>
      <defs>
        <clipPath id="mini-projection-draw">
          <rect x={L - 3} y={0} width={build > 0 ? (R - L) * build + 6 : 0} height={h} />
        </clipPath>
      </defs>
      <g fontSize={11} fill={C.body}>
        {LINES.map((l, i) => (
          <g key={l.key} transform={`translate(${L + i * 70}, 10)`}>
            <line x1={0} x2={12} y1={-3.5} y2={-3.5} stroke={l.color} strokeWidth={2.5} strokeLinecap="round" />
            <text x={17} y={0}>
              {l.label}
            </text>
          </g>
        ))}
      </g>
      {[0, 0.5, 1].map((f) => (
        <g key={f}>
          <line x1={L} x2={R} y1={y(yMax * f)} y2={y(yMax * f)} stroke={CHART.grid} strokeDasharray={f ? "3 4" : undefined} />
          <text x={L - 8} y={y(yMax * f) + 4} fontSize={10.5} fill={C.muted} textAnchor="end">
            {money(yMax * f)}
          </text>
        </g>
      ))}
      {[2026, 2037, 2048].map((yr) => (
        <text key={yr} x={x(yr - 2026)} y={B + 17} fontSize={10.5} fill={C.muted} textAnchor="middle">
          {yr}
        </text>
      ))}
      <g clipPath="url(#mini-projection-draw)" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {[...LINES].reverse().map((l) => (
          <path key={l.key} d={path(l.key)} stroke={l.color} strokeWidth={2} />
        ))}
      </g>
      <g opacity={end}>
        <circle cx={x(YEARS)} cy={y(last.taxable)} r={4.5} fill={SERIES[0]} stroke={C.white} strokeWidth={2} />
        <text x={x(YEARS) + 9} y={y(last.taxable) + 4} fontSize={12} fontWeight={600} fill={C.ink}>
          {money(last.taxable)}
        </text>
      </g>
    </svg>
  );
};
