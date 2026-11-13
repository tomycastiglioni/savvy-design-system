import { Check, ChevronLeft, CircleCheck, Clock, FileText, Flag, MapPin, Mic, Send, SquareCheck, TrendingUp } from "lucide-react";
import React, { useId } from "react";
import { AbsoluteFill } from "remotion";
import { Card, Label } from "../mobile-household/components";
import { BUTTON_BG, C, PAD, SAFE_TOP, TILE, W } from "../mobile-prep/layout";
import { AIIcon } from "../shared/components/AIIcon";
import { AGENDA, MEETING, PLAN, RECAP, SUMMARY } from "./content";

// The commercial's three phone screens, three options each (A · B · C), laid
// out in iOS points (360 wide) like the earlier mobile videos. Each takes the
// state it shows, so the chosen ones can be animated.

const Nav: React.FC<{ readonly label: string; readonly light?: boolean }> = ({ label, light = false }) => (
  <div style={{ position: "absolute", left: PAD - 8, top: SAFE_TOP + 6, display: "flex", alignItems: "center", gap: 2, color: light ? "rgba(255,255,255,0.85)" : BUTTON_BG, fontSize: 16.5, fontWeight: 500 }}>
    <ChevronLeft size={24} strokeWidth={2.2} /> {label}
  </div>
);

const Pill: React.FC<{ readonly children: React.ReactNode; readonly style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 28, padding: "0 11px", borderRadius: 14, background: C.green50, color: C.green, fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap", ...style }}>{children}</div>
);

const Tile: React.FC<{ readonly kind: keyof typeof TILE; readonly size?: number; readonly children: React.ReactNode }> = ({ kind, size = 38, children }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.29, background: TILE[kind].bg, color: TILE[kind].fg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{children}</div>
);

const Button: React.FC<{ readonly top: number; readonly children: React.ReactNode; readonly done?: boolean }> = ({ top, children, done = false }) => (
  <div
    style={{
      position: "absolute",
      left: PAD,
      right: PAD,
      top,
      height: 52,
      borderRadius: 26,
      background: done ? C.green50 : BUTTON_BG,
      color: done ? C.green : C.white,
      fontSize: 16.5,
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    }}
  >
    {children}
  </div>
);

// The household summary's three lines, with their icons.
const SUMMARY_ROWS = [
  { kind: "summary" as const, Icon: TrendingUp, ...SUMMARY.changes },
  { kind: "task" as const, Icon: SquareCheck, ...SUMMARY.task },
  { kind: "flagged" as const, Icon: Flag, ...SUMMARY.flagged },
];

// ——— Screen 1 · the meeting ———

