import React from "react";
import { AbsoluteFill, interpolate, spring } from "remotion";
import { C, CLAMP, EASE_IN_OUT, EASE_OUT, FONT, PAD, W } from "../../mobile-prep/layout";
import { Card, Label, NavBar, Sparkline, Up } from "../components";
import { AGENDA, HOUSEHOLD, STATS, TOTAL_M } from "../content";
import { T } from "../timeline";

// Rise into place: fade up from `dist` pt below over `dur` seconds.
const rise = (t: number, at: number, dur = 0.45, dist = 10): React.CSSProperties => {
  const p = interpolate(t, [at, at + dur], [0, 1], { ...CLAMP, easing: EASE_OUT });
  return { opacity: p, translate: `0px ${(1 - p) * dist}px` };
};

// A spring that settles at 1, for pops. Finite past the end so stills work.
const pop = (t: number, at: number, fps: number) =>
  spring({ frame: Math.min(Math.max(0, (t - at) * fps), 600), fps, config: { damping: 12, stiffness: 210 } });

// Option A, the household summary and agenda, at time `t` (seconds; pass
// Infinity for the finished screen). The header rises in, the assets card
// follows, $2.4M counts up while the growth line draws, "+6.1%" pops as the
// number lands, then the agenda fills in top to bottom.
export const HouseholdScreen: React.FC<{ readonly t: number; readonly fps: number }> = ({ t, fps }) => {
  // Ease in and out so the last tenth ($2.3M → $2.4M) ticks over near the end,
  // as the pill pops, rather than settling early.
  const count = interpolate(t, T.count, [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const build = interpolate(t, T.line, [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const pill = pop(t, T.pill, fps);

  return (
    <AbsoluteFill style={{ background: C.panel }}>
      <NavBar />
      <div style={{ position: "absolute", left: PAD, right: PAD, top: 104 }}>
        <Label style={rise(t, T.header)}>Household</Label>
        <div style={{ fontFamily: FONT.serif, fontSize: 36, lineHeight: 1.1, color: C.ink, marginTop: 6, ...rise(t, T.header + 0.05) }}>{HOUSEHOLD.name}</div>
        <div style={{ fontSize: 14, color: C.muted, marginTop: 6, ...rise(t, T.header + 0.1) }}>{HOUSEHOLD.review}</div>
      </div>

      <Card style={{ position: "absolute", left: PAD - 4, right: PAD - 4, top: 222, padding: "18px 20px 20px", overflow: "hidden", ...rise(t, T.card, 0.5, 16) }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: C.muted }}>Total assets</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
          <div style={{ fontSize: 46, fontWeight: 600, letterSpacing: "-0.02em", color: C.ink, fontVariantNumeric: "tabular-nums" }}>
            ${(TOTAL_M * count).toFixed(1)}M
          </div>
          <Up style={{ opacity: interpolate(t, [T.pill, T.pill + 0.1], [0, 1], CLAMP), scale: 0.8 + 0.2 * pill }}>{STATS[1].value}</Up>
        </div>
        <div style={{ marginTop: 14 }}>
          <Sparkline w={W - 2 * (PAD - 4) - 40} h={62} build={build} />
        </div>
      </Card>

      <div style={{ position: "absolute", left: PAD, right: PAD, top: 432 }}>
        <Label style={rise(t, T.agenda)}>Agenda</Label>
      </div>
      <Card style={{ position: "absolute", left: PAD - 4, right: PAD - 4, top: 456, padding: "2px 18px", ...rise(t, T.agenda + 0.03, 0.45, 14) }}>
        {AGENDA.map((item, i) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 14, height: 60, borderTop: i ? `1px solid ${C.borderSoft}` : "none" }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                background: C.green50,
                color: C.green,
                fontSize: 14,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: interpolate(t, [T.rows[i], T.rows[i] + 0.1], [0, 1], CLAMP),
                scale: 0.6 + 0.4 * pop(t, T.rows[i], fps),
              }}
            >
              {i + 1}
            </div>
            <div style={{ fontSize: 17.5, fontWeight: 600, color: C.ink, ...rise(t, T.rows[i] + 0.03, 0.35, 6) }}>{item.label}</div>
          </div>
        ))}
      </Card>
    </AbsoluteFill>
  );
};
