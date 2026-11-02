import "../mobile-prep/fonts";
import { CircleCheck, FileText, Send } from "lucide-react";
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Card, Label, NavBar } from "../mobile-household/components";
import { HomeIndicator, StatusBar } from "../mobile-prep/components/SystemUI";
import { BUTTON_BG, C, FONT, H, PAD, SCALE, W } from "../mobile-prep/layout";
import { AIIcon } from "../shared/components/AIIcon";
import { RecordedPill } from "./components";
import { EMAIL, NEXT_STEPS, POINTS, RECAP } from "./content";
import { RecapScreen } from "./screens/RecapScreen";
import { T } from "./timeline";

// Static options for the mobile recap video (the recap and the follow-up,
// ready to send), one per frame: A · recap card (approved, animated in
// MobileRecap), B · email first, C · written recap. Layout in iOS points, scaled ×3 like MobilePrep. Render with
// `remotion still`.

const PrimaryButton: React.FC<{ readonly top: number; readonly label: string }> = ({ top, label }) => (
  <div
    style={{
      position: "absolute",
      left: PAD,
      right: PAD,
      top,
      height: 50,
      borderRadius: 25,
      background: BUTTON_BG,
      color: C.white,
      fontSize: 16,
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    }}
  >
    <Send size={17} strokeWidth={2.2} /> {label}
  </div>
);

const Check: React.FC = () => <CircleCheck size={20} strokeWidth={2.2} color={C.green} style={{ flexShrink: 0 }} />;

// A · Recap card: the approved direction, built in MobileRecap with option
// C's header (recorded pill, "Review recap"). Shown just before Send is pressed.
const OptionA: React.FC = () => <RecapScreen t={T.press - 0.05} fps={30} />;

// B · Email first: the follow-up itself, with the agreed points and the recap attached.
const OptionB: React.FC = () => (
  <AbsoluteFill style={{ background: C.panel }}>
    <NavBar />
    <div style={{ position: "absolute", left: PAD, right: PAD, top: 104, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ fontSize: 25, fontWeight: 600, letterSpacing: "-0.01em", color: C.ink }}>Follow-up</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, height: 28, padding: "0 11px", borderRadius: 14, background: C.green50, color: C.green, fontSize: 12.5, fontWeight: 600 }}>
        <CircleCheck size={14} strokeWidth={2.2} /> Ready to send
      </div>
    </div>
    <Card style={{ position: "absolute", left: PAD - 4, right: PAD - 4, top: 156, padding: "4px 18px 18px" }}>
      {[
        ["To", EMAIL.to],
        ["Subject", EMAIL.subject],
      ].map(([k, v]) => (
        <div key={k} style={{ display: "flex", alignItems: "center", gap: 10, height: 46, borderBottom: `1px solid ${C.borderSoft}`, fontSize: 15 }}>
          <span style={{ color: C.muted, width: 58 }}>{k}</span>
          <span style={{ color: C.ink, fontWeight: 600 }}>{v}</span>
        </div>
      ))}
      <div style={{ fontSize: 16, color: C.body, lineHeight: 1.45, marginTop: 14 }}>
        {EMAIL.greeting}
        <br />
        {EMAIL.intro}
      </div>
      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
        {POINTS.map((p) => (
          <div key={p} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 16, fontWeight: 600, color: C.ink }}>
            <Check /> {p}
          </div>
        ))}
      </div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 16, padding: "8px 12px", borderRadius: 10, background: C.tabsBg, fontSize: 13.5, fontWeight: 500, color: C.body }}>
        <FileText size={16} strokeWidth={2} color={C.muted} /> {EMAIL.attachment}
      </div>
    </Card>
    <PrimaryButton top={548} label="Send" />
  </AbsoluteFill>
);

const Avatar: React.FC<{ readonly initials: string; readonly you?: boolean }> = ({ initials, you = false }) => (
  <div
    style={{
      width: 30,
      height: 30,
      borderRadius: 15,
      background: you ? BUTTON_BG : C.green50,
      color: you ? C.white : C.green,
      fontSize: 12,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    {initials}
  </div>
);

// C · Written recap: what was recorded, what was decided, who does what, and
// the drafted follow-up waiting at the bottom.
const OptionC: React.FC = () => (
  <AbsoluteFill style={{ background: C.white }}>
    <NavBar />
    <RecordedPill style={{ position: "absolute", left: PAD, top: 104 }} />
    <div style={{ position: "absolute", left: PAD, right: PAD, top: 146 }}>
      <div style={{ fontFamily: FONT.serif, fontSize: 34, lineHeight: 1.1, color: C.ink }}>{RECAP.title}</div>
      <div style={{ fontSize: 14, color: C.muted, marginTop: 6 }}>{RECAP.short}</div>
    </div>
    <Label style={{ position: "absolute", left: PAD, top: 240 }}>Decisions</Label>
    <div style={{ position: "absolute", left: PAD, right: PAD, top: 262 }}>
      {POINTS.map((p) => (
        <div key={p} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: `1px solid ${C.borderSoft}` }}>
          <Check />
          <div style={{ fontSize: 18, fontWeight: 600, color: C.ink }}>{p}</div>
        </div>
      ))}
    </div>
    <Label style={{ position: "absolute", left: PAD, top: 444 }}>Next steps</Label>
    <div style={{ position: "absolute", left: PAD, right: PAD, top: 466 }}>
      {NEXT_STEPS.map((s) => (
        <div key={s.text} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: `1px solid ${C.borderSoft}` }}>
          <Avatar initials={s.initials} you={s.owner === "You"} />
          <div style={{ fontSize: 17, fontWeight: 600, color: C.ink }}>{s.text}</div>
          <div style={{ marginLeft: "auto", fontSize: 13.5, color: C.muted }}>{s.owner}</div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 664, height: 119, borderTop: `1px solid ${C.borderSoft}`, background: C.white }} />
    <div style={{ position: "absolute", left: PAD, right: PAD, top: 678, display: "flex", alignItems: "center", gap: 10 }}>
      <AIIcon size={22} />
      <div>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.ink }}>Follow-up drafted</div>
        <div style={{ fontSize: 12.5, color: C.muted, marginTop: 1 }}>To Dave R., recap attached</div>
      </div>
      <div style={{ marginLeft: "auto", height: 40, padding: "0 16px", borderRadius: 20, background: BUTTON_BG, color: C.white, fontSize: 14.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
        <Send size={15} strokeWidth={2.2} /> Send
      </div>
    </div>
  </AbsoluteFill>
);

export const OPTIONS = [OptionA, OptionB, OptionC];

export const MobileRecapOptions: React.FC = () => {
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