// A · Meeting card: the meeting itself as a dark card up top (who, when,
// where), the household summary under it, then the agenda.
export const MeetingA: React.FC = () => (
  <AbsoluteFill style={{ background: C.panel }}>
    <Nav label="Today" />
    <div style={{ position: "absolute", left: PAD - 4, right: PAD - 4, top: 96, height: 170, borderRadius: 24, background: `linear-gradient(150deg, #1d5a49 0%, ${BUTTON_BG} 70%)`, padding: "18px 20px", boxSizing: "border-box", color: C.white }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.7 }}>{MEETING.type}</div>
        <Pill style={{ background: "rgba(205,232,217,0.18)", color: "#cde8d9", height: 26 }}>
          <CircleCheck size={13} strokeWidth={2.4} /> Prep ready
        </Pill>
      </div>
      <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 10 }}>{MEETING.client}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12, fontSize: 15, opacity: 0.92 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Clock size={16} strokeWidth={2} /> {MEETING.when}
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <MapPin size={16} strokeWidth={2} /> {MEETING.place}
        </span>
      </div>
    </div>
    <Label style={{ position: "absolute", left: PAD, top: 290 }}>Household</Label>
    <Card style={{ position: "absolute", left: PAD - 4, right: PAD - 4, top: 312, padding: "2px 16px" }}>
      {SUMMARY_ROWS.map(({ kind, Icon, label, value }, i) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 13, height: 64, borderTop: i ? `1px solid ${C.borderSoft}` : "none" }}>
          <Tile kind={kind}>
            <Icon size={19} strokeWidth={2.2} />
          </Tile>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: C.muted }}>{label}</div>
            <div style={{ fontSize: 16.5, fontWeight: 600, color: C.ink, marginTop: 1 }}>{value}</div>
          </div>
        </div>
      ))}
    </Card>
    <Label style={{ position: "absolute", left: PAD, top: 530 }}>Agenda</Label>
    <Card style={{ position: "absolute", left: PAD - 4, right: PAD - 4, top: 552, padding: "4px 16px" }}>
      {AGENDA.map((item, i) => (
        <div key={item} style={{ display: "flex", alignItems: "center", gap: 13, height: 46, borderTop: i ? `1px solid ${C.borderSoft}` : "none" }}>
          <div style={{ width: 24, height: 24, borderRadius: 12, background: C.green50, color: C.green, fontSize: 12.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
          <div style={{ fontSize: 16, fontWeight: 500, color: C.ink }}>{item}</div>
        </div>
      ))}
    </Card>
  </AbsoluteFill>
);

// A stylized map: a few roads and the course, with a flag pin.
const MapTile: React.FC<{ readonly w: number; readonly h: number }> = ({ w, h }) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
    <rect width={w} height={h} fill="#e9f1ea" />
    <path d={`M0 ${h * 0.7} C ${w * 0.3} ${h * 0.6}, ${w * 0.5} ${h * 0.85}, ${w} ${h * 0.55}`} stroke="#ffffff" strokeWidth={7} fill="none" />
    <path d={`M${w * 0.62} 0 C ${w * 0.58} ${h * 0.35}, ${w * 0.7} ${h * 0.6}, ${w * 0.66} ${h}`} stroke="#ffffff" strokeWidth={5} fill="none" />
    <ellipse cx={w * 0.3} cy={h * 0.32} rx={w * 0.2} ry={h * 0.2} fill="#cfe4d3" />
    <ellipse cx={w * 0.82} cy={h * 0.22} rx={w * 0.12} ry={h * 0.14} fill="#d7e9da" />
    <g transform={`translate(${w * 0.34} ${h * 0.18})`}>
      <circle r={13} cy={14} fill={BUTTON_BG} />
      <path d="M-3 22 V6 l9 4 -9 4" stroke="#ffffff" strokeWidth={2} fill="none" strokeLinejoin="round" />
    </g>
  </svg>
);

// B · Calendar: the time and the place up front (a map of the club), the
// household as three tiles, the agenda as chips.
export const MeetingB: React.FC = () => (
  <AbsoluteFill style={{ background: C.white }}>
    <Nav label="Calendar" />
    <div style={{ position: "absolute", left: PAD, right: PAD, top: 100 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.green }}>Today · {MEETING.type}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
        <span style={{ fontSize: 56, fontWeight: 600, letterSpacing: "-0.03em", color: C.ink }}>{MEETING.time}</span>
        <span style={{ fontSize: 20, fontWeight: 600, color: C.muted }}>AM</span>
      </div>
      <div style={{ fontSize: 20, fontWeight: 600, color: C.ink, marginTop: -2 }}>with {MEETING.client}</div>
    </div>
    <div style={{ position: "absolute", left: PAD - 4, right: PAD - 4, top: 238, height: 112, borderRadius: 18, overflow: "hidden", border: `1px solid ${C.borderSoft}` }}>
      <MapTile w={W - 2 * PAD + 8} h={74} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 14px", height: 38, fontSize: 14.5, color: C.ink }}>
        <MapPin size={15} strokeWidth={2.2} color={C.green} /> <span style={{ fontWeight: 600 }}>{MEETING.place}</span>
        <span style={{ marginLeft: "auto", color: C.muted, fontSize: 13 }}>14 min drive</span>
      </div>
    </div>
    <Label style={{ position: "absolute", left: PAD, top: 372 }}>Household</Label>
    <div style={{ position: "absolute", left: PAD - 4, right: PAD - 4, top: 394, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
      {[
        { kind: "summary" as const, Icon: TrendingUp, big: "+6.1%", small: "$40K rollover" },
        { kind: "task" as const, Icon: SquareCheck, big: "1 task", small: "Beneficiary form" },
        { kind: "flagged" as const, Icon: Flag, big: "1 flag", small: "RMD not taken" },
      ].map(({ kind, Icon, big, small }) => (
        <div key={big} style={{ borderRadius: 16, background: TILE[kind].bg, padding: "12px 11px", height: 104, boxSizing: "border-box" }}>
          <Icon size={18} strokeWidth={2.2} color={TILE[kind].fg} />
          <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginTop: 10, letterSpacing: "-0.01em" }}>{big}</div>
          <div style={{ fontSize: 12, color: C.body, marginTop: 2, lineHeight: 1.25 }}>{small}</div>
        </div>
      ))}
    </div>
    <Label style={{ position: "absolute", left: PAD, top: 524 }}>Agenda</Label>
    <div style={{ position: "absolute", left: PAD, right: PAD, top: 548, display: "flex", flexDirection: "column", gap: 8 }}>
      {AGENDA.map((item, i) => (
        <div key={item} style={{ display: "flex", alignItems: "center", gap: 12, height: 46, padding: "0 14px", borderRadius: 14, background: C.panel, fontSize: 16, fontWeight: 500, color: C.ink }}>
          <span style={{ fontWeight: 700, color: C.green, width: 14 }}>{i + 1}</span> {item}
        </div>
      ))}
    </div>
  </AbsoluteFill>
);

