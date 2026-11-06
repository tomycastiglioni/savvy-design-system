import React from "react";
import { Icon, IconName, Pill, Pointer, Skeleton } from "../Bits";
import { C, FONT, MEDIUM } from "../theme";

// 04 · Start the day knowing what needs you (534×282). Today's briefing
// (Figma), which runs off the bottom: it's prepared before the day starts,
// each item lands with its count, the flags pop on, and the drafts are ready
// to open.
export type DayState = {
  readonly items?: number; // 0–3 items in
  readonly badges?: number; // 0–2 badges in
  readonly preparing?: boolean; // "Preparing your briefing…" under the title
  readonly hover?: boolean; // cursor on the drafts
};

const W = 534;
const H = 282;
const CARD = { x: (W - 466) / 2, y: 26.27, w: 466, h: 284 };
const ITEMS: readonly { icon: IconName; title: string; summary: string; badge?: { tone: "amber" | "green"; label: string } }[] = [
  { icon: "chart", title: "Recent account changes", summary: "3 accounts with notable activity (contributions, transfers, or large trades)" },
  { icon: "square-check", title: "Open items", summary: "2 items need your attention", badge: { tone: "amber", label: "Due soon" } },
  { icon: "file-text", title: "Drafts ready for review", summary: "2 drafts (RMD distribution, client email)", badge: { tone: "green", label: "Ready" } },
];

export const StartDay: React.FC<{ readonly s: DayState }> = ({ s }) => {
  const { items = 3, badges = 2, preparing = false, hover = false } = s;
  return (
    <div style={{ position: "relative", width: W, height: H, overflow: "hidden", fontFamily: FONT }}>
      <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, background: "#ffffff", border: `0.646px solid ${C.border}`, borderRadius: 8.822, overflow: "hidden" }}>
        <Icon name="layers" w={16.493} style={{ position: "absolute", left: 23.35, top: 21.61 }} />
        <div style={{ position: "absolute", left: 50.85, top: 19.35, fontWeight: MEDIUM, fontSize: 15, lineHeight: "21px", color: "#1d2939" }}>Today’s briefing</div>
        <div style={{ position: "absolute", right: CARD.w - 440.35, top: 23.35, fontWeight: MEDIUM, fontSize: 10, color: C.date }}>{preparing ? "Preparing…" : "Wed, Nov 4"}</div>
        {ITEMS.map((it, i) => {
          const on = i < items;
          const badgeOn = it.badge ? (i === 1 ? badges >= 1 : badges >= 2) : false;
          const lit = hover && i === 2;
          return (
            <div
              key={it.title}
              style={{
                position: "absolute",
                left: 23.35,
                top: 58.35 + i * 64,
                width: 417,
                height: 56,
                boxSizing: "border-box",
                padding: "0 10px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                borderRadius: 10,
                background: lit ? "#ffffff" : C.tile,
                boxShadow: lit ? "0 0 0 1px #d9e6dc, 0 8px 18px -10px rgba(16,24,40,0.25)" : undefined,
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 20, background: on ? C.greenIcon : "#eceef1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {on ? <Icon name={it.icon} w={21} /> : null}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {on ? (
                  <>
                    <div style={{ fontWeight: MEDIUM, fontSize: 13, color: C.text }}>{it.title}</div>
                    <div style={{ fontSize: 11, color: C.sub, marginTop: 2, letterSpacing: i === 0 ? -0.15 : 0, whiteSpace: "nowrap", overflow: "hidden" }}>{it.summary}</div>
                  </>
                ) : (
                  <>
                    <Skeleton w={130} h={10} />
                    <Skeleton w={220} h={7} style={{ marginTop: 7 }} />
                  </>
                )}
              </div>
              {it.badge && badgeOn ? <Pill tone={it.badge.tone}>{lit ? "Open →" : it.badge.label}</Pill> : null}
            </div>
          );
        })}
      </div>
      {hover ? <Pointer x={CARD.x + 418} y={CARD.y + 58.35 + 128 + 34} /> : null}
    </div>
  );
};

export const DAY_FRAMES: readonly { s: DayState; title: string; caption: string }[] = [
  { s: { items: 0, badges: 0, preparing: true }, title: "Before you start", caption: "Today’s briefing, still being prepared: three rows waiting." },
  { s: { items: 1, badges: 0 }, title: "Account changes", caption: "The date lands and the first item fills in: 3 accounts with notable activity (its bars grow)." },
  { s: { items: 3, badges: 0 }, title: "Open items, drafts", caption: "Open items and drafts follow, a beat apart." },
  { s: { items: 3, badges: 2 }, title: "Flagged", caption: "“Due soon” and “Ready” pop on, so what needs you stands out (the design’s state)." },
  { s: { items: 3, badges: 2, hover: true }, title: "Ready for you", caption: "The cursor rests on the drafts; the row lifts and “Ready” becomes “Open →”. Then the day resets." },
];
