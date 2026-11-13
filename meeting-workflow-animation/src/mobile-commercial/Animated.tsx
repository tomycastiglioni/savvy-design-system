import "../mobile-prep/fonts";
import { Audio } from "@remotion/media";
import { CircleCheck, Clock, MapPin, Send } from "lucide-react";
import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Card, Label } from "../mobile-household/components";
import { HomeIndicator, StatusBar } from "../mobile-prep/components/SystemUI";
import { BUTTON_BG, C, FONT, H, PAD, SCALE, W } from "../mobile-prep/layout";
import { AGENDA, CLOCK, MEETING, PLAN, RECAP } from "./content";
import { Avatar, Button, LATER, Nav, Pill, PlanChart, Recorded, SUMMARY_ROWS, Tick, Tile } from "./Screens";

// The commercial's three phone screens, animated (1080×2348, 60 fps, a 3×
// iPhone screen recording like the earlier mobile videos): 1A and 2A only
// build in, nobody touches them; on 3 the subject taps "Send follow-up"
// (shown as the button's press, no finger, as in a real recording). Each holds
// at the end so the edit can trim it.

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OUT = Easing.out(Easing.cubic);
const ramp = (t: number, a: number, b: number, ease = OUT) => interpolate(t, [a, b], [0, 1], { ...CLAMP, easing: ease });
// an element rising into place
const rise = (t: number, at: number, dy = 12, dur = 0.45): React.CSSProperties => {
  const p = ramp(t, at, at + dur);
  return { opacity: p, translate: `0px ${(1 - p) * dy}px` };
};
// a small element popping in
const pop = (t: number, at: number): React.CSSProperties => {
  const p = ramp(t, at, at + 0.35, Easing.out(Easing.back(2.2)));
  return { opacity: ramp(t, at, at + 0.12), scale: 0.6 + 0.4 * p };
};
const press = (t: number, at: number) => interpolate(t, [at, at + 0.06, at + 0.2], [0, 1, 0], CLAMP);

