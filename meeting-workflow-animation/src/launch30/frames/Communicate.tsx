import { Check, Mic, RefreshCw, Users } from "lucide-react";
import React from "react";
import { Phone } from "../../capture/components/Phone";
import { Waveform } from "../../capture/components/Waveform";
import { AIIcon } from "../../shared/components/AIIcon";
import { Bg, BgSweep, Card, Cursor, Headline, headlineBlock, HouseholdChip, Label } from "../components/Bits";
import { AbstractChart } from "../components/Chart";
import { lerp, Rect } from "../components/Motion";
import { Tracker } from "../components/Tracker";
import { C, centerTop, CY, FONT, phase } from "../theme";

const P = phase("communicate");
const RED = "#AD3A35";

// At 0:10–0:14 the eyebrow, the headline and the client's question under it
// are centred together on the middle line.
const BUBBLE_GAP = 92; // headline baseline → bubble top
const BUBBLE_H = 88;
const PRESENT_BLOCK = headlineBlock(2);
const PRESENT_TOP = CY - (PRESENT_BLOCK + BUBBLE_GAP + BUBBLE_H) / 2;
export const PRESENT_HEADLINE = {
  eyebrow: "Live presentation",
  color: P.accent,
  lines: ["Explore “what if?”", "scenarios together"],
  cy: PRESENT_TOP + PRESENT_BLOCK / 2,
};
export const CAPTURE_HEADLINE = { eyebrow: "Meeting capture", color: P.accent, lines: ["Give your", "full attention"] };
// The plan as it lifts out of the prep, and as it is presented.
export const LIFT: Rect = { x: 1040, y: centerTop(450), w: 720, h: 450 };
// The presentation is narrower than the other UI cards and sits right, so it
// keeps clear of the two-line headline.
export const PRESENT: Rect = { x: 980, y: centerTop(610), w: 780, h: 610 };
// Inside it: the chart spans the card less 44 px margins; two sliders share
// that width.
const CHART = { w: PRESENT.w - 88, h: 290 };
const SLIDER_W = (CHART.w - 92) / 2;
// Contributions slider knob, in canvas px, at slider position p.
const SLIDERS_TOP = 128 + CHART.h + 82;
export const knobAt = (p: number) => ({ x: PRESENT.x + 44 + p * SLIDER_W, y: PRESENT.y + SLIDERS_TOP + 42 });
export const KNOB = { from: 0.5, to: 0.65 };
// Where the presentation steps back to behind the phone (F08): smaller and
// clear of the capture headline, centred on the middle line.
const BACK_SCALE = 630 / PRESENT.w;
export const CAPTURE_BACK = { x: 900, y: CY - (PRESENT.h * BACK_SCALE) / 2, scale: BACK_SCALE, opacity: 0.5 };

