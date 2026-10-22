import React from "react";
import { C, CHART, FONT, SERIES } from "../../shared/theme";
import { hBar, stagger } from "./marks";

const ROWS = [
  { label: "US equity", current: 62, target: 55 },
  { label: "International", current: 18, target: 20 },
  { label: "Fixed income", current: 15, target: 22 },
  { label: "Cash", current: 5, target: 3 },
];
const X_MAX = 70;

// Current allocation (bars) against the target mix (ticks).
export const AllocationChart: React.FC<{ readonly w: number; readonly h: number; readonly build: number }> = ({ w, h, build }) => {
  const x0 = 130;
  const x1 = w - 72; // leaves a right-aligned column for the values
  const top = 50;
  const rowH = (h - top - 18) / ROWS.length;
  const barH = 14;
  const x = (v: number) => (v / X_MAX) * (x1 - x0);
  const axis = stagger(build, 0, 0, 0.3);

  return (
    <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, fontFamily: FONT.sans }}>
      <g opacity={axis}>
        <line x1={x0} x2={x0} y1={top - 6} y2={top + rowH * ROWS.length - 10} stroke={CHART.axis} strokeWidth={1} />
        <g transform="translate(18, 22)" fontSize={11.5} fill={C.body}>
          <rect x={0} y={-8} width={14} height={9} rx={2} fill={SERIES[0]} />
          <text x={20} y={0}>Current</text>
          <line x1={78} x2={78} y1={-10} y2={3} stroke={C.ink} strokeWidth={2} />
          <text x={86} y={0}>Target</text>
        </g>
      </g>
      {ROWS.map((r, i) => {
        const p = stagger(build, i, 0.1, 0.55);
        const tick = stagger(build, i + 3, 0.1, 0.3);
        const cy = top + i * rowH + rowH / 2 - 6;
        return (
          <g key={r.label}>
            <text x={18} y={cy + 4.5} fontSize={13} fill={C.body} opacity={axis}>
              {r.label}
            </text>
            <path d={hBar(x0, cy - barH / 2, x(r.current) * p, barH)} fill={SERIES[0]} />
            <text x={w - 20} y={cy + 4.5} fontSize={13} fontWeight={600} fill={C.ink} textAnchor="end" opacity={p}>
              {r.current}%
            </text>
            <line
              x1={x0 + x(r.target)}
              x2={x0 + x(r.target)}
              y1={cy - 12}
              y2={cy + 12}
              stroke={C.ink}
              strokeWidth={2}
              strokeLinecap="round"
              opacity={tick}
            />
          </g>
        );
      })}
    </svg>
  );
};