// The phone: a screen in points, the status bar, the sounds.
type Cue = { readonly src: string; readonly at: number; readonly volume: number; readonly dur: number };
const PhoneVideo: React.FC<{ readonly time: string; readonly cues: readonly Cue[]; readonly children: (t: number) => React.ReactNode }> = ({ time, cues, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.white }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, scale: SCALE, transformOrigin: "0 0", overflow: "hidden", fontFamily: FONT.sans }}>
        {children(frame / fps)}
        <StatusBar time={time} />
        <HomeIndicator />
      </div>
      {cues.map((c, i) => (
        <Sequence key={i} name={`sfx ${c.src}`} from={Math.round(c.at * fps)} durationInFrames={Math.ceil(c.dur * fps)} layout="none">
          <Audio src={staticFile(`audio/${c.src}.mp3`)} volume={c.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
// the MobilePrep plucks, climbing, for things landing
const plucks = (ats: readonly number[], volume = 0.13): Cue[] => ats.map((at, i) => ({ src: `mobile-prep/row-${Math.min(5, i + 1)}`, at: at + 0.02, volume: volume - 0.008 * i, dur: 0.45 }));

// ——— 1 · The meeting (1A): builds in, then holds ———
export const MEETING_T = { card: 0.15, ready: 0.6, household: 0.6, rows: [0.72, 0.86, 1.0], agenda: 1.12, items: [1.24, 1.36, 1.48], end: 4.5 };
const MeetingScreen: React.FC<{ readonly t: number }> = ({ t }) => {
  const T = MEETING_T;
  return (
    <AbsoluteFill style={{ background: C.panel }}>
      <Nav label="Today" />
      <div style={{ position: "absolute", left: PAD - 4, right: PAD - 4, top: 96, height: 170, borderRadius: 24, background: `linear-gradient(150deg, #1d5a49 0%, ${BUTTON_BG} 70%)`, padding: "18px 20px", boxSizing: "border-box", color: C.white, ...rise(t, T.card, 18, 0.55) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.7 }}>{MEETING.type}</div>
          <Pill style={{ background: "rgba(205,232,217,0.18)", color: "#cde8d9", height: 26, ...pop(t, T.ready) }}>
            <CircleCheck size={13} strokeWidth={2.4} /> Prep ready
          </Pill>
        </div>
        <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 10, ...rise(t, T.card + 0.1, 8) }}>{MEETING.client}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12, fontSize: 15, opacity: 0.92 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, ...rise(t, T.card + 0.2, 6) }}>
            <Clock size={16} strokeWidth={2} /> {MEETING.when}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, ...rise(t, T.card + 0.28, 6) }}>
            <MapPin size={16} strokeWidth={2} /> {MEETING.place}
          </span>
        </div>
      </div>
      <Label style={{ position: "absolute", left: PAD, top: 290, ...rise(t, T.household, 6) }}>Household</Label>
      <Card style={{ position: "absolute", left: PAD - 4, right: PAD - 4, top: 312, padding: "2px 16px", ...rise(t, T.household, 14) }}>
        {SUMMARY_ROWS.map(({ kind, Icon, label, value }, i) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 13, height: 64, borderTop: i ? `1px solid ${C.borderSoft}` : "none" }}>
            <div style={pop(t, T.rows[i])}>
              <Tile kind={kind}>
                <Icon size={19} strokeWidth={2.2} />
              </Tile>
            </div>
            <div style={rise(t, T.rows[i], 6)}>
              <div style={{ fontSize: 12.5, fontWeight: 500, color: C.muted }}>{label}</div>
              <div style={{ fontSize: 16.5, fontWeight: 600, color: C.ink, marginTop: 1 }}>{value}</div>
            </div>
          </div>
        ))}
      </Card>
      <Label style={{ position: "absolute", left: PAD, top: 530, ...rise(t, T.agenda, 6) }}>Agenda</Label>
      <Card style={{ position: "absolute", left: PAD - 4, right: PAD - 4, top: 552, padding: "4px 16px", ...rise(t, T.agenda, 14) }}>
        {AGENDA.map((item, i) => (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: 13, height: 46, borderTop: i ? `1px solid ${C.borderSoft}` : "none", ...rise(t, T.items[i], 6) }}>
            <div style={{ width: 24, height: 24, borderRadius: 12, background: C.green50, color: C.green, fontSize: 12.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: C.ink }}>{item}</div>
          </div>
        ))}
      </Card>
    </AbsoluteFill>
  );
};
export const CommercialMeeting: React.FC = () => (
  <PhoneVideo time={CLOCK.meeting} cues={[...plucks(MEETING_T.rows), { src: "mobile-prep/ready", at: MEETING_T.ready - 0.05, volume: 0.16, dur: 1.04 }]}>
    {(t) => <MeetingScreen t={t} />}
  </PhoneVideo>
);

