import React, { useState } from "react";
import { AbsoluteFill } from "remotion";
import "../shared/fonts";
import { loadDiatype } from "../launch/fonts";
import { CONTACTS_FRAMES, HouseholdContacts } from "./cards/HouseholdContacts";
import { MeetingPrep, PREP_FRAMES } from "./cards/MeetingPrep";
import { MeetingSummaries, SUMMARIES_FRAMES } from "./cards/MeetingSummaries";
import { PROSPECT_FRAMES, ProspectAnalysis } from "./cards/ProspectAnalysis";
import { REPORT_FRAMES, ReportBuilder } from "./cards/ReportBuilder";
import { SCENARIO_FRAMES, Scenarios } from "./cards/Scenarios";
import { HeroLoopKey } from "./Loops";

// Each hero graphic in its finished state (its storyboard's last frame), with
// no cursor and nothing held: transparent stills for design files.
const last = <T,>(frames: readonly { s: T }[]) => ({ ...frames[frames.length - 1].s, pointer: undefined, hot: -1 });
const STILLS: Record<HeroLoopKey, () => React.ReactNode> = {
  scenarios: () => <Scenarios s={last(SCENARIO_FRAMES)} />,
  prep: () => <MeetingPrep s={last(PREP_FRAMES)} />,
  summaries: () => <MeetingSummaries s={{ ...last(SUMMARIES_FRAMES), saved: 0 }} />,
  contacts: () => <HouseholdContacts s={last(CONTACTS_FRAMES)} />,
  report: () => <ReportBuilder s={last(REPORT_FRAMES)} />,
  prospect: () => <ProspectAnalysis s={last(PROSPECT_FRAMES)} />,
};

export const HeroStill: React.FC<{ readonly pill: HeroLoopKey }> = ({ pill }) => {
  useState(loadDiatype);
  return <AbsoluteFill>{STILLS[pill]()}</AbsoluteFill>;
};