const Slider: React.FC<{ readonly label: string; readonly value: string; readonly p: number; readonly hot?: number }> = ({ label, value, p, hot = 0 }) => (
  <div style={{ width: SLIDER_W }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, color: C.ink }}>
      <span style={{ fontWeight: 500 }}>{label}</span>
      <span
        style={{
          fontWeight: 700,
          padding: "1px 8px",
          marginRight: -8,
          borderRadius: 6,
          background: `rgba(229, 244, 235, ${hot})`,
          color: hot > 0.5 ? C.green : C.ink,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </span>
    </div>
    <div style={{ position: "relative", height: 6, borderRadius: 3, background: "#E5E7EB", marginTop: 16 }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${p * 100}%`, borderRadius: 3, background: C.green }} />
      <div
        style={{
          position: "absolute",
          left: `${p * 100}%`,
          top: 3,
          width: 24,
          height: 24,
          translate: "-50% -50%",
          borderRadius: "50%",
          background: C.white,
          border: `3px solid ${C.green}`,
          boxShadow: `0 0 0 ${8 * hot}px rgba(23, 82, 66, 0.15)`,
        }}
      />
    </div>
  </div>
);

// The client's question, asked in the meeting: a chat bubble under the
// headline, centred with it. `typed` (0–1) writes the question
// out; the bubble keeps its final width so nothing reflows.
export const QUESTION = { who: "Frank Chan", initials: "FC", text: "What if we save $15K more a year?" };
export const BUBBLE = { x: 174, y: PRESENT_TOP + PRESENT_BLOCK + BUBBLE_GAP };
export const QuestionBubble: React.FC<{ readonly typed?: number; readonly style?: React.CSSProperties }> = ({ typed = 1, style }) => {
  const n = Math.round(typed * QUESTION.text.length);
  return (
    <div style={{ position: "absolute", left: BUBBLE.x, top: BUBBLE.y, display: "flex", alignItems: "flex-start", gap: 14, fontFamily: FONT.sans, ...style }}>
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: 27,
          flexShrink: 0,
          background: C.green100,
          color: C.green,
          fontSize: 19,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {QUESTION.initials}
      </div>
      <div
        style={{
          padding: "14px 22px 16px",
          borderRadius: "6px 22px 22px 22px",
          background: C.white,
          boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05), 0 16px 36px -16px rgba(16, 24, 40, 0.28)",
          whiteSpace: "nowrap",
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 600, color: C.muted }}>{QUESTION.who}</div>
        <div style={{ position: "relative", fontSize: 26, fontWeight: 500, color: C.ink, marginTop: 4 }}>
          <span>{QUESTION.text.slice(0, n)}</span>
          {typed > 0 && typed < 1 ? (
            <span style={{ display: "inline-block", width: 2.5, height: 28, marginLeft: 2, marginRight: -4.5, verticalAlign: "-5px", background: C.green }} />
          ) : null}
          <span style={{ visibility: "hidden" }}>{QUESTION.text.slice(n)}</span>
        </div>
      </div>
    </div>
  );
};

// The plan card's content. `m` morphs it from the lifted card (LIFT, 0) to
// the presentation (PRESENT, 1); `chrome` fades in the presenting pill, end
// value, years and sliders; `build` draws the projection in; `drag` moves the
// contributions what-if.
export const PresentationContent: React.FC<{
  readonly m?: number;
  readonly chrome?: number;
  readonly build?: number;
  readonly drag?: number;
  readonly hot?: number;
}> = ({ m = 1, chrome = 1, build = 1, drag = 0, hot = 0 }) => {
  const c = chrome * m;
  return (
    <>
      <div style={{ position: "absolute", left: lerp(40, 44, m), top: lerp(36, 40, m), fontFamily: FONT.serif, fontSize: lerp(36, 40, m), color: C.ink, whiteSpace: "nowrap" }}>
        Retirement plan
      </div>
      <div
        style={{
          position: "absolute",
          right: 40,
          top: 46,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "7px 14px",
          borderRadius: 999,
          background: C.green50,
          color: C.green,
          fontSize: 16,
          fontWeight: 600,
          opacity: c,
        }}
      >
        <div style={{ width: 9, height: 9, borderRadius: 5, background: C.green }} /> Presenting
      </div>
      <div style={{ position: "absolute", left: lerp(40, 44, m), top: lerp(120, 128, m) }}>
        <AbstractChart
          w={lerp(640, CHART.w, m)}
          h={lerp(290, CHART.h, m)}
          color={C.green}
          growth={0.95 + 0.23 * drag}
          ghost={0.95}
          ghostOpacity={Math.min(1, drag * 4)}
          endLabel={`$${(22.5 + 2.6 * drag).toFixed(1)}M`}
          years
          detail={c}
          build={build}
        />
      </div>
      <div style={{ position: "absolute", left: 44, right: 44, top: SLIDERS_TOP - 34, height: 1, background: "#EEF0F2", opacity: c }} />
      <div style={{ position: "absolute", left: 44, top: SLIDERS_TOP, display: "flex", gap: 92, opacity: c }}>
        <Slider label="Contributions" value={`$${Math.round(50 + 15 * drag)}K`} p={lerp(KNOB.from, KNOB.to, drag)} hot={hot} />
        <Slider label="Retirement age" value="67" p={0.55} />
      </div>
    </>
  );
};

// The phone's screen content, laid out at 340×700. `writing` swaps the
// recording for "Writing your recap": one leaves before the other arrives.
export const PhoneScreen: React.FC<{ readonly writing?: number; readonly timer?: string; readonly spin?: number }> = ({
  writing = 0,
  timer = "32:05",
  spin = 0,
}) => (
  <>
    {writing < 0.5 ? (
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 200, opacity: 1 - 2 * writing }}>
        <div style={{ fontSize: 72, fontWeight: 500, color: C.ink, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{timer}</div>
        <div style={{ marginTop: 26, scale: 1.25 }}>
          <Waveform color={RED} energy={1} />
        </div>
        <div style={{ marginTop: 30, display: "flex", alignItems: "center", gap: 8, fontSize: 24, fontWeight: 600, color: C.ink }}>
          <Mic size={26} strokeWidth={2.4} color={RED} /> Recording
        </div>
        <div style={{ marginTop: 22, scale: 0.82 }}>
          <HouseholdChip meeting={false} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 22,
            right: 22,
            bottom: 64,
            height: 46,
            borderRadius: 23,
            background: "#16473A",
            color: C.white,
            fontSize: 17,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Stop
        </div>
      </div>
    ) : null}
    {writing > 0.5 ? (
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 250, opacity: 2 * writing - 1 }}>
        <AIIcon size={84} style={{ rotate: `${spin}deg` }} />
        <div style={{ fontSize: 24, fontWeight: 600, color: C.ink, marginTop: 34 }}>Writing your recap</div>
        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ width: 200, height: 10, borderRadius: 5, background: "#E6E9ED" }} />
          <div style={{ width: 150, height: 10, borderRadius: 5, background: "#E6E9ED" }} />
        </div>
      </div>
    ) : null}
  </>
);

// 0:15: the client's CRM profile beside the phone, its meeting notes filling
// in live as the meeting records. `notes` (0–1) writes the lines; `synced` (0–1) turns
// "Syncing" into "Synced".
export const PROFILE: Rect = { x: 796, y: 662, w: 516, h: 238 };
export const ProfileCardContent: React.FC<{ readonly notes?: number; readonly synced?: number; readonly spin?: number }> = ({ notes = 1, synced = 0, spin = 0 }) => {
  const line = (i: number) => Math.min(1, Math.max(0, notes * 3 - i));
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 28,
          top: 26,
          width: 54,
          height: 54,
          borderRadius: "50%",
          background: C.green100,
          color: C.green,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Users size={26} strokeWidth={2.2} />
      </div>
      <div style={{ position: "absolute", left: 98, top: 27, fontSize: 22, fontWeight: 600, color: C.ink, whiteSpace: "nowrap" }}>Allison &amp; Frank Chan</div>
      <div style={{ position: "absolute", left: 98, top: 58, fontSize: 16, color: C.muted }}>Client profile</div>
      <div
        style={{
          position: "absolute",
          right: 24,
          top: 32,
          height: 32,
          padding: "0 12px",
          borderRadius: 16,
          background: C.green50,
          color: C.green,
          fontSize: 15,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 7,
          scale: 1 + 0.12 * Math.sin(Math.min(1, synced) * Math.PI),
        }}
      >
        {synced < 0.5 ? <RefreshCw size={15} strokeWidth={2.4} style={{ rotate: `${spin}deg` }} /> : <Check size={16} strokeWidth={2.8} />}
        {synced < 0.5 ? "Syncing" : "Synced"}
      </div>
      <div style={{ position: "absolute", left: 28, right: 28, top: 104, height: 1, background: "#EEF0F2" }} />
      <Label style={{ position: "absolute", left: 28, top: 124 }}>Meeting notes</Label>
      {[0.92, 0.78, 0.55].map((w, i) => (
        <div key={i} style={{ position: "absolute", left: 28, top: 158 + i * 24, width: `${w * line(i) * 85}%`, height: 12, borderRadius: 6, background: "#E6E9ED" }} />
      ))}
    </>
  );
};

export const PHONE_SCREEN = { w: 340, h: 700, radius: 50 };

// The vector phone with its content scaled to the screen rect.
export const ScreenPhone: React.FC<{
  readonly screen: Rect;
  readonly radius?: number;
  readonly frame?: number;
  readonly chrome?: number;
  readonly screenStyle?: React.CSSProperties;
  readonly children?: React.ReactNode;
}> = ({ screen, radius = PHONE_SCREEN.radius, frame = 1, chrome = 1, screenStyle, children }) => (
  <div style={{ position: "absolute", inset: 0, fontFamily: FONT.sans }}>
    <Phone screen={screen} radius={radius} frame={frame} chrome={chrome} screenStyle={screenStyle}>
      {children}
    </Phone>
  </div>
);

// Phone content laid out at 340×700, scaled to fill `w`.
export const Scaled: React.FC<{ readonly w: number; readonly opacity?: number; readonly children: React.ReactNode }> = ({ w, opacity = 1, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: PHONE_SCREEN.w, height: PHONE_SCREEN.h, scale: w / PHONE_SCREEN.w, transformOrigin: "0 0", opacity }}>
    {children}
  </div>
);

const RecordingPhone: React.FC<{ readonly x: number; readonly y: number; readonly writing?: boolean }> = ({ x, y, writing = false }) => (
  <ScreenPhone screen={{ x, y, w: PHONE_SCREEN.w, h: PHONE_SCREEN.h }}>
    <PhoneScreen writing={writing ? 1 : 0} />
  </ScreenPhone>
);

const PresentHeadline: React.FC = () => <Headline {...PRESENT_HEADLINE} />;

// F6 · 0:10 — presenting the plan from the prep.
export const F06Present: React.FC = () => (
  <>
    <Bg bg={P.bg} />
    <Tracker step={1} />
    <PresentHeadline />
    <Card style={{ left: PRESENT.x, top: PRESENT.y, width: PRESENT.w, height: PRESENT.h }}>
      <PresentationContent />
    </Card>
  </>
);

// F7a · 0:11.5 — the client asks a what-if.
export const F07Question: React.FC = () => (
  <>
    <Bg bg={P.bg} />
    <Tracker step={1} />
    <PresentHeadline />
    <QuestionBubble />
    <Card style={{ left: PRESENT.x, top: PRESENT.y, width: PRESENT.w, height: PRESENT.h }}>
      <PresentationContent />
    </Card>
    <Cursor {...knobAt(KNOB.from)} />
  </>
);

// F7b · 0:13 — answered live: contributions up $15K, the plan redraws.
export const F07WhatIf: React.FC = () => (
  <>
    <Bg bg={P.bg} />
    <Tracker step={1} />
    <PresentHeadline />
    <QuestionBubble />
    <Card style={{ left: PRESENT.x, top: PRESENT.y, width: PRESENT.w, height: PRESENT.h }}>
      <PresentationContent drag={1} hot={1} />
    </Card>
    <Cursor {...knobAt(KNOB.to)} />
  </>
);

// F8 · 0:15 — the same meeting, recorded: presentation behind, phone in front,
// the notes syncing to the client's profile in the CRM.
export const F08Capture: React.FC = () => (
  <>
    <Bg bg={P.bg} />
    <Tracker step={1} />
    <Headline {...CAPTURE_HEADLINE} />
    <Card
      style={{
        left: CAPTURE_BACK.x,
        top: CAPTURE_BACK.y,
        width: PRESENT.w,
        height: PRESENT.h,
        scale: CAPTURE_BACK.scale,
        opacity: CAPTURE_BACK.opacity,
        transformOrigin: "0 0",
      }}
    >
      <PresentationContent drag={1} />
    </Card>
    <Card style={{ left: PROFILE.x, top: PROFILE.y, width: PROFILE.w, height: PROFILE.h, borderRadius: 18 }}>
      <ProfileCardContent notes={0.8} spin={40} />
    </Card>
    <RecordingPhone x={1340} y={190} />
  </>
);

// F9 · 0:17 — hand-off: the recording becomes the recap. The phone comes up
// close, running off the bottom of the frame; blue sweeps in.
const CLOSE_UP = 1.5;
export const F09Writing: React.FC = () => (
  <>
    <BgSweep from="mint" to="blue" at={0.7} />
    <div style={{ position: "absolute", inset: 0, scale: CLOSE_UP, transformOrigin: "960px 200px" }}>
      <RecordingPhone x={790} y={200} writing />
    </div>
    <Tracker step={1} />
  </>
);
