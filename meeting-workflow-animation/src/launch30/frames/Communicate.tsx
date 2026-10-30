import { Mic } from "lucide-react";
import React from "react";
import { Phone } from "../../capture/components/Phone";
import { Waveform } from "../../capture/components/Waveform";
import { AIIcon } from "../../shared/components/AIIcon";
import { Bg, BgSweep, Card, Cursor, Headline, HouseholdChip } from "../components/Bits";
import { AbstractChart } from "../components/Chart";
import { lerp, Rect } from "../components/Motion";
import { Tracker } from "../components/Tracker";
import { C, centerTop, FONT, phase, UI } from "../theme";

const P = phase("communicate");
const RED = "#AD3A35";

export const PRESENT_HEADLINE = { eyebrow: "Live presentation", color: P.accent, lines: ["Plan live,", "together"] };
export const CAPTURE_HEADLINE = { eyebrow: "Meeting capture", color: P.accent, lines: ["Every word,", "on the record"] };
// The plan as it lifts out of the prep, and as it is presented.
export const LIFT: Rect = { x: 1040, y: centerTop(450), w: 720, h: 450 };
export const PRESENT: Rect = { x: UI.x, y: centerTop(660), w: UI.w, h: 660 };
// Contributions slider knob, in canvas px, at slider position p.
const SLIDERS_TOP = 540;
export const knobAt = (p: number) => ({ x: PRESENT.x + 44 + p * 360, y: PRESENT.y + SLIDERS_TOP + 42 });
export const KNOB = { from: 0.5, to: 0.65 };

const Slider: React.FC<{ readonly label: string; readonly value: string; readonly p: number; readonly hot?: number }> = ({ label, value, p, hot = 0 }) => (
  <div style={{ width: 360 }}>
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
          w={lerp(640, 812, m)}
          h={lerp(290, 330, m)}
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
      <div style={{ position: "absolute", left: 44, right: 44, top: 506, height: 1, background: "#EEF0F2", opacity: c }} />
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

// F7 · 0:12.5 — a what-if, answered live.
export const F07WhatIf: React.FC = () => (
  <>
    <Bg bg={P.bg} />
    <Tracker step={1} />
    <PresentHeadline />
    <Card style={{ left: PRESENT.x, top: PRESENT.y, width: PRESENT.w, height: PRESENT.h }}>
      <PresentationContent drag={1} hot={1} />
    </Card>
    <Cursor {...knobAt(KNOB.to)} />
  </>
);

// F8 · 0:14.5 — the same meeting, recorded: presentation behind, phone in front.
export const F08Capture: React.FC = () => (
  <>
    <Bg bg={P.bg} />
    <Tracker step={1} />
    <Headline {...CAPTURE_HEADLINE} />
    <Card style={{ left: 820, top: 232, width: PRESENT.w, height: PRESENT.h, scale: 0.84, opacity: 0.5, transformOrigin: "0 0" }}>
      <PresentationContent drag={1} />
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
