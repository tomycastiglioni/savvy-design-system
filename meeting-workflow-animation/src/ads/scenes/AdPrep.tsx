import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { MeetingAgenda } from "../../meeting-prep/scenes/MeetingAgenda";
import { AIIcon, AIIconAvatar } from "../../shared/components/AIIcon";
import { Avatar } from "../../shared/components/Avatar";
import { CursorLayer } from "../../shared/components/CursorLayer";
import { Reveal } from "../../shared/components/Reveal";
import { DocTabs } from "../../meeting-prep/scenes/DocTabs";
import { STATS } from "../../meeting-prep/scenes/Home";
import { HouseholdContext } from "../../meeting-prep/scenes/HouseholdContext";
import { OutstandingTasks } from "../../meeting-prep/scenes/OutstandingTasks";
import { PrepDocument } from "../../meeting-prep/scenes/PrepDocument";
import { C, CLAMP, DOC_PANEL, EASE_IN_OUT, EASE_OUT, FONT, TABS, TABS_BAR } from "../../meeting-prep/theme";
import { T } from "../../meeting-prep/timeline";
import { anchor, Camera, toAd, toSource } from "../Camera";
import { AD, graphicTop, INNER_W, MARGIN_X, TEXT_BOTTOM } from "../layout";

// Ad 01 · Prep. The home screen is laid out for the ad (greeting, the four
// stats as a 2×2 grid, the review card under them) at 1.05×; "Review prep
// document" then grows into the prep document, shown at 1.25× through a fixed
// camera with its left edge on the text margin, running off the right and
// bottom. Times are the workflow video's (mounted at source frame 0).

const TOP = graphicTop("prep");
const K = 1.05; // home: design px → ad px
const W = INNER_W / K;
const H = {
  avatar: 60,
  statsY: 82,
  cellH: 120,
  titleY: 344,
  cardY: 378,
  cardH: 230, // runs off the bottom of the frame
  button: { x: 105, y: 104, w: 231, h: 39 },
};
// The button, in ad px.
const BUTTON = {
  x: MARGIN_X + H.button.x * K,
  y: TOP + (H.cardY + H.button.y) * K,
  w: H.button.w * K,
  h: H.button.h * K,
};

// The document: tab bar top-left on the text margin, 1.25×.
const DOC = anchor(DOC_PANEL.x, TABS_BAR.y, MARGIN_X, TOP, 1.25);
// "Loading household…" card, centred across the frame and between the copy and
// the bottom.
const LOADING = { x: (AD.w - 620) / 2, w: 620, h: 440, y: (TEXT_BOTTOM.prep + AD.h) / 2 - 220 };

const AdHome: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const click = T.clickReview;
  const exit = interpolate(frame, [T.prepDocStart * fps, (T.prepDocStart + 0.4) * fps], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const count = interpolate(frame, [0.35 * fps, 1.6 * fps], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const card = interpolate(frame, [0.95 * fps, 1.55 * fps], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const glow = interpolate(frame, [1.5 * fps, 1.8 * fps, 2.5 * fps], [0, 1, 0], CLAMP);
  const hover = interpolate(frame, [(click - 0.32) * fps, (click - 0.2) * fps], [0, 1], CLAMP);
  const press = interpolate(frame, [(click - 0.03) * fps, (click + 0.05) * fps, (click + 0.15) * fps], [0, 1, 0], CLAMP);

  return (
    <div
      style={{
        position: "absolute",
        left: MARGIN_X,
        top: TOP,
        width: W,
        height: (AD.h - TOP) / K,
        scale: K * (1 - 0.015 * exit),
        transformOrigin: "0 0",
        opacity: 1 - exit,
        filter: `blur(${exit * 4}px)`,
        fontFamily: FONT.sans,
        color: C.ink,
      }}
    >
      <Reveal at={0} dur={0.6} y={12} style={{ position: "absolute", left: 0, top: 0, height: H.avatar, display: "flex", alignItems: "center", gap: 24 }}>
        <Avatar size={H.avatar} person="heather" />
        <div style={{ fontFamily: FONT.serif, fontSize: 40, lineHeight: 1, letterSpacing: "-0.005em" }}>Good afternoon, Heather</div>
      </Reveal>

      <Reveal
        at={0.15}
        dur={0.6}
        y={12}
        style={{
          position: "absolute",
          left: 0,
          top: H.statsY,
          width: W,
          height: 2 * H.cellH,
          background: C.white,
          border: `1px solid ${C.statsBorder}`,
          borderRadius: 12,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          overflow: "hidden",
        }}
      >
        {STATS.map((s, i) => (
          <Reveal
            key={s.label}
            at={0.3 + i * 0.08}
            y={10}
            style={{
              padding: "16px 26px",
              borderLeft: i % 2 ? `1px solid ${C.statsBorder}` : "none",
              borderTop: i >= 2 ? `1px solid ${C.statsBorder}` : "none",
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: "0.05em", color: C.body, textTransform: "uppercase", whiteSpace: "nowrap" }}>{s.label}</div>
            <div style={{ fontSize: 36, fontWeight: 500, marginTop: 10, letterSpacing: "-0.01em", fontVariantNumeric: "tabular-nums" }}>{s.value(count)}</div>
            <div style={{ fontSize: 15.5, color: C.muted, marginTop: 6, whiteSpace: "nowrap" }}>{s.sub}</div>
          </Reveal>
        ))}
      </Reveal>

      <Reveal at={0.65} dur={0.6} y={14} style={{ position: "absolute", left: 0, top: H.titleY, fontSize: 20, fontWeight: 500 }}>
        For your review <span style={{ color: C.muted, fontWeight: 400 }}>(1)</span>
      </Reveal>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: H.cardY,
          width: W,
          height: H.cardH,
          background: C.white,
          border: `1px solid ${C.borderSoft}`,
          borderRadius: 12,
          opacity: card,
          translate: `0px ${(1 - card) * 28}px`,
          scale: 0.98 + 0.02 * card,
          boxShadow: `0 0 0 ${glow * 6}px rgba(103, 189, 141, ${0.3 * glow}), 0 ${2 + 10 * card}px ${24 * card}px -8px rgba(16, 24, 40, ${0.08 * card})`,
        }}
      >
        <div style={{ position: "absolute", left: 26, top: 27 }}>
          <AIIconAvatar size={55} />
        </div>
        <div style={{ position: "absolute", left: 105, top: 26, fontSize: 18, fontWeight: 500, whiteSpace: "nowrap" }}>Meeting prep document created for Allison &amp; Frank Chan household</div>
        <div style={{ position: "absolute", left: 105, top: 57, fontSize: 17, color: C.muted, whiteSpace: "nowrap" }}>Quarterly Review · Friday, Jul 31, 9:00 AM ET · Allison &amp; Frank Chan</div>
        <div
          style={{
            position: "absolute",
            left: H.button.x - 1,
            top: H.button.y - 1,
            width: H.button.w,
            height: H.button.h,
            borderRadius: 9,
            border: `1px solid ${interpolateColors(hover, [0, 1], [C.faint, C.muted])}`,
            background: interpolateColors(hover, [0, 1], [C.white, C.panel]),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 9,
            fontSize: 15.5,
            fontWeight: 500,
            scale: 1 - 0.03 * press,
            opacity: frame >= T.prepDocStart * fps ? 0 : 1,
          }}
        >
          <AIIcon size={20} />
          Review prep document
        </div>
      </div>
    </div>
  );
};

