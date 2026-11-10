import React, { useState } from "react";
import { AbsoluteFill } from "remotion";
import "../shared/fonts";
import { loadDiatype } from "../launch/fonts";
import { DataHunt, HUNT_FRAMES } from "./cards/DataHunt";
import { EveryReport, REPORT_FRAMES } from "./cards/EveryReport";
import { JustSay, SAY_FRAMES } from "./cards/JustSay";
import { KNOW_FRAMES, KnowMore } from "./cards/KnowMore";
import { Monitor, MONITOR_FRAMES } from "./cards/Monitor";
import { More, MORE_FRAMES, MOREWIDE_FRAMES } from "./cards/More";
import { Briefing, BRIEFING_FRAMES } from "./cards/Briefing";
import { DayOne, DAYONE_FRAMES } from "./cards/DayOne";
import { RECORD_FRAMES, SameRecord } from "./cards/SameRecord";
import { SERVICE_FRAMES, ServiceTeam } from "./cards/ServiceTeam";
import { DAY_FRAMES, StartDay } from "./cards/StartDay";
import { C, CardKey, CARDS, FONT, MEDIUM } from "./theme";

// Storyboards for the seven "More ways" card graphics: each card's key frames
// on the website's card glass, numbered, with what happens. One still per card.

type Frame = { readonly node: React.ReactNode; readonly title: string; readonly caption: string };
const BOARDS: Partial<Record<CardKey, () => readonly Frame[]>> = {
  say: () => SAY_FRAMES.map((f) => ({ node: <JustSay s={f.s} />, title: f.title, caption: f.caption })),
  know: () => KNOW_FRAMES.map((f) => ({ node: <KnowMore s={f.s} />, title: f.title, caption: f.caption })),
  report: () => REPORT_FRAMES.map((f) => ({ node: <EveryReport s={f.s} />, title: f.title, caption: f.caption })),
  day: () => DAY_FRAMES.map((f) => ({ node: <StartDay s={f.s} />, title: f.title, caption: f.caption })),
  monitor: () => MONITOR_FRAMES.map((f) => ({ node: <Monitor s={f.s} />, title: f.title, caption: f.caption })),
  hunt: () => HUNT_FRAMES.map((f) => ({ node: <DataHunt s={f.s} />, title: f.title, caption: f.caption })),
  more: () => MORE_FRAMES.map((f) => ({ node: <More s={f.s} />, title: f.title, caption: f.caption })),
  record: () => RECORD_FRAMES.map((f) => ({ node: <SameRecord s={f.s} />, title: f.title, caption: f.caption })),
  dayone: () => DAYONE_FRAMES.map((f) => ({ node: <DayOne s={f.s} />, title: f.title, caption: f.caption })),
  service: () => SERVICE_FRAMES.map((f) => ({ node: <ServiceTeam s={f.s} />, title: f.title, caption: f.caption })),
  briefing: () => BRIEFING_FRAMES.map((f) => ({ node: <Briefing s={f.s} />, title: f.title, caption: f.caption })),
  morewide: () => MOREWIDE_FRAMES.map((f) => ({ node: <More s={f.s} wide />, title: f.title, caption: f.caption })),
};
export const BOARD_KEYS = Object.keys(BOARDS) as CardKey[];
const ORDER: readonly CardKey[] = ["say", "know", "report", "day", "monitor", "hunt", "more"];
const ORDER_V2: readonly CardKey[] = ["record", "dayone", "service", "briefing", "know", "morewide"];
const number = (card: CardKey) => (ORDER_V2.includes(card) && card !== "know" ? `v2 · ${String(ORDER_V2.indexOf(card) + 1).padStart(2, "0")}` : String(ORDER.indexOf(card) + 1).padStart(2, "0"));

const PAD = 72;
const GAP = 40;
const HEAD = 230;
const CAPTION = 92;
const colsFor = (w: number, n: number) => Math.min(n, w >= 600 ? 3 : w >= 500 ? 3 : 4);
export const boardSize = (key: CardKey) => {
  const { w, h } = CARDS[key];
  const n = BOARDS[key]?.().length ?? 1;
  const cols = colsFor(w, n);
  const rows = Math.ceil(n / cols);
  return { w: PAD * 2 + cols * w + (cols - 1) * GAP, h: PAD + HEAD + rows * (h + CAPTION) + (rows - 1) * GAP + PAD - 20 };
};

export const MoreWaysStoryboard: React.FC<{ readonly card: CardKey }> = ({ card }) => {
  useState(loadDiatype);
  const { title, body, w, h } = CARDS[card];
  const frames = BOARDS[card]?.() ?? [];
  const cols = colsFor(w, frames.length);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.page} 0%, #0b2c3b 100%)`, fontFamily: FONT, color: "#ffffff", padding: PAD }}>
      <div style={{ height: HEAD }}>
        <div style={{ fontSize: 15, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.55, fontWeight: 700 }}>
          More ways · {number(card)} · Storyboard
        </div>
        <div style={{ fontSize: 40, marginTop: 14, letterSpacing: "-0.01em" }}>{title}</div>
        <div style={{ fontSize: 17, lineHeight: 1.5, marginTop: 12, maxWidth: 980, opacity: 0.72 }}>{body}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${w}px)`, columnGap: GAP, rowGap: GAP }}>
        {frames.map((f, i) => (
          <div key={f.title}>
            <div
              style={{
                width: w,
                height: h,
                borderRadius: 10,
                overflow: "hidden",
                background: `linear-gradient(180deg, ${C.cardTop} 0%, ${C.card} 70%)`,
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
              }}
            >
              {f.node}
            </div>
            <div style={{ height: CAPTION, paddingTop: 14 }}>
              <div style={{ fontSize: 16, fontWeight: MEDIUM }}>
                <span style={{ opacity: 0.5, marginRight: 10 }}>{i + 1}</span>
                {f.title}
              </div>
              <div style={{ fontSize: 13.5, lineHeight: 1.45, marginTop: 6, opacity: 0.68, maxWidth: w }}>{f.caption}</div>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
