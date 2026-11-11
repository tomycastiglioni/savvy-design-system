import React from "react";
import { Pill, Pointer } from "../../more-ways/Bits";
import { C, MEDIUM } from "../../more-ways/theme";
import { c01, Frame, Head, Label, MarkAvatar, Panel, Switch } from "../Bits";

// Financial planning scenarios. The Chans' retirement plan; scenarios switch
// on and the projection and its numbers move with them: retiring at 63
// costs some confidence, saving $15K more a year wins it back and then some.
export type ScenarioState = {
  readonly retire?: number; // 0–1 "Retire at 63"
  readonly save?: number; // 0–1 "Save $15K more"
  readonly pointer?: { x: number; y: number; o: number };
};

const CH = { x: 20, y: 84, w: 346, h: 150 }; // the chart, card px
const ROWS = { x: 386, top: 98, h: 52, gap: 8, w: 174 };
const SCENARIOS = [
  { title: "Retire at 63", sub: "2 years earlier" },
  { title: "Save $15K more", sub: "per year, until retiring" },
  { title: "Market dip", sub: "−20% next year" },
];
export const toggleAt = (i: number) => ({ x: 20 + ROWS.x + ROWS.w - 26, y: 14 + ROWS.top + i * (ROWS.h + ROWS.gap) + ROWS.h / 2 }); // frame px

// the projection: value over time for a growth factor
const path = (g: number) => {
  const pts = Array.from({ length: 33 }, (_, i) => {
    const p = i / 32;
    const v = 0.12 + g * (0.35 * p + 0.65 * p ** 2.1);
    return `${(CH.x + p * CH.w).toFixed(1)},${(CH.y + CH.h * (1 - v)).toFixed(1)}`;
  });
  return `M ${pts.join(" L ")}`;
};

