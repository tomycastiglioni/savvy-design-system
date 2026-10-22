import React from "react";
import { C, CARD_HEADER_H, CHART, FONT, SERIES } from "../layout";
import { Params, project, START_YEAR, YEARS } from "../whatif";
import { money } from "./marks";

const lerp = (a: number, b: number, m: number) => a + (b - a) * m;

const LINES = [
  { key: "taxable", label: "Taxable", color: SERIES[0] },
  { key: "pretax", label: "Pre-tax", color: SERIES[1] },
  { key: "roth", label: "Roth", color: SERIES[2] },
] as const;

const COMPACT_YEARS = [2026, 2030, 2034, 2038, 2042, 2046];
const PRESENT_YEARS = Array.from({ length: 12 }, (_, i) => START_YEAR + i * 2);

// `m` morphs the layout from the compact card (0) to presentation mode (1).
// `build` draws the lines left → right. Everything reflows to w × h each frame.
export const RetirementChart: React.FC<{
  readonly w: number;
  readonly h: number;
  readonly m: number;
  readonly build: number;
  readonly axis: number;
  readonly params: Params;
  readonly legend: number;
  readonly endLabel: number;
}> = ({ w, h, m, build, axis, params, legend, endLabel }) => {
  const L = lerp(54, 88, m);
  const R = w - lerp(18, 44, m);
  const TOP = lerp(CARD_HEADER_H + 34, 150, m);
  const B = h - lerp(30, 84, m);
  const fs = lerp(11, 13, m);
  const pw = R - L;
  const ph = B - TOP;

  const samples = Array.from({ length: YEARS * 4 + 1 }, (_, i) => {
    const t = i / 4;
    return { t, ...project(params, t) };
  });
  const last = samples[samples.length - 1];
  const yMax = Math.max(24e6, last.taxable * 1.06);
  const x = (t: number) => L + (t / YEARS) * pw;
  const y = (v: number) => B - (v / yMax) * ph;
  const path = (k: (typeof LINES)[number]["key"]) =>
    samples.map((s, i) => `${i ? "L" : "M"}${x(s.t).toFixed(2)},${y(s[k]).toFixed(2)}`).join(" ");

  const endX = x(YEARS);
  const endY = y(last.taxable);

  return (
    <>
      <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, fontFamily: FONT.sans }}>
        <defs>
          <clipPath id="retirement-draw">
            <rect x={L - 4} y={0} width={build > 0 ? pw * build + 8 : 0} height={h} />
          </clipPath>
        </defs>

        <g opacity={axis}>
          {[0, 0.25, 0.5, 0.75, 1].map((f) => (
            <g key={f}>
              <line x1={L} x2={R} y1={y(yMax * f)} y2={y(yMax * f)} stroke={CHART.grid} strokeDasharray={f ? "3 4" : undefined} />
              <text x={L - 10} y={y(yMax * f) + fs * 0.35} fontSize={fs} fill={C.muted} textAnchor="end">
                {money(yMax * f)}
              </text>
            </g>
          ))}
          <g opacity={m}>
            {PRESENT_YEARS.map((yr) => (
              <g key={yr}>
                <line x1={x(yr - START_YEAR)} x2={x(yr - START_YEAR)} y1={TOP} y2={B} stroke={CHART.grid} strokeDasharray="2 4" />
                <text x={x(yr - START_YEAR)} y={B + 22} fontSize={fs} fill={C.muted} textAnchor="middle">
                  {yr}
                </text>
              </g>
            ))}
          </g>
          <g opacity={1 - m}>
            {COMPACT_YEARS.map((yr) => (
              <text key={yr} x={x(yr - START_YEAR)} y={B + 19} fontSize={fs} fill={C.muted} textAnchor="middle">
                {yr}
              </text>
            ))}
          </g>
          {/* Compact legend, top-left of the plot */}
          <g opacity={1 - m} transform={`translate(${L}, ${CARD_HEADER_H + 20})`} fontSize={11.5} fill={C.body}>
            {LINES.map((l, i) => (
              <g key={l.key} transform={`translate(${i * 74}, 0)`}>
                <line x1={0} x2={14} y1={-4} y2={-4} stroke={l.color} strokeWidth={2.5} strokeLinecap="round" />
                <text x={19} y={0}>
                  {l.label}
                </text>
              </g>
            ))}
          </g>
        </g>

        <g clipPath="url(#retirement-draw)" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {[...LINES].reverse().map((l) => (
            <path key={l.key} d={path(l.key)} stroke={l.color} strokeWidth={lerp(2, 2.5, m)} />
          ))}
        </g>

        <circle cx={endX} cy={endY} r={5.5} fill={SERIES[0]} stroke={C.white} strokeWidth={2.5} opacity={endLabel} />
      </svg>

      {/* Live end value */}
      <div
        style={{
          position: "absolute",
          right: w - endX + 14,
          top: endY - 42,
          padding: "4px 9px",
          borderRadius: 7,
          border: `1px solid ${C.statsBorder}`,
          background: C.white,
          boxShadow: "0 2px 6px rgba(16, 24, 40, 0.06)",
          fontSize: 15,
          fontWeight: 600,
          color: C.ink,
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
          opacity: endLabel,
        }}
      >
        {money(last.taxable)} <span style={{ fontWeight: 400, color: C.muted }}>in 2048</span>
      </div>

      {/* Presentation legend */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: h - 46,
          display: "flex",
          justifyContent: "center",
          gap: 26,
          fontSize: 13.5,
          color: C.body,
          opacity: legend,
        }}
      >
        {LINES.map((l) => (
          <div key={l.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 18, height: 2.5, borderRadius: 2, background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>
    </>
  );
};