// C · Brief: who and where, then Savvy's summary written out in one line, the
// agenda as a large numbered list.
export const MeetingC: React.FC = () => (
  <AbsoluteFill style={{ background: C.white }}>
    <Nav label="Today" />
    <div style={{ position: "absolute", left: PAD, right: PAD, top: 104, display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 56, height: 56, borderRadius: 28, background: C.green50, color: C.green, fontSize: 19, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{MEETING.initials}</div>
      <div>
        <div style={{ fontSize: 23, fontWeight: 600, letterSpacing: "-0.01em", color: C.ink }}>
          {MEETING.type} · {MEETING.client}
        </div>
        <div style={{ fontSize: 14, color: C.muted, marginTop: 3 }}>
          {MEETING.when.replace("Today · ", "Today, ")} · {MEETING.place}
        </div>
      </div>
    </div>
    <div style={{ position: "absolute", left: PAD - 4, right: PAD - 4, top: 192, padding: "18px 20px 18px", borderRadius: 20, background: "#F3F8F5" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: C.green }}>
        <AIIcon size={18} /> Household summary
      </div>
      <div style={{ fontSize: 21, fontWeight: 500, lineHeight: 1.32, letterSpacing: "-0.01em", color: C.ink, marginTop: 10 }}>
        Up <span style={{ color: C.green, fontWeight: 600 }}>6.1%</span> after his $40K rollover. One form to sign, and his RMD isn’t taken yet.
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
        {SUMMARY_ROWS.map(({ kind, Icon, label }) => (
          <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: 5, height: 26, padding: "0 9px", borderRadius: 13, background: C.white, color: TILE[kind].fg, fontSize: 12, fontWeight: 600 }}>
            <Icon size={13} strokeWidth={2.3} /> {label}
          </span>
        ))}
      </div>
    </div>
    <Label style={{ position: "absolute", left: PAD, top: 438 }}>Agenda</Label>
    <div style={{ position: "absolute", left: PAD, right: PAD, top: 458 }}>
      {AGENDA.map((item, i) => (
        <div key={item} style={{ display: "flex", alignItems: "baseline", gap: 16, padding: "15px 0", borderBottom: `1px solid ${C.borderSoft}` }}>
          <div style={{ fontSize: 26, fontWeight: 600, lineHeight: 1, color: C.green, width: 18 }}>{i + 1}</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: C.ink }}>{item}</div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: PAD, top: 706, display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.muted }}>
      <AIIcon size={16} /> Prepared by Savvy Intelligence
    </div>
  </AbsoluteFill>
);

// ——— Screen 2 · the plan ———