// Cursor, in ad px.
const REVIEW = { x: BUTTON.x + BUTTON.w / 2, y: BUTTON.y + BUTTON.h / 2 + 2 };
const tab = (i: number) => toAd(DOC, { x: TABS_BAR.x + TABS[i].x + TABS[i].w / 2, y: TABS_BAR.y + TABS_BAR.h / 2 + 2 });
const AGENDA_TAB = tab(1);
const TASKS_TAB = tab(2);
const TASK_ROW = toAd(DOC, { x: 330, y: 330 });
const BETWEEN = toAd(DOC, { x: 560, y: 380 });

const AdPrepCursor: React.FC = () => (
  <CursorLayer
    scale={1.5 * 1.15}
    path={[
      { t: 1.6, x: 900, y: AD.h + 40 },
      { t: 2.6, ...REVIEW },
      { t: 3.2, ...REVIEW, ease: "linear" },
      { t: 6.95, x: AGENDA_TAB.x + 160, y: AGENDA_TAB.y + 260, ease: "linear" },
      { t: 7.75, ...AGENDA_TAB },
      { t: 7.95, ...AGENDA_TAB, ease: "linear" },
      { t: 8.9, ...BETWEEN },
      { t: 9.6, ...BETWEEN, ease: "linear" },
      { t: 10.1, ...TASKS_TAB },
      { t: 10.75, ...TASKS_TAB, ease: "linear" },
      { t: 11.4, ...TASK_ROW },
    ]}
    opacity={[
      [1.6, 0],
      [1.75, 1],
      [3.0, 1],
      [3.2, 0],
      [6.95, 0],
      [7.1, 1],
    ]}
    clicks={[
      { at: T.clickReview, ...REVIEW },
      { at: T.clickAgenda, ...AGENDA_TAB },
      { at: T.clickTasks, ...TASKS_TAB },
    ]}
    hand={[
      [2.42, 3.2],
      [7.55, 8.1],
      [9.92, 10.8],
      [11.25, Infinity],
    ]}
  />
);

export const AdPrep: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.ink }}>
      <Sequence name="Home" durationInFrames={Math.round(T.homeEnd * fps)}>
        <AdHome />
      </Sequence>
      <Camera view={DOC}>
        <Sequence name="Prep document" from={Math.round(T.prepDocStart * fps)}>
          <PrepDocument from={toSource(DOC, BUTTON)} mid={toSource(DOC, LOADING)} />
        </Sequence>
        <Sequence name="Tabs" from={Math.round(T.tabsStart * fps)}>
          <DocTabs />
        </Sequence>
        <div style={{ position: "absolute", left: DOC_PANEL.x, top: DOC_PANEL.y, width: DOC_PANEL.w, height: DOC_PANEL.h, overflow: "hidden", borderRadius: 16 }}>
          <Sequence name="Household context" from={Math.round(T.contextStart * fps)} durationInFrames={Math.round((T.tabToAgenda + 0.3 - T.contextStart) * fps)}>
            <HouseholdContext />
          </Sequence>
          <Sequence name="Meeting agenda" from={Math.round(T.agendaStart * fps)} durationInFrames={Math.round((T.tabToTasks + 0.25 - T.agendaStart) * fps)}>
            <MeetingAgenda />
          </Sequence>
          <Sequence name="Outstanding tasks" from={Math.round(T.tasksStart * fps)}>
            <OutstandingTasks />
          </Sequence>
        </div>
      </Camera>
      <AdPrepCursor />
    </AbsoluteFill>
  );
};
