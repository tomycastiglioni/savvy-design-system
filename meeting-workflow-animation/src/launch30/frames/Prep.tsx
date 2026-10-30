import React from "react";
import { interpolate } from "remotion";
import { AIIcon, AIIconAvatar } from "../../shared/components/AIIcon";
import { Bar, Bg, BgSweep, Card, Cursor, Headline, HouseholdChip, Label } from "../components/Bits";
import { Rect } from "../components/Motion";
import { Tracker } from "../components/Tracker";
import { C, centerTop, CLAMP, EASE_OUT, FONT, MEETING, phase, UI } from "../theme";
import { PresentationContent } from "./Communicate";

const P = phase("prep");
const AGENDA = ["Check-in", "Portfolio", "Retirement plan", "Taxes"];

export const PREP_HEADLINE = { eyebrow: "Meeting prep", color: P.accent, lines: ["Prepared", "before you ask"] };
export const PREP_CARD: Rect = { x: 960, y: centerTop(300), w: 700, h: 300 };
export const PREP_DOC: Rect = { x: UI.x, y: centerTop(600), w: UI.w, h: 600 };
// Where things sit, in canvas px: the household chip inside the prep card
// (size 17), the Review prep button, and agenda item 3 inside the document.
export const CARD_CHIP = { x: PREP_CARD.x + 134, y: PREP_CARD.y + 90 };
export const REVIEW_BTN = { x: PREP_CARD.x + 220, y: PREP_CARD.y + 246 };
export const AGENDA_ITEM: Rect = { x: PREP_DOC.x + 318, y: PREP_DOC.y + 330, w: 262, h: 58 };

// Item `i` of `n` fading up as `reveal` goes 0 → 1.
export const stagger = (reveal: number, i: number, n: number): React.CSSProperties => {
  const p = interpolate(reveal * (n + 1) - i, [0, 2], [0, 1], { ...CLAMP, easing: EASE_OUT });
  return { opacity: p, translate: `0px ${(1 - p) * 10}px` };
};

// The prep-ready card's content, laid out in PREP_CARD's 700×300 box.
export const PrepCardContent: React.FC<{ readonly chip?: boolean; readonly press?: number }> = ({ chip = true, press = 0 }) => (
  <>
    <div style={{ position: "absolute", left: 38, top: 40 }}>
      <AIIconAvatar size={72} />
    </div>
    <div style={{ position: "absolute", left: 134, top: 38, fontSize: 32, fontWeight: 600, color: C.ink }}>Prep ready</div>
    {chip ? (
      <div style={{ position: "absolute", left: 134, top: 90 }}>
        <HouseholdChip />
      </div>
    ) : null}
    <Bar w={440} style={{ position: "absolute", left: 134, top: 156 }} />
    <Bar w={320} style={{ position: "absolute", left: 134, top: 182 }} />
    <div
      style={{
        position: "absolute",
        left: 134,
        top: 222,
        height: 48,
        padding: "0 20px",
        borderRadius: 12,
        border: `1.5px solid ${C.border}`,
        background: press > 0 ? `rgba(245, 246, 248, ${press})` : C.white,
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 18,
        fontWeight: 500,
        color: C.ink,
        scale: 1 - 0.04 * press,
      }}
    >
      <AIIcon size={22} /> Review prep
    </div>
  </>
);