// Dave's projection: assets grow to retirement at 65, hold through his
// seventies and taper gently, still well funded at 95; a band of likely
// outcomes around it. `build` draws it in.
export const PlanChart: React.FC<{ readonly w: number; readonly h: number; readonly build?: number; readonly dark?: boolean; readonly labels?: boolean }> = ({ w, h, build = 1, dark = false, labels = true }) => {
  const uid = useId().replace(/:/g, "");
  const [a0, a1, ret] = [58, 95, PLAN.retireAt];
  const v = (a: number) => (a <= ret ? 1.7 + 1.2 * ((a - a0) / (ret - a0)) ** 1.25 : 2.9 + 0.32 * Math.sin(Math.min(1, (a - ret) / 14) * Math.PI * 0.5) - 0.0016 * Math.max(0, a - 72) ** 2);
  const band = (a: number) => 0.06 + 0.018 * (a - a0);
  const X = (a: number) => ((a - a0) / (a1 - a0)) * w;
  const Y = (m: number) => h - 18 - (m / 3.8) * (h - 30);
  const ages = Array.from({ length: 69 }, (_, i) => a0 + (i / 68) * (a1 - a0));
  const line = ages.map((a, i) => `${i ? "L" : "M"}${X(a).toFixed(1)} ${Y(v(a)).toFixed(1)}`).join(" ");
  const up = ages.map((a, i) => `${i ? "L" : "M"}${X(a).toFixed(1)} ${Y(v(a) + band(a)).toFixed(1)}`).join(" ");
  const down = [...ages].reverse().map((a) => `L${X(a).toFixed(1)} ${Y(Math.max(0.05, v(a) - band(a))).toFixed(1)}`).join(" ");
  const stroke = dark ? "#ffffff" : C.green;
  const tip = ages[Math.round(build * (ages.length - 1))];
  const muted = dark ? "rgba(255,255,255,0.6)" : C.muted;
  return (
    <svg width={w} height={h} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <clipPath id={`pc-${uid}`}>
          <rect x={-6} y={-20} width={w * build + 6} height={h + 40} />
        </clipPath>
      </defs>
      <line x1={0} x2={w} y1={h - 18} y2={h - 18} stroke={dark ? "rgba(255,255,255,0.18)" : C.borderSoft} />
      <line x1={X(ret)} x2={X(ret)} y1={10} y2={h - 18} stroke={dark ? "rgba(255,255,255,0.35)" : "#c7cdd4"} strokeDasharray="3 4" />
      <g clipPath={`url(#pc-${uid})`}>
        <path d={`${up} ${down} Z`} fill={dark ? "rgba(205,232,217,0.16)" : "rgba(23,82,66,0.09)"} />
        <path d={line} fill="none" stroke={stroke} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {build > 0 ? <circle cx={X(tip)} cy={Y(v(tip))} r={5} fill={dark ? BUTTON_BG : C.white} stroke={stroke} strokeWidth={2.6} /> : null}
      {labels ? (
        <>
          <text x={X(ret) + 6} y={20} fontSize={11.5} fontWeight={600} fill={muted} fontFamily="DM Sans">
            Retire at {ret}
          </text>
          {[
            [a0, "Today"],
            [ret, `${ret}`],
            [a1, "95"],
          ].map(([a, label]) => (
            <text key={label} x={X(Number(a))} y={h} fontSize={11} fill={muted} fontFamily="DM Sans" textAnchor={a === a0 ? "start" : a === a1 ? "end" : "middle"}>
              {label}
            </text>
          ))}
        </>
      ) : null}
    </svg>
  );
};

// A · Chart card: the plan as one large chart, "On track", and its one result
// under it, big.
export const PlanA: React.FC<{ readonly build?: number; readonly result?: number }> = ({ build = 1, result = 1 }) => (
  <AbsoluteFill style={{ background: C.panel }}>
    <Nav label={MEETING.client} />
    <div style={{ position: "absolute", left: PAD, right: PAD, top: 100, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 27, fontWeight: 600, letterSpacing: "-0.015em", color: C.ink }}>{PLAN.title}</div>
        <div style={{ fontSize: 14, color: C.muted, marginTop: 3 }}>{MEETING.client} · retiring at {PLAN.retireAt}</div>
      </div>
      <Pill style={{ marginTop: 4 }}>
        <CircleCheck size={14} strokeWidth={2.4} /> On track
      </Pill>
    </div>
    <Card style={{ position: "absolute", left: PAD - 4, right: PAD - 4, top: 172, height: 372, padding: "20px 18px 14px", boxSizing: "border-box" }}>
      <Label>Projected assets</Label>
      <div style={{ marginTop: 18 }}>
        <PlanChart w={W - 2 * PAD - 28} h={294} build={build} />
      </div>
    </Card>
    <Card style={{ position: "absolute", left: PAD - 4, right: PAD - 4, top: 560, height: 150, padding: "22px 22px", boxSizing: "border-box", opacity: result, translate: `0px ${(1 - result) * 14}px` }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontSize: 64, fontWeight: 700, letterSpacing: "-0.03em", color: C.green, lineHeight: 1 }}>{Math.round(PLAN.result * result)}%</span>
      </div>
      <div style={{ fontSize: 18, fontWeight: 500, color: C.ink, marginTop: 10 }}>{PLAN.resultLabel}</div>
    </Card>
  </AbsoluteFill>
);

