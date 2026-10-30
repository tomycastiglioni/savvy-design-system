import React from "react";
import { AIIcon, AIIconAvatar } from "../../shared/components/AIIcon";
import { Bar, Bg, BgSweep, Card, Cursor, Headline, HouseholdChip, Label } from "../components/Bits";
import { AbstractChart } from "../components/Chart";
import { Tracker } from "../components/Tracker";
import { C, centerTop, FONT, MEETING, phase, UI } from "../theme";

const P = phase("prep");
const AGENDA = ["Check-in", "Portfolio", "Retirement plan", "Taxes"];

const PrepHeadline: React.FC = () => <Headline eyebrow="Meeting prep" color={P.accent} lines={["Prepared", "before you ask"]} />;

// The prep document, abstracted: one number, the agenda, three tasks.
const PrepDoc: React.FC<{ readonly highlight?: boolean; readonly style?: React.CSSProperties }> = ({ highlight = false, style }) => (
  <Card style={{ left: UI.x, top: centerTop(600), width: UI.w, height: 600, ...style }}>
    <div style={{ position: "absolute", left: 44, top: 40, fontFamily: FONT.serif, fontSize: 46, color: C.ink }}>{MEETING}</div>
    <div style={{ position: "absolute", right: 40, top: 48 }}>
      <HouseholdChip meeting={false} />
    </div>
    <div style={{ position: "absolute", left: 44, right: 44, top: 128, height: 1, background: "#EEF0F2" }} />

    <div style={{ position: "absolute", left: 44, top: 166, width: 240 }}>
      <Label>Household</Label>
      <div style={{ fontSize: 54, fontWeight: 600, color: C.ink, marginTop: 14, letterSpacing: "-0.01em" }}>$9.36M</div>
      <div style={{ display: "inline-block", marginTop: 10, padding: "5px 12px", borderRadius: 999, background: C.green50, color: C.green, fontSize: 17, fontWeight: 600 }}>
        +5.9% YTD
      </div>
      <Bar w={220} style={{ marginTop: 34 }} />
      <Bar w={190} style={{ marginTop: 14 }} />
      <Bar w={150} style={{ marginTop: 14 }} />
    </div>

    <div style={{ position: "absolute", left: 330, top: 166, width: 250 }}>
      <Label>Agenda</Label>
      {AGENDA.map((item, i) => {
        const on = highlight && i === 2;
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
              background: on ? "#F4EFE4" : "transparent",
              boxShadow: on ? `0 0 0 2px ${P.accent}` : "none",
            }}
          >
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: on ? P.accent : "#F1F3F5", color: on ? C.white : C.muted, fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {i + 1}
            </div>
            <div style={{ fontSize: 20, fontWeight: 500, color: C.ink }}>{item}</div>
          </div>
        );
      })}
    </div>

    <div style={{ position: "absolute", left: 620, top: 166, width: 236 }}>
      <Label>Tasks</Label>
      {[130, 160, 110].map((w, i) => (
        <div key={w} style={{ display: "flex", alignItems: "center", gap: 12, height: 58, marginTop: i ? 8 : 14 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${C.border}` }} />
          <Bar w={w} strong />
          <div style={{ marginLeft: "auto", width: 12, height: 12, borderRadius: 6, background: i === 1 ? "#E3B65C" : "#7FC09B" }} />
        </div>
      ))}
    </div>

    <div style={{ position: "absolute", left: 44, right: 44, top: 478, height: 1, background: "#EEF0F2" }} />
    <div style={{ position: "absolute", left: 44, top: 506, display: "flex", alignItems: "center", gap: 10, fontSize: 16, color: C.muted }}>
      <AIIcon size={20} /> Prepared by Savvy Intelligence
    </div>
  </Card>
);

// F3 · 0:04 — the tracker arrives on top; the prep is waiting before the
// advisor asks.
export const F03PrepReady: React.FC = () => (
  <>
    <Bg bg={P.bg} />
    <Tracker step={0} />
    <PrepHeadline />
    <Card style={{ left: 960, top: centerTop(300), width: 700, height: 300 }}>
      <div style={{ position: "absolute", left: 38, top: 40 }}>
        <AIIconAvatar size={72} />
      </div>
      <div style={{ position: "absolute", left: 134, top: 38, fontSize: 32, fontWeight: 600, color: C.ink }}>Prep ready</div>
      <div style={{ position: "absolute", left: 134, top: 90 }}>
        <HouseholdChip />
      </div>
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
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 18,
          fontWeight: 500,
          color: C.ink,
        }}
      >
        <AIIcon size={22} /> Review prep
      </div>
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
    <PrepDoc />
  </>
);

// F5 · 0:09 — hand-off: the agenda's retirement plan lifts out of the prep
// and becomes what gets presented. The green of Communicate sweeps in.
export const F05Handoff: React.FC = () => (
  <>
    <BgSweep from="cream" to="mint" />
    <Tracker step={0} toward={0.5} />
    <PrepDoc highlight style={{ left: 300, top: centerTop(600) + 30, scale: 0.92, opacity: 0.55 }} />
    <Card style={{ left: 1040, top: centerTop(450), width: 720, height: 450, boxShadow: "0 40px 90px -30px rgba(16, 24, 40, 0.35)" }}>
      <div style={{ position: "absolute", left: 40, top: 36, fontFamily: FONT.serif, fontSize: 36, color: C.ink }}>Retirement plan</div>
      <div style={{ position: "absolute", left: 40, top: 120 }}>
        <AbstractChart w={640} h={290} color={C.green} />
      </div>
    </Card>
  </>
);
