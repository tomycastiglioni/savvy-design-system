import React from "react";
import { C, CHART, FONT, SERIES } from "../../shared/theme";
import { money, stagger, vBar } from "./marks";

const GROUPS = ["None", "+$25K", "+$50K", "+$75K", "+$100K"];
const INCOME = [780e3, 805e3, 830e3, 855e3, 880e3];
const TAX = [300e3, 310e3, 322e3, 334e3, 346e3];
const Y_MAX = 1.2e6;
const BRACKET = 650e3;

// Taxable income vs. federal tax for each Roth conversion amount.
export const TaxBracketChart: React.FC<{ readonly w: number; readonly h: number; readonly build: number }> = ({ w, h, build }) => {
  const L = 56;
  const R = 16;
  const TOP = 34;
  const B = 30;
  const pw = w - L - R;
  const ph = h - TOP - B;
  const base = TOP + ph;
  const y = (v: number) => base - (v / Y_MAX) * ph;
  const gw = pw / GROUPS.length;
  const bw = Math.min(24, gw * 0.3);
  const axis = stagger(build, 0, 0, 0.3);

  return (
    <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, fontFamily: FONT.sans }}>
      <g opacity={axis}>
        {[0, 0.3e6, 0.6e6, 0.9e6, 1.2e6].map((v) => (
          <g key={v}>
            <line x1={L} x2={w - R} y1={y(v)} y2={y(v)} stroke={CHART.grid} strokeDasharray={v ? "3 4" : undefined} />
            <text x={L - 8} y={y(v) + 4} fontSize={11} fill={C.muted} textAnchor="end">
              {money(v)}
            </text>
          </g>
        ))}
        {GROUPS.map((g, i) => (
          <text key={g} x={L + (i + 0.5) * gw} y={base + 19} fontSize={11} fill={C.muted} textAnchor="middle">
            {g}
          </text>
        ))}
        {/* Legend */}
        <g transform={`translate(${L}, 12)`} fontSize={11.5} fill={C.body}>
          <rect x={0} y={-8} width={9} height={9} rx={2} fill={SERIES[0]} />
          <text x={14} y={0}>Income</text>
          <rect x={66} y={-8} width={9} height={9} rx={2} fill={SERIES[1]} />
          <text x={80} y={0}>Tax</text>
          <line x1={112} x2={130} y1={-3.5} y2={-3.5} stroke={SERIES[2]} strokeWidth={1.5} strokeDasharray="4 3" />
          <text x={135} y={0}>37% bracket</text>
        </g>
      </g>

      {GROUPS.map((g, i) => {
        const p = stagger(build, i, 0.08, 0.55);
        const cx = L + (i + 0.5) * gw;
        return (
          <g key={g}>
            <path d={vBar(cx - bw - 1, base - (base - y(INCOME[i])) * p, bw, base)} fill={SERIES[0]} />
            <path d={vBar(cx + 1, base - (base - y(TAX[i])) * p, bw, base)} fill={SERIES[1]} />
          </g>
        );
      })}

      <line
        x1={L}
        x2={L + (w - R - L) * stagger(build, 4, 0.08, 0.5)}
        y1={y(BRACKET)}
        y2={y(BRACKET)}
        stroke={SERIES[2]}
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />
    </svg>
  );
};