// ——— 2 · The plan (2A with the what-if): builds in; then "What if I retire 5
// years later?" appears on its own, the scenario draws over the plan and the
// result moves. Nobody touches it. ———
export const PLAN_T = { head: 0.12, chart: 0.3, build: [0.5, 1.5] as const, result: 1.35, ask: 2.3, change: 2.65, scenario: [2.85, 3.85] as const, count: [2.95, 3.65] as const, up: 3.65, end: 6.5 };
const SCENARIO_RESULT = 99;
const PlanScreen: React.FC<{ readonly t: number }> = ({ t }) => {
  const T = PLAN_T;
  const scenario = ramp(t, ...T.scenario, Easing.inOut(Easing.cubic));
  const value = Math.round(PLAN.result + (SCENARIO_RESULT - PLAN.result) * ramp(t, ...T.count, Easing.inOut(Easing.quad)));
  const moved = t >= T.scenario[0];
  return (
    <AbsoluteFill style={{ background: C.panel }}>
      <Nav label={MEETING.client} />
      <div style={{ position: "absolute", left: PAD, right: PAD, top: 100, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={rise(t, T.head, 10)}>
          <div style={{ fontSize: 27, fontWeight: 600, letterSpacing: "-0.015em", color: C.ink }}>{PLAN.title}</div>
          <div style={{ fontSize: 14, color: C.muted, marginTop: 3 }}>
            {MEETING.client} · retiring at {PLAN.retireAt}
          </div>
        </div>
        <Pill style={{ marginTop: 4, ...pop(t, T.head + 0.25) }}>
          <CircleCheck size={14} strokeWidth={2.4} /> On track
        </Pill>
      </div>
      <Card style={{ position: "absolute", left: PAD - 4, right: PAD - 4, top: 172, height: 292, padding: "18px 18px 12px", boxSizing: "border-box", ...rise(t, T.chart, 16, 0.5) }}>
        <Label>Projected assets</Label>
        <div style={{ marginTop: 14 }}>
          <PlanChart w={W - 2 * PAD - 28} h={222} build={ramp(t, ...T.build, Easing.inOut(Easing.cubic))} scenario={scenario} />
        </div>
      </Card>
      {/* the what-if, as the client asks it */}
      <div style={{ position: "absolute", left: PAD - 2, right: PAD - 2, top: 478, display: "flex", alignItems: "center", gap: 10, ...rise(t, T.ask, 12) }}>
        <Avatar initials={MEETING.initials} />
        <div style={{ padding: "10px 14px", borderRadius: "6px 18px 18px 18px", background: C.white, boxShadow: "0 1px 2px rgba(16,24,40,0.05), 0 8px 20px -12px rgba(16,24,40,0.2)", fontSize: 16, fontWeight: 600, color: C.ink, whiteSpace: "nowrap" }}>
          What if I retire {LATER} years later?
        </div>
      </div>
      <Pill style={{ position: "absolute", left: PAD + 38, top: 528, ...pop(t, T.change) }}>
        Retirement age {PLAN.retireAt} → {PLAN.retireAt + LATER}
      </Pill>
      <Card style={{ position: "absolute", left: PAD - 4, right: PAD - 4, top: 572, height: 140, padding: "20px 22px", boxSizing: "border-box", ...rise(t, T.result, 14) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 60, fontWeight: 700, letterSpacing: "-0.03em", color: C.green, lineHeight: 1 }}>{value}%</span>
          <Pill style={{ ...pop(t, T.up) }}>+{SCENARIO_RESULT - PLAN.result} pts</Pill>
        </div>
        <div style={{ fontSize: 17, fontWeight: 500, color: C.ink, marginTop: 10 }}>
          {PLAN.resultLabel}
          <span style={{ color: C.muted, opacity: moved ? 1 : 0 }}> · retiring at {PLAN.retireAt + LATER}</span>
        </div>
      </Card>
    </AbsoluteFill>
  );
};
export const CommercialPlan: React.FC = () => (
  <PhoneVideo
    time={CLOCK.plan}
    cues={[
      ...plucks([PLAN_T.result, PLAN_T.ask, PLAN_T.change]),
      { src: "launch/whoosh", at: PLAN_T.scenario[0] - 0.1, volume: 0.07, dur: 1.0 },
      { src: "mobile-prep/ready", at: PLAN_T.up - 0.08, volume: 0.18, dur: 1.04 },
    ]}
  >
    {(t) => <PlanScreen t={t} />}
  </PhoneVideo>
);

// ——— 3 · The follow-up: the recap builds in; the subject taps "Send
// follow-up"; it turns to "Follow-up sent."; then a check fills the screen. ———
export const RECAP_T = { pill: 0.1, title: 0.2, decisions: 0.38, points: [0.5, 0.62, 0.74], next: 0.88, steps: [0.98, 1.1], button: 1.25, press: 2.6, sent: 2.7, check: 3.75, end: 6.5 };
const RecapScreen: React.FC<{ readonly t: number }> = ({ t }) => {
  const T = RECAP_T;
  const down = press(t, T.press);
  const sent = ramp(t, T.sent, T.sent + 0.25);
  const leave = ramp(t, T.check, T.check + 0.4, Easing.inOut(Easing.cubic));
  const done = ramp(t, T.check + 0.28, T.check + 0.65); // once the recap has mostly gone
  const draw = ramp(t, T.check + 0.35, T.check + 0.8, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill style={{ background: C.panel }}>
      <Nav label="Today" />
      <div style={{ opacity: 1 - leave, translate: `0px ${-leave * 16}px` }}>
        <Recorded style={{ position: "absolute", left: PAD, top: 100, ...pop(t, T.pill) }} />
        <div style={{ position: "absolute", left: PAD, right: PAD, top: 140, ...rise(t, T.title, 10) }}>
          <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.015em", color: C.ink }}>{RECAP.title}</div>
          <div style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>{RECAP.sub}</div>
        </div>
        <Label style={{ position: "absolute", left: PAD, top: 226, ...rise(t, T.decisions, 6) }}>Decisions</Label>
        <Card style={{ position: "absolute", left: PAD - 4, right: PAD - 4, top: 248, padding: "2px 16px", ...rise(t, T.decisions, 14) }}>
          {RECAP.points.map((p, i) => (
            <div key={p} style={{ display: "flex", alignItems: "center", gap: 12, height: 54, borderTop: i ? `1px solid ${C.borderSoft}` : "none" }}>
              <div style={pop(t, T.points[i])}>
                <Tick />
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.ink, ...rise(t, T.points[i], 5) }}>{p}</div>
            </div>
          ))}
        </Card>
        <Label style={{ position: "absolute", left: PAD, top: 442, ...rise(t, T.next, 6) }}>Next steps</Label>
        <Card style={{ position: "absolute", left: PAD - 4, right: PAD - 4, top: 464, padding: "2px 16px", ...rise(t, T.next, 14) }}>
          {RECAP.next.map((st, i) => (
            <div key={st.text} style={{ display: "flex", alignItems: "center", gap: 12, height: 54, borderTop: i ? `1px solid ${C.borderSoft}` : "none", ...rise(t, T.steps[i], 5) }}>
              <Avatar initials={st.initials} you={st.owner === "You"} />
              <div style={{ fontSize: 16, fontWeight: 600, color: C.ink }}>{st.text}</div>
              <div style={{ marginLeft: "auto", fontSize: 13, color: C.muted }}>{st.owner}</div>
            </div>
          ))}
        </Card>
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", fontSize: 13.5, color: C.muted, opacity: sent }}>{RECAP.sentTo}</div>
        <div style={{ ...rise(t, T.button, 14), scale: 1 - 0.035 * down, filter: down > 0 ? `brightness(${1 - 0.18 * down})` : undefined }}>
          <Button top={668} done={sent > 0.5}>
            {sent > 0.5 ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, scale: 0.92 + 0.08 * sent }}>
                <CircleCheck size={19} strokeWidth={2.3} /> {RECAP.sent}
              </span>
            ) : (
              <>
                <Send size={17} strokeWidth={2.2} /> {RECAP.send}
              </>
            )}
          </Button>
        </div>
      </div>
      {/* the check on screen */}
      {done > 0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 236, display: "flex", flexDirection: "column", alignItems: "center", opacity: done, scale: 0.92 + 0.08 * done }}>
          <div style={{ width: 112, height: 112, borderRadius: 56, background: C.green50, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 76, height: 76, borderRadius: 38, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", scale: 0.7 + 0.3 * ramp(t, T.check + 0.15, T.check + 0.55, Easing.out(Easing.back(2))) }}>
              <svg width={42} height={42} viewBox="0 0 24 24">
                <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={C.white} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
              </svg>
            </div>
          </div>
          <div style={{ fontSize: 31, fontWeight: 600, letterSpacing: "-0.015em", color: C.ink, marginTop: 26, ...rise(t, T.check + 0.3, 8) }}>{RECAP.sent}</div>
          <div style={{ fontSize: 15, color: C.muted, marginTop: 8, ...rise(t, T.check + 0.4, 8) }}>{RECAP.sentTo}</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
export const CommercialRecap: React.FC = () => (
  <PhoneVideo
    time={CLOCK.recap}
    cues={[
      ...plucks([...RECAP_T.points, RECAP_T.button]),
      { src: "launch/click", at: RECAP_T.press - 0.02, volume: 0.35, dur: 0.15 },
      { src: "mobile-prep/ready", at: RECAP_T.sent - 0.04, volume: 0.24, dur: 1.04 },
      { src: "launch/success", at: RECAP_T.check + 0.3, volume: 0.1, dur: 1.6 },
    ]}
  >
    {(t) => <RecapScreen t={t} />}
  </PhoneVideo>
);

export const COMMERCIAL_SCREENS = {
  meeting: { Component: CommercialMeeting, seconds: MEETING_T.end, file: "commercial-01-meeting" },
  plan: { Component: CommercialPlan, seconds: PLAN_T.end, file: "commercial-02-retirement-plan" },
  recap: { Component: CommercialRecap, seconds: RECAP_T.end, file: "commercial-03-follow-up" },
} as const;
export type CommercialScreen = keyof typeof COMMERCIAL_SCREENS;