export const Scenarios: React.FC<{ readonly s: ScenarioState }> = ({ s }) => {
  const { retire = 0, save = 0, pointer } = s;
  const active = c01(retire + save);
  const g = 0.72 - 0.2 * retire + 0.26 * save;
  const success = Math.round(82 - 11 * retire + 17 * save);
  const at90 = (4.1 - 0.9 * retire + 0.8 * save).toFixed(1);
  const delta = success - 82;
  const endY = CH.y + CH.h * (1 - (0.12 + g));
  return (
    <Frame>
      <Panel>
        <Head
          lead={<MarkAvatar />}
          title="Retirement plan"
          sub="Allison & Frank Chan · Scenario modeling"
          right={
            <div style={{ display: "flex", gap: 12, fontSize: 10, color: C.muted, marginTop: 6 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, opacity: active }}>
                <span style={{ width: 14, borderTop: "1.6px dashed #b8c0c9" }} /> Current plan
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 14, height: 2, background: C.green2, borderRadius: 1 }} /> {active > 0.5 ? "Scenario" : "Projection"}
              </span>
            </div>
          }
        />
        {/* the projection */}
        <svg width={580} height={332} style={{ position: "absolute", inset: 0 }}>
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={CH.x} x2={CH.x + CH.w} y1={CH.y + (CH.h * i) / 3} y2={CH.y + (CH.h * i) / 3} stroke="#eef0f2" strokeWidth={1} />
          ))}
          <defs>
            <linearGradient id="sc-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="rgba(8,107,78,0.16)" />
              <stop offset="1" stopColor="rgba(8,107,78,0)" />
            </linearGradient>
          </defs>
          <path d={`${path(g)} L ${CH.x + CH.w},${CH.y + CH.h} L ${CH.x},${CH.y + CH.h} Z`} fill="url(#sc-fill)" />
          <path d={path(0.72)} fill="none" stroke="#b8c0c9" strokeWidth={1.6} strokeDasharray="4 4" opacity={active} />
          <path d={path(g)} fill="none" stroke={C.green2} strokeWidth={2.4} strokeLinecap="round" />
          <circle cx={CH.x + CH.w} cy={endY} r={4.5} fill="#ffffff" stroke={C.green2} strokeWidth={2} />
        </svg>
        <div style={{ position: "absolute", left: CH.x + CH.w - 64, top: endY - 30, padding: "3px 7px", borderRadius: 5, background: C.green, color: "#ffffff", fontWeight: MEDIUM, fontSize: 10.5 }}>
          ${at90}M
        </div>
        <div style={{ position: "absolute", left: CH.x, top: CH.y + CH.h + 6, width: CH.w, display: "flex", justifyContent: "space-between", fontSize: 9.5, color: C.muted }}>
          <span>Today</span>
          <span>Age 90</span>
        </div>

        {/* the numbers */}
        <div style={{ position: "absolute", left: 20, top: 264, display: "flex", gap: 34 }}>
          <div>
            <Label>Probability of success</Label>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}>
              <div style={{ fontWeight: 700, fontSize: 24, color: C.ink }}>{success}%</div>
              {delta !== 0 ? (
                <Pill tone={delta > 0 ? "green" : "amber"} size={10}>
                  {delta > 0 ? "+" : "−"}
                  {Math.abs(delta)} pts
                </Pill>
              ) : null}
            </div>
          </div>
          <div>
            <Label>Portfolio at 90</Label>
            <div style={{ fontWeight: 700, fontSize: 24, color: C.ink, marginTop: 5 }}>${at90}M</div>
          </div>
        </div>

        {/* the scenarios */}
        <Label style={{ position: "absolute", left: ROWS.x, top: 80 }}>Scenarios</Label>
        {SCENARIOS.map((sc, i) => {
          const on = i === 0 ? retire : i === 1 ? save : 0;
          return (
            <div
              key={sc.title}
              style={{
                position: "absolute",
                left: ROWS.x,
                top: ROWS.top + i * (ROWS.h + ROWS.gap),
                width: ROWS.w,
                height: ROWS.h,
                boxSizing: "border-box",
                padding: "0 12px",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: on > 0.5 ? "rgba(222,243,220,0.6)" : C.tile,
                boxShadow: on > 0.5 ? "inset 0 0 0 1px rgba(8,107,78,0.25)" : undefined,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: MEDIUM, fontSize: 12, color: C.ink, whiteSpace: "nowrap" }}>{sc.title}</div>
                <div style={{ fontSize: 9.5, color: C.muted, marginTop: 2, whiteSpace: "nowrap" }}>{sc.sub}</div>
              </div>
              <Switch on={on} />
            </div>
          );
        })}
        <div style={{ position: "absolute", left: ROWS.x, top: 286, width: ROWS.w, fontSize: 10, lineHeight: 1.4, color: C.sub2, opacity: c01(save * 2 - 1) }}>
          Retiring at 63 works if you save $15K more a year.
        </div>
      </Panel>
      {pointer && pointer.o > 0 ? (
        <div style={{ opacity: pointer.o }}>
          <Pointer x={pointer.x} y={pointer.y} />
        </div>
      ) : null}
    </Frame>
  );
};

export const SCENARIO_FRAMES: readonly { s: ScenarioState; title: string; caption: string }[] = [
  { s: {}, title: "The plan as it stands", caption: "The Chans’ retirement plan: an 82% probability of success, $4.1M at 90. Scenarios to try on the right." },
  { s: { retire: 1, pointer: { ...toggleAt(0), o: 1 } }, title: "Retire at 63?", caption: "“Retire at 63” switches on: the projection dips under the current plan (dashed) and the numbers follow, 71% (−11 pts)." },
  { s: { retire: 1, save: 1, pointer: { ...toggleAt(1), o: 1 } }, title: "Save $15K more", caption: "Adding “Save $15K more” lifts it past the plan: 88% (+6 pts), $4.0M at 90. “Retiring at 63 works if you save $15K more a year.”" },
];
