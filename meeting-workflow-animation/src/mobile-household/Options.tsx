import "../mobile-prep/fonts";
import { CircleCheck, Flag, TrendingUp, Wallet } from "lucide-react";
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HomeIndicator, StatusBar } from "../mobile-prep/components/SystemUI";
import { BUTTON_BG, C, FONT, H, PAD, SCALE, TILE, W } from "../mobile-prep/layout";
import { AIIcon } from "../shared/components/AIIcon";
import { Card, Label, NavBar } from "./components";
import { AGENDA, BUTTON, HOUSEHOLD, STATS } from "./content";
import { HouseholdScreen } from "./screens/HouseholdScreen";

// Static options for the 3 s mobile household video (summary + agenda), one
// per frame: A · big number (approved, animated in MobileHousehold), B · stats
// and agenda cards, C · written brief. Layout in iOS points, scaled ×3 like
// MobilePrep. Render with `remotion still`.

const ICONS = { summary: TrendingUp, agenda: Wallet, flagged: Flag };

// A · Big number: the household's total up top, the agenda as three numbered
// rows. The finished frame of the animated screen.
const OptionA: React.FC = () => <HouseholdScreen t={Infinity} fps={30} />;

// B · Cards: three household stats in a row, the agenda with times, a start button.
const OptionB: React.FC = () => (
  <AbsoluteFill style={{ background: C.panel }}>
    <NavBar />
    <div style={{ position: "absolute", left: PAD, right: PAD, top: 104, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontSize: 25, fontWeight: 600, letterSpacing: "-0.01em", color: C.ink }}>{HOUSEHOLD.meeting}</div>
        <div style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>{HOUSEHOLD.when}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, height: 28, padding: "0 11px", borderRadius: 14, background: C.green50, color: C.green, fontSize: 12.5, fontWeight: 600, marginTop: 4 }}>
        <CircleCheck size={14} strokeWidth={2.2} /> Prep ready
      </div>
    </div>
    <Label style={{ position: "absolute", left: PAD, top: 186 }}>Household</Label>
    <Card style={{ position: "absolute", left: PAD - 4, right: PAD - 4, top: 210, display: "flex", padding: "18px 0" }}>
      {STATS.map((s, i) => (
        <div key={s.label} style={{ flex: 1, textAlign: "center", borderLeft: i ? `1px solid ${C.borderSoft}` : "none" }}>
          <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.01em", color: s.up ? C.green : C.ink, fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: C.muted, marginTop: 3 }}>{s.label}</div>
        </div>
      ))}
    </Card>
    <Label style={{ position: "absolute", left: PAD, top: 322 }}>Agenda</Label>
    <Card style={{ position: "absolute", left: PAD - 4, right: PAD - 4, top: 346, padding: "2px 18px" }}>
      {AGENDA.map((item, i) => {
        const Icon = ICONS[item.kind];
        const tile = TILE[item.kind];
        return (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 14, height: 64, borderTop: i ? `1px solid ${C.borderSoft}` : "none" }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: tile.bg, color: tile.fg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={19} strokeWidth={2.2} />
            </div>
            <div style={{ fontSize: 17, fontWeight: 600, color: C.ink }}>{item.label}</div>
            <div style={{ marginLeft: "auto", fontSize: 13.5, color: C.muted, fontVariantNumeric: "tabular-nums" }}>{item.minutes} min</div>
          </div>
        );
      })}
    </Card>
    <div
      style={{
        position: "absolute",
        left: PAD,
        right: PAD,
        top: 572,
        height: 50,
        borderRadius: 25,
        background: BUTTON_BG,
        color: C.white,
        fontSize: 16,
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {BUTTON}
    </div>
  </AbsoluteFill>
);

// C · Brief: who it is, one written line from Savvy, then the agenda as a big numbered list.
const OptionC: React.FC = () => (
  <AbsoluteFill style={{ background: C.white }}>
    <NavBar />
    <div style={{ position: "absolute", left: PAD, right: PAD, top: 108, display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 54, height: 54, borderRadius: 27, background: C.green50, color: C.green, fontSize: 19, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {HOUSEHOLD.initials}
      </div>
      <div>
        <div style={{ fontSize: 23, fontWeight: 600, letterSpacing: "-0.01em", color: C.ink }}>{HOUSEHOLD.name}</div>
        <div style={{ fontSize: 14, color: C.muted, marginTop: 2 }}>Household · {STATS[2].value} accounts</div>
      </div>
    </div>
    <div style={{ position: "absolute", left: PAD - 4, right: PAD - 4, top: 196, padding: "18px 20px 20px", borderRadius: 20, background: "#F3F8F5" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: C.green }}>
        <AIIcon size={18} /> Summary
      </div>
      <div style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.3, letterSpacing: "-0.01em", color: C.ink, marginTop: 10 }}>
        Portfolio up <span style={{ color: C.green, fontWeight: 600 }}>6.1%</span> this year. One RMD still to take.
      </div>
    </div>
    <Label style={{ position: "absolute", left: PAD, top: 362 }}>Agenda</Label>
    <div style={{ position: "absolute", left: PAD, right: PAD, top: 384 }}>
      {AGENDA.map((item, i) => (
        <div key={item.label} style={{ display: "flex", alignItems: "baseline", gap: 16, padding: "14px 0", borderBottom: `1px solid ${C.borderSoft}` }}>
          <div style={{ fontFamily: FONT.serif, fontSize: 30, lineHeight: 1, color: C.green, width: 22 }}>{i + 1}</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: C.ink }}>{item.label}</div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: PAD, top: 640, display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.muted }}>
      <AIIcon size={16} /> Prepared by Savvy Intelligence
    </div>
  </AbsoluteFill>
);

export const OPTIONS = [OptionA, OptionB, OptionC];

export const MobileHouseholdOptions: React.FC = () => {
  const Option = OPTIONS[Math.min(useCurrentFrame(), OPTIONS.length - 1)];
  return (
    <AbsoluteFill style={{ background: C.white }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, scale: SCALE, transformOrigin: "0 0", overflow: "hidden", fontFamily: FONT.sans }}>
        <Option />
        <StatusBar />
        <HomeIndicator />
      </div>
    </AbsoluteFill>
  );
};
