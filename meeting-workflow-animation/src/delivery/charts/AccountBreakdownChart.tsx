import React from "react";
import { interpolate } from "remotion";
import { C, CLAMP, EASE_IN_OUT, FONT, SERIES } from "../../shared/theme";
import { sector, stagger } from "./marks";

const SEGMENTS = [
  { label: "Trust (••2985)", value: 5.62e6 },
  { label: "Joint (••8859)", value: 2.81e6 },
  { label: "Retirement", value: 0.93e6 },
];
const TOTAL = SEGMENTS.reduce((s, x) => s + x.value, 0);

// Donut of the household's accounts, swept in clockwise.
export const AccountBreakdownChart: React.FC<{ readonly w: number; readonly h: number; readonly build: number }> = ({ w, h, build }) => {
  const cx = 128;
  const cy = h / 2;
  const r1 = 80;
  const r0 = 58;
  const sweep = interpolate(build, [0, 0.8], [0, 2 * Math.PI], { ...CLAMP, easing: EASE_IN_OUT });
  const start = -Math.PI / 2;

  let acc = 0;
  const arcs = SEGMENTS.map((s, i) => {
    const a0 = start + (acc / TOTAL) * 2 * Math.PI;
    acc += s.value;
    const a1 = start + (acc / TOTAL) * 2 * Math.PI;
    const end = Math.min(a1, start + sweep);
    return end > a0 ? <path key={s.label} d={sector(cx, cy, r0, r1, a0, end)} fill={SERIES[i]} stroke={C.white} strokeWidth={2} /> : null;
  });

  const center = stagger(build, 0, 0, 0.5);

  return (
    <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, fontFamily: FONT.sans }}>
      {arcs}
      <g opacity={center} textAnchor="middle">
        <text x={cx} y={cy + 2} fontSize={22} fontWeight={600} fill={C.ink}>
          $9.36M
        </text>
        <text x={cx} y={cy + 22} fontSize={12} fill={C.muted}>
          Total
        </text>
      </g>
      {SEGMENTS.map((s, i) => {
        const p = stagger(build, i + 1, 0.12, 0.45);
        const ry = cy - 34 + i * 34;
        return (
          <g key={s.label} opacity={p} transform={`translate(${(1 - p) * 8}, 0)`}>
            <rect x={250} y={ry - 9} width={10} height={10} rx={2.5} fill={SERIES[i]} />
            <text x={268} y={ry} fontSize={14} fill={C.body}>
              {s.label}
            </text>
            <text x={w - 26} y={ry} fontSize={14} fontWeight={600} fill={C.ink} textAnchor="end">
              ${(s.value / 1e6).toFixed(2)}M
            </text>
          </g>
        );
      })}
    </svg>
  );
};