// The prep document's content (one number, the agenda, three tasks), laid out
// in PREP_DOC's 900×600 box. `reveal` fills it in; `highlight` marks agenda
// item 3, the plan that gets presented.
export const PrepDocContent: React.FC<{ readonly reveal?: number; readonly highlight?: number }> = ({ reveal = 1, highlight = 0 }) => {
  const N = 8;
  const s = (i: number) => stagger(reveal, i, N);
  const aum = 9.36 * interpolate(reveal, [0.1, 0.7], [0, 1], { ...CLAMP, easing: EASE_OUT });
  return (
    <>
      <div style={{ position: "absolute", left: 44, top: 40, fontFamily: FONT.serif, fontSize: 46, color: C.ink, ...s(0) }}>{MEETING}</div>
      <div style={{ position: "absolute", right: 40, top: 48, ...s(0) }}>
        <HouseholdChip meeting={false} />
      </div>
      <div style={{ position: "absolute", left: 44, right: 44, top: 128, height: 1, background: "#EEF0F2" }} />

      <div style={{ position: "absolute", left: 44, top: 166, width: 240 }}>
        <div style={s(1)}>
          <Label>Household</Label>
          <div style={{ fontSize: 54, fontWeight: 600, color: C.ink, marginTop: 14, letterSpacing: "-0.01em", fontVariantNumeric: "tabular-nums" }}>
            ${aum.toFixed(2)}M
          </div>
        </div>
        <div style={{ display: "inline-block", marginTop: 10, padding: "5px 12px", borderRadius: 999, background: C.green50, color: C.green, fontSize: 17, fontWeight: 600, ...s(2) }}>
          +5.9% YTD
        </div>
        <div style={s(3)}>
          <Bar w={220} style={{ marginTop: 34 }} />
          <Bar w={190} style={{ marginTop: 14 }} />
          <Bar w={150} style={{ marginTop: 14 }} />
        </div>
      </div>

      <div style={{ position: "absolute", left: 330, top: 166, width: 250 }}>
        <Label style={s(1)}>Agenda</Label>
        {AGENDA.map((item, i) => {
          const on = i === 2 ? highlight : 0;
          return (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                height: 58,
                marginTop: i ? 8 : 14,
                padding: "0 12px",
                marginLeft: -12,
                borderRadius: 12,
                background: `rgba(244, 239, 228, ${on})`,
                boxShadow: on > 0 ? `0 0 0 2px rgba(142, 126, 87, ${on})` : "none",
                ...s(2 + i * 0.6),
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: on > 0.5 ? P.accent : "#F1F3F5",
                  color: on > 0.5 ? C.white : C.muted,
                  fontSize: 15,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {i + 1}
              </div>
              <div style={{ fontSize: 20, fontWeight: 500, color: C.ink }}>{item}</div>
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", left: 620, top: 166, width: 236 }}>
        <Label style={s(2)}>Tasks</Label>
        {[130, 160, 110].map((w, i) => (
          <div key={w} style={{ display: "flex", alignItems: "center", gap: 12, height: 58, marginTop: i ? 8 : 14, ...s(3 + i * 0.6) }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${C.border}` }} />
            <Bar w={w} strong />
            <div style={{ marginLeft: "auto", width: 12, height: 12, borderRadius: 6, background: i === 1 ? "#E3B65C" : "#7FC09B" }} />
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", left: 44, right: 44, top: 478, height: 1, background: "#EEF0F2", ...s(6) }} />
      <div style={{ position: "absolute", left: 44, top: 506, display: "flex", alignItems: "center", gap: 10, fontSize: 16, color: C.muted, ...s(6) }}>
        <AIIcon size={20} /> Prepared by Savvy Intelligence
      </div>
    </>
  );
};

const PrepHeadline: React.FC = () => <Headline {...PREP_HEADLINE} />;

// F3 · 0:04 — the tracker arrives on top; the prep is waiting before the
// advisor asks.
export const F03PrepReady: React.FC = () => (
  <>
    <Bg bg={P.bg} />
    <Tracker step={0} />
    <PrepHeadline />
    <Card style={{ left: PREP_CARD.x, top: PREP_CARD.y, width: PREP_CARD.w, height: PREP_CARD.h }}>
      <PrepCardContent />
    </Card>
    <Cursor x={1196} y={638} />
  </>
);

// F4 · 0:06 — the prep document.
export const F04PrepDoc: React.FC = () => (
  <>
    <Bg bg={P.bg} />
    <Tracker step={0} />
    <PrepHeadline />
    <Card style={{ left: PREP_DOC.x, top: PREP_DOC.y, width: PREP_DOC.w, height: PREP_DOC.h }}>
      <PrepDocContent />
    </Card>
  </>
);

// F5 · 0:09 — hand-off: the agenda's retirement plan lifts out of the prep
// and becomes what gets presented. The green of Communicate sweeps in.
export const F05Handoff: React.FC = () => (
  <>
    <BgSweep from="cream" to="mint" />
    <Tracker step={0} />
    <Card style={{ left: 300, top: PREP_DOC.y + 30, width: PREP_DOC.w, height: PREP_DOC.h, scale: 0.92, opacity: 0.55 }}>
      <PrepDocContent highlight={1} />
    </Card>
    <Card style={{ left: 1040, top: centerTop(450), width: 720, height: 450, boxShadow: "0 40px 90px -30px rgba(16, 24, 40, 0.35)" }}>
      <PresentationContent m={0} chrome={0} />
    </Card>
  </>
);