// B · Result first: the one result as a big ring, "On track to retire at 65",
// the projection small under it.
export const PlanB: React.FC<{ readonly build?: number; readonly result?: number }> = ({ build = 1, result = 1 }) => {
  const R = 92;
  const circ = 2 * Math.PI * R;
  return (
    <AbsoluteFill style={{ background: C.white }}>
      <Nav label={MEETING.client} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 98, textAlign: "center", fontSize: 15, fontWeight: 600, color: C.muted }}>{PLAN.title}</div>
      <div style={{ position: "absolute", left: W / 2 - R - 14, top: 132, width: 2 * R + 28, height: 2 * R + 28 }}>
        <svg width={2 * R + 28} height={2 * R + 28}>
          <circle cx={R + 14} cy={R + 14} r={R} fill="none" stroke={C.green50} strokeWidth={16} />
          <circle cx={R + 14} cy={R + 14} r={R} fill="none" stroke={C.green} strokeWidth={16} strokeLinecap="round" strokeDasharray={`${(circ * PLAN.result * result) / 100} ${circ}`} transform={`rotate(-90 ${R + 14} ${R + 14})`} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 58, fontWeight: 700, letterSpacing: "-0.03em", color: C.ink, lineHeight: 1 }}>{Math.round(PLAN.result * result)}%</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>probability of success</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: PAD, right: PAD, top: 366, textAlign: "center" }}>
        <div style={{ fontSize: 27, fontWeight: 600, letterSpacing: "-0.015em", color: C.ink, lineHeight: 1.2 }}>On track to retire at {PLAN.retireAt}</div>
        <div style={{ fontSize: 15, color: C.muted, marginTop: 8 }}>The plan lasts past 95, even in rough markets.</div>
      </div>
      <Card style={{ position: "absolute", left: PAD - 4, right: PAD - 4, top: 486, height: 210, padding: "16px 16px 10px", boxSizing: "border-box" }}>
        <Label>Projected assets</Label>
        <div style={{ marginTop: 12 }}>
          <PlanChart w={W - 2 * PAD - 24} h={150} build={build} />
        </div>
      </Card>
    </AbsoluteFill>
  );
};

// C · Full bleed: the plan on Savvy green, the projection across the screen,
// the result as one big line.
export const PlanC: React.FC<{ readonly build?: number; readonly result?: number }> = ({ build = 1, result = 1 }) => (
  <AbsoluteFill style={{ background: `linear-gradient(170deg, #1f5f4d 0%, ${BUTTON_BG} 55%, #0f3a2f 100%)`, color: C.white }}>
    <Nav label={MEETING.client} light />
    <div style={{ position: "absolute", left: PAD, right: PAD, top: 104 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "#cde8d9" }}>
        <CircleCheck size={16} strokeWidth={2.4} /> {PLAN.title} · on track
      </div>
      <div style={{ fontSize: 38, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1, marginTop: 14 }}>
        Dave can retire
        <br />
        at {PLAN.retireAt}.
      </div>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 268 }}>
      <PlanChart w={W - 2 * PAD} h={250} build={build} dark />
    </div>
    <div style={{ position: "absolute", left: PAD - 4, right: PAD - 4, top: 560, padding: "20px 22px", borderRadius: 22, background: "rgba(255,255,255,0.1)", opacity: result, translate: `0px ${(1 - result) * 14}px` }}>
      <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>{Math.round(PLAN.result * result)}%</div>
      <div style={{ fontSize: 17, color: "rgba(255,255,255,0.82)", marginTop: 8 }}>{PLAN.resultLabel}</div>
    </div>
  </AbsoluteFill>
);

// ——— Screen 3 · the follow-up ———
// Each option takes `sent` (0 → 1): the recap ready to send, then sent.

