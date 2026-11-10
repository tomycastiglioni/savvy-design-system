import React, { useState } from "react";
import { AbsoluteFill } from "remotion";
import "../shared/fonts";
import { loadDiatype } from "../launch/fonts";
import { DataHuntLoop, HUNT_SECONDS } from "./cards/DataHunt";
import { EveryReportLoop, REPORT_SECONDS } from "./cards/EveryReport";
import { JustSayLoop, SAY_SECONDS } from "./cards/JustSay";
import { KNOW_SECONDS, KnowMoreLoop } from "./cards/KnowMore";
import { MONITOR_SECONDS, MonitorLoop } from "./cards/Monitor";
import { MORE_SECONDS, MoreLoop } from "./cards/More";
import { DAY_SECONDS, StartDayLoop } from "./cards/StartDay";
import { C, CardKey } from "./theme";

// The seven card graphics as seamless loops, at their Figma size (render at
// --scale=2 for the site). Transparent, to sit on the site's card glass;
// `preview` puts them on that glass for review.
// The loops made so far (the second section's cards get theirs once their
// frames are approved).
export type LoopKey = Extract<CardKey, "say" | "know" | "report" | "day" | "monitor" | "hunt" | "more">;
export const LOOPS: Record<LoopKey, { seconds: number; Loop: React.FC }> = {
  say: { seconds: SAY_SECONDS, Loop: JustSayLoop },
  know: { seconds: KNOW_SECONDS, Loop: KnowMoreLoop },
  report: { seconds: REPORT_SECONDS, Loop: EveryReportLoop },
  day: { seconds: DAY_SECONDS, Loop: StartDayLoop },
  monitor: { seconds: MONITOR_SECONDS, Loop: MonitorLoop },
  hunt: { seconds: HUNT_SECONDS, Loop: DataHuntLoop },
  more: { seconds: MORE_SECONDS, Loop: MoreLoop },
};

export const MoreWaysLoop: React.FC<{ readonly card: LoopKey; readonly preview?: boolean }> = ({ card, preview = false }) => {
  useState(loadDiatype);
  const { Loop } = LOOPS[card];
  return (
    <AbsoluteFill style={{ background: preview ? `linear-gradient(180deg, ${C.cardTop} 0%, ${C.card} 70%)` : undefined }}>
      <Loop />
    </AbsoluteFill>
  );
};
