import React, { useState } from "react";
import { AbsoluteFill } from "remotion";
import "../shared/fonts";
import { loadDiatype } from "../launch/fonts";
import { FONT, MEDIUM } from "../more-ways/theme";
import { H, PAGE, W } from "./Bits";
import { CONTACTS_FRAMES, HouseholdContacts } from "./cards/HouseholdContacts";
import { MeetingPrep, PREP_FRAMES } from "./cards/MeetingPrep";
import { MeetingSummaries, SUMMARIES_FRAMES } from "./cards/MeetingSummaries";
import { PROSPECT_FRAMES, ProspectAnalysis } from "./cards/ProspectAnalysis";
import { REPORT_FRAMES, ReportBuilder } from "./cards/ReportBuilder";
import { SCENARIO_FRAMES, Scenarios } from "./cards/Scenarios";

// Storyboards for the hero's pill graphics: each pill's key frames on the
// hero's background, numbered, with what happens.

type Frame = { readonly node: React.ReactNode; readonly title: string; readonly caption: string };
export const HERO_PILLS = {
  scenarios: { label: "Financial planning scenarios", frames: (): Frame[] => SCENARIO_FRAMES.map((f) => ({ node: <Scenarios s={f.s} />, title: f.title, caption: f.caption })) },
  prep: { label: "Automated meeting prep", frames: (): Frame[] => PREP_FRAMES.map((f) => ({ node: <MeetingPrep s={f.s} />, title: f.title, caption: f.caption })) },
  summaries: { label: "Customizable meeting summaries", frames: (): Frame[] => SUMMARIES_FRAMES.map((f) => ({ node: <MeetingSummaries s={f.s} />, title: f.title, caption: f.caption })) },
  contacts: { label: "Household contact summaries", frames: (): Frame[] => CONTACTS_FRAMES.map((f) => ({ node: <HouseholdContacts s={f.s} />, title: f.title, caption: f.caption })) },
  report: { label: "Performance report builder", frames: (): Frame[] => REPORT_FRAMES.map((f) => ({ node: <ReportBuilder s={f.s} />, title: f.title, caption: f.caption })) },
  prospect: { label: "Prospect analysis", frames: (): Frame[] => PROSPECT_FRAMES.map((f) => ({ node: <ProspectAnalysis s={f.s} />, title: f.title, caption: f.caption })) },
} as const;
export type HeroPill = keyof typeof HERO_PILLS;
export const HERO_PILL_KEYS = Object.keys(HERO_PILLS) as HeroPill[];

const PAD = 72;
const GAP = 40;
const HEAD = 150;
const CAPTION = 96;
export const HERO_BOARD = { w: PAD * 2 + 3 * W + 2 * GAP, h: PAD + HEAD + H + CAPTION + PAD - 20 };

export const HeroStoryboard: React.FC<{ readonly pill: HeroPill }> = ({ pill }) => {
  useState(loadDiatype);
  const { label, frames } = HERO_PILLS[pill];
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, #0f3544 0%, ${PAGE} 100%)`, fontFamily: FONT, color: "#ffffff", padding: PAD }}>
      <div style={{ height: HEAD }}>
        <div style={{ fontSize: 15, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.55, fontWeight: 700 }}>
          Hero · {String(HERO_PILL_KEYS.indexOf(pill) + 1).padStart(2, "0")} · Storyboard
        </div>
        <div style={{ display: "inline-block", marginTop: 16, padding: "9px 14px", borderRadius: 7, background: "rgba(255,255,255,0.1)", fontSize: 15, fontWeight: MEDIUM, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(3, ${W}px)`, columnGap: GAP }}>
        {frames().map((f, i) => (
          <div key={f.title}>
            <div style={{ width: W, height: H, borderRadius: 10, overflow: "hidden", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)" }}>{f.node}</div>
            <div style={{ height: CAPTION, paddingTop: 14 }}>
              <div style={{ fontSize: 16, fontWeight: MEDIUM }}>
                <span style={{ opacity: 0.5, marginRight: 10 }}>{i + 1}</span>
                {f.title}
              </div>
              <div style={{ fontSize: 13.5, lineHeight: 1.45, marginTop: 6, opacity: 0.68, maxWidth: W }}>{f.caption}</div>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