const Tick: React.FC<{ readonly size?: number }> = ({ size = 22 }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: C.green50, color: C.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <Check size={size * 0.6} strokeWidth={3} />
  </div>
);
const Recorded: React.FC<{ readonly style?: React.CSSProperties }> = ({ style }) => (
  <Pill style={style}>
    <Mic size={14} strokeWidth={2.4} /> Recorded · {RECAP.minutes} min
  </Pill>
);
const Avatar: React.FC<{ readonly initials: string; readonly you?: boolean }> = ({ initials, you = false }) => (
  <div style={{ width: 30, height: 30, borderRadius: 15, background: you ? BUTTON_BG : C.green50, color: you ? C.white : C.green, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    {initials}
  </div>
);

// A · Recap card: the recap (decisions, next steps) with the send button at
// the foot; once sent, the button turns into the confirmation.
export const RecapA: React.FC<{ readonly sent?: number }> = ({ sent = 0 }) => (
  <AbsoluteFill style={{ background: C.panel }}>
    <Nav label="Today" />
    <Recorded style={{ position: "absolute", left: PAD, top: 100 }} />
    <div style={{ position: "absolute", left: PAD, right: PAD, top: 140 }}>
      <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.015em", color: C.ink }}>{RECAP.title}</div>
      <div style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>{RECAP.sub}</div>
    </div>
    <Label style={{ position: "absolute", left: PAD, top: 226 }}>Decisions</Label>
    <Card style={{ position: "absolute", left: PAD - 4, right: PAD - 4, top: 248, padding: "2px 16px" }}>
      {RECAP.points.map((p, i) => (
        <div key={p} style={{ display: "flex", alignItems: "center", gap: 12, height: 54, borderTop: i ? `1px solid ${C.borderSoft}` : "none" }}>
          <Tick />
          <div style={{ fontSize: 16, fontWeight: 600, color: C.ink }}>{p}</div>
        </div>
      ))}
    </Card>
    <Label style={{ position: "absolute", left: PAD, top: 442 }}>Next steps</Label>
    <Card style={{ position: "absolute", left: PAD - 4, right: PAD - 4, top: 464, padding: "2px 16px" }}>
      {RECAP.next.map((s, i) => (
        <div key={s.text} style={{ display: "flex", alignItems: "center", gap: 12, height: 54, borderTop: i ? `1px solid ${C.borderSoft}` : "none" }}>
          <Avatar initials={s.initials} you={s.owner === "You"} />
          <div style={{ fontSize: 16, fontWeight: 600, color: C.ink }}>{s.text}</div>
          <div style={{ marginLeft: "auto", fontSize: 13, color: C.muted }}>{s.owner}</div>
        </div>
      ))}
    </Card>
    <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", fontSize: 13.5, color: C.muted, opacity: sent }}>{RECAP.sentTo}</div>
    <Button top={668} done={sent > 0.5}>
      {sent > 0.5 ? (
        <>
          <CircleCheck size={19} strokeWidth={2.3} /> {RECAP.sent}
        </>
      ) : (
        <>
          <Send size={17} strokeWidth={2.2} /> {RECAP.send}
        </>
      )}
    </Button>
  </AbsoluteFill>
);

// B · Email: the drafted follow-up itself, ready; once sent, a confirmation
// takes the screen.
export const RecapB: React.FC<{ readonly sent?: number }> = ({ sent = 0 }) => (
  <AbsoluteFill style={{ background: C.panel }}>
    <Nav label="Today" />
    <div style={{ opacity: 1 - sent }}>
      <div style={{ position: "absolute", left: PAD, right: PAD, top: 100, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.015em", color: C.ink }}>{RECAP.title}</div>
      </div>
      <div style={{ position: "absolute", left: PAD, top: 138, fontSize: 14, color: C.muted }}>{RECAP.sub} · follow-up drafted</div>
      <Card style={{ position: "absolute", left: PAD - 4, right: PAD - 4, top: 176, padding: "4px 18px 18px" }}>
        {[
          ["To", MEETING.client],
          ["Subject", "Recap of today’s annual review"],
        ].map(([k, val]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 10, height: 46, borderBottom: `1px solid ${C.borderSoft}`, fontSize: 15 }}>
            <span style={{ color: C.muted, width: 58 }}>{k}</span>
            <span style={{ color: C.ink, fontWeight: 600 }}>{val}</span>
          </div>
        ))}
        <div style={{ fontSize: 16, color: C.body, lineHeight: 1.45, marginTop: 14 }}>
          Hi Dave,
          <br />
          Great seeing you at Pebble Creek. Quick recap:
        </div>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 9 }}>
          {RECAP.points.map((p) => (
            <div key={p} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15.5, fontWeight: 600, color: C.ink }}>
              <Tick size={20} /> {p}
            </div>
          ))}
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 16, padding: "8px 12px", borderRadius: 10, background: C.tabsBg, fontSize: 13.5, fontWeight: 500, color: C.body }}>
          <FileText size={16} strokeWidth={2} color={C.muted} /> Meeting recap.pdf
        </div>
      </Card>
      <Button top={668}>
        <Send size={17} strokeWidth={2.2} /> {RECAP.send}
      </Button>
    </div>
    {sent > 0 ? (
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", flexDirection: "column", alignItems: "center", opacity: sent, scale: 0.94 + 0.06 * sent }}>
        <div style={{ width: 96, height: 96, borderRadius: 48, background: C.green50, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: C.green, color: C.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Check size={36} strokeWidth={3} />
          </div>
        </div>
        <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-0.015em", color: C.ink, marginTop: 24 }}>{RECAP.sent}</div>
        <div style={{ fontSize: 15, color: C.muted, marginTop: 8 }}>{RECAP.sentTo}</div>
      </div>
    ) : null}
  </AbsoluteFill>
);

// C · Assistant: Savvy says the recap is ready and offers to send the
// follow-up; once sent, it confirms in the thread.
const Bubble: React.FC<{ readonly children: React.ReactNode; readonly style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, ...style }}>
    <div style={{ width: 32, height: 32, borderRadius: 16, background: C.green50, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <AIIcon size={19} />
    </div>
    <div style={{ padding: "11px 15px", borderRadius: "6px 18px 18px 18px", background: C.panel, fontSize: 16.5, lineHeight: 1.35, color: C.ink, maxWidth: 270 }}>{children}</div>
  </div>
);
export const RecapC: React.FC<{ readonly sent?: number }> = ({ sent = 0 }) => (
  <AbsoluteFill style={{ background: C.white }}>
    <Nav label="Savvy Intelligence" />
    <div style={{ position: "absolute", left: PAD, right: PAD, top: 104, textAlign: "center", fontSize: 12.5, color: C.label }}>Today, 11:46 AM</div>
    <Bubble style={{ position: "absolute", left: PAD, top: 132 }}>
      <span style={{ fontWeight: 600 }}>{RECAP.title}.</span> {RECAP.sub}, {RECAP.minutes} min.
    </Bubble>
    <Card style={{ position: "absolute", left: PAD + 42, right: PAD, top: 196, padding: "6px 16px" }}>
      {RECAP.points.map((p, i) => (
        <div key={p} style={{ display: "flex", alignItems: "center", gap: 10, height: 44, borderTop: i ? `1px solid ${C.borderSoft}` : "none", fontSize: 14.5, fontWeight: 600, color: C.ink }}>
          <Tick size={20} /> {p}
        </div>
      ))}
      <div style={{ display: "flex", alignItems: "center", gap: 8, height: 40, borderTop: `1px solid ${C.borderSoft}`, fontSize: 13.5, color: C.muted }}>
        <FileText size={15} strokeWidth={2} /> Follow-up drafted to {MEETING.client}
      </div>
    </Card>
    <Bubble style={{ position: "absolute", left: PAD, top: 398 }}>{RECAP.ask}</Bubble>
    <div style={{ position: "absolute", left: PAD + 42, top: 456, display: "flex", gap: 8, opacity: 1 - 0.55 * sent }}>
      <div style={{ height: 42, padding: "0 18px", borderRadius: 21, background: sent > 0.5 ? C.green50 : BUTTON_BG, color: sent > 0.5 ? C.green : C.white, fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", gap: 7 }}>
        {sent > 0.5 ? <Check size={16} strokeWidth={2.6} /> : <Send size={15} strokeWidth={2.2} />} {sent > 0.5 ? "Sent" : "Send"}
      </div>
      <div style={{ height: 42, padding: "0 18px", borderRadius: 21, border: `1px solid ${C.borderSoft}`, color: C.ink, fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center" }}>Edit first</div>
    </div>
    {sent > 0 ? (
      <Bubble style={{ position: "absolute", left: PAD, top: 524, opacity: sent, translate: `0px ${(1 - sent) * 10}px` }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
          <span style={{ width: 20, height: 20, borderRadius: 10, background: C.green, color: C.white, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <Check size={13} strokeWidth={3.2} />
          </span>
          {RECAP.sent}
        </span>
        <div style={{ fontSize: 13.5, color: C.muted, marginTop: 4 }}>{RECAP.sentTo}</div>
      </Bubble>
    ) : null}
  </AbsoluteFill>
);
