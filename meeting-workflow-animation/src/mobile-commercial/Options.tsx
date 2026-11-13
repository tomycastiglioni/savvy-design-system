import "../mobile-prep/fonts";
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HomeIndicator, StatusBar } from "../mobile-prep/components/SystemUI";
import { C, FONT, H, SCALE, W } from "../mobile-prep/layout";
import { CLOCK } from "./content";
import { MeetingA, MeetingB, MeetingC, PlanA, PlanB, PlanC, RecapA, RecapB, RecapC } from "./Screens";

// Static options for the commercial's three phone screens, three each. The
// full-size stills (1080×2348, a 3× iPhone screen like the earlier mobile
// videos) are frames of MobileCommercialOptions; each screen also has a board
// with its options side by side (screen 3 shows each option ready, then sent).

export type ScreenKey = "meeting" | "plan" | "recap";
type Opt = { readonly key: string; readonly screen: ScreenKey; readonly label: string; readonly caption: string; readonly node: React.ReactNode; readonly light?: boolean };

export const OPTIONS: readonly Opt[] = [
  { key: "1A", screen: "meeting", label: "A · Meeting card", caption: "The meeting as a dark card up top: who, when, where. The household under it, then the agenda.", node: <MeetingA /> },
  { key: "1B", screen: "meeting", label: "B · Calendar", caption: "The time and the club up front, with a map. The household as three tiles, the agenda as rows.", node: <MeetingB /> },
  { key: "1C", screen: "meeting", label: "C · Brief", caption: "Savvy’s household summary written out in one line, then the agenda as a large numbered list.", node: <MeetingC /> },
  { key: "2A", screen: "plan", label: "A · Chart card", caption: "The projection as one large chart, “On track”, and its one result big underneath.", node: <PlanA /> },
  { key: "2B", screen: "plan", label: "B · Result first", caption: "The result as a big ring, “On track to retire at 65”, the projection smaller below.", node: <PlanB /> },
  { key: "2C", screen: "plan", label: "C · Full bleed", caption: "The plan on Savvy green: “Dave can retire at 65.”, the projection across the screen, the result.", node: <PlanC />, light: true },
  { key: "3A", screen: "recap", label: "A · Recap card", caption: "Decisions and next steps, “Send follow-up” at the foot…", node: <RecapA /> },
  { key: "3A-sent", screen: "recap", label: "", caption: "…which turns into “Follow-up sent.”", node: <RecapA sent={1} /> },
  { key: "3B", screen: "recap", label: "B · Email", caption: "The drafted follow-up itself, ready to send…", node: <RecapB /> },
  { key: "3B-sent", screen: "recap", label: "", caption: "…then a full-screen “Follow-up sent.”", node: <RecapB sent={1} /> },
  { key: "3C", screen: "recap", label: "C · Assistant", caption: "Savvy in a thread: the recap is ready, “Send the follow-up.”…", node: <RecapC /> },
  { key: "3C-sent", screen: "recap", label: "", caption: "…and it confirms: “Follow-up sent.”", node: <RecapC sent={1} /> },
];

// A phone screen in points, with the system UI, at `scale` px per point.
export const Phone: React.FC<{ readonly opt: Opt; readonly scale: number; readonly style?: React.CSSProperties }> = ({ opt, scale, style }) => (
  <div style={{ position: "relative", width: W * scale, height: H * scale, overflow: "hidden", ...style }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, scale, transformOrigin: "0 0", overflow: "hidden", fontFamily: FONT.sans }}>
      {opt.node}
      <StatusBar time={CLOCK[opt.screen]} light={opt.light} />
      <HomeIndicator light={opt.light} />
    </div>
  </div>
);

export const MobileCommercialOptions: React.FC = () => {
  const opt = OPTIONS[Math.min(useCurrentFrame(), OPTIONS.length - 1)];
  return (
    <AbsoluteFill style={{ background: C.white }}>
      <Phone opt={opt} scale={SCALE} />
    </AbsoluteFill>
  );
};

// The board for one screen: its options side by side, labelled.
const TITLES: Record<ScreenKey, { n: number; title: string; brief: string }> = {
  meeting: { n: 1, title: "The meeting", brief: "Annual review · Dave R. · Today 10:30 AM · Pebble Creek GC → household summary (account changes, one open task, one flagged item) + short agenda." },
  plan: { n: 2, title: "The plan", brief: "Dave’s retirement plan: projection chart (on track) + one clear result, full screen, held." },
  recap: { n: 3, title: "The follow-up", brief: "Meeting recap ready → “Send the follow-up.” → “Follow-up sent.”" },
};
const PAD = 72;
export const boardSize = (screen: ScreenKey) => {
  const n = OPTIONS.filter((o) => o.screen === screen).length;
  const s = n > 3 ? 0.95 : 1.25;
  const gap = n > 3 ? 28 : 56;
  return { w: PAD * 2 + n * W * s + (n - 1) * gap, h: PAD + 210 + H * s + 110 + PAD - 30, s, gap };
};

export const MobileCommercialBoard: React.FC<{ readonly screen: ScreenKey }> = ({ screen }) => {
  const opts = OPTIONS.filter((o) => o.screen === screen);
  const { s, gap } = boardSize(screen);
  const t = TITLES[screen];
  return (
    <AbsoluteFill style={{ background: "#e9ecef", fontFamily: FONT.sans, color: C.ink, padding: PAD }}>
      <div style={{ height: 210 }}>
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted }}>Commercial · Mobile screen {t.n} · Options</div>
        <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.015em", marginTop: 12 }}>{t.title}</div>
        <div style={{ fontSize: 17, lineHeight: 1.45, color: C.body, marginTop: 10, maxWidth: 1100 }}>{t.brief}</div>
      </div>
      <div style={{ display: "flex", gap }}>
        {opts.map((o) => (
          <div key={o.key} style={{ width: W * s }}>
            <Phone opt={o} scale={s} style={{ borderRadius: 30, boxShadow: "0 30px 60px -30px rgba(16,24,40,0.35), 0 0 0 1px rgba(16,24,40,0.06)" }} />
            <div style={{ fontSize: 17, fontWeight: 600, marginTop: 16, minHeight: 22 }}>{o.label}</div>
            <div style={{ fontSize: 14, lineHeight: 1.45, color: C.muted, marginTop: 5 }}>{o.caption}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
