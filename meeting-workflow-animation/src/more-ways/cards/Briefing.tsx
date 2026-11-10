import React from "react";
import { along, LINEAR, POP, ramp, useT, window } from "../anim";
import { Icon, IconName, Pill, Pointer, Skeleton } from "../Bits";
import { C, FONT, MEDIUM } from "../theme";
import { DayState } from "./StartDay";

// v2 · 04 · Start the day knowing what needs you (534×324), on the dark card.
// The website card's briefing (cards/StartDay.tsx), now as it waits on the
// dashboard: from Savvy Intelligence, across the whole book. Whole and
// centred in the frame: it's prepared before the day starts, each item lands,
// the flags pop on, and the drafts are ready to open.
const W = 534;
const H = 324; // runs from under the card's copy to its foot; the briefing sits centred
const CARD = { x: (W - 466) / 2, y: (H - 266) / 2, w: 466, h: 266 };
const ROWS_TOP = 66;
const ITEMS: readonly { icon: IconName; title: string; summary: string; badge?: { tone: "amber" | "green"; label: string } }[] = [
  { icon: "chart", title: "Account changes", summary: "3 accounts with notable activity across your book" },
  { icon: "square-check", title: "Open items", summary: "2 items need your attention", badge: { tone: "amber", label: "Due soon" } },
  { icon: "file-text", title: "Drafts ready for your review", summary: "2 drafts (RMD distribution, client email)", badge: { tone: "green", label: "Ready" } },
];
const num = (v: boolean | number | undefined, d: number) => (typeof v === "number" ? v : v === undefined ? d : v ? 1 : 0);
const c01 = (n: number) => Math.min(1, Math.max(0, n));
export const BRIEF_DRAFTS = { x: CARD.x + 412, y: CARD.y + ROWS_TOP + 128 + 34 }; // the drafts' badge, frame px

export const Briefing: React.FC<{ readonly s: DayState }> = ({ s }) => {
  const { items = 3, badges = 2, pointer } = s;
  const preparing = num(s.preparing, 0);
  const hover = num(s.hover, 0);
  return (
    <div style={{ position: "relative", width: W, height: H, overflow: "hidden", fontFamily: FONT }}>
      <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, background: "#ffffff", border: `0.646px solid ${C.border}`, borderRadius: 8.822, overflow: "hidden" }}>
        {/* the dashboard's daily briefing, from Savvy Intelligence */}
        <div style={{ position: "absolute", left: 22, top: 16, width: 30, height: 30, borderRadius: 15, background: "#f3f7f1", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="savvy-mark" w={17} />
        </div>
        <div style={{ position: "absolute", left: 62, top: 14, fontWeight: MEDIUM, fontSize: 15, lineHeight: "20px", color: "#1d2939" }}>Your daily briefing</div>
        <div style={{ position: "absolute", left: 62, top: 34, fontSize: 10, color: C.muted, whiteSpace: "nowrap" }}>From Savvy Intelligence · Across your book, 142 households</div>
        {[0, 1].map((k) => (
          <div key={k} style={{ position: "absolute", right: 22, top: 18, fontWeight: MEDIUM, fontSize: 10, color: C.date, opacity: k ? preparing : 1 - preparing, whiteSpace: "nowrap" }}>
            {k ? "Preparing…" : "Wed, Nov 4"}
          </div>
        ))}
        {ITEMS.map((it, i) => {
          const on = c01(items - i);
          const badge = it.badge ? c01(badges - (i - 1)) : 0;
          const lit = i === 2 ? hover : 0;
          return (
            <div
              key={it.title}
              style={{
                position: "absolute",
                left: 23.35,
                top: ROWS_TOP + i * 64 - 2 * lit,
                width: 417,
                height: 56,
                boxSizing: "border-box",
                padding: "0 10px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                borderRadius: 10,
                background: lit > 0 ? `rgba(255,255,255,${lit})` : C.tile,
                boxShadow: lit > 0 ? `0 0 0 1px rgba(217,230,220,${lit}), 0 8px 18px -10px rgba(16,24,40,${0.25 * lit})` : undefined,
              }}
            >
              <div style={{ position: "relative", width: 40, height: 40, borderRadius: 20, background: on > 0 ? C.greenIcon : "#eceef1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {on > 0 ? <Icon name={it.icon} w={21} style={{ opacity: on, scale: 0.6 + 0.4 * on }} /> : null}
              </div>
              <div style={{ position: "relative", flex: 1, minWidth: 0, height: 34 }}>
                <div style={{ position: "absolute", inset: 0, opacity: on, translate: `0px ${(1 - on) * 5}px` }}>
                  <div style={{ fontWeight: MEDIUM, fontSize: 13, color: C.text }}>{it.title}</div>
                  <div style={{ fontSize: 11, color: C.sub, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden" }}>{it.summary}</div>
                </div>
                {on < 1 ? (
                  <div style={{ position: "absolute", left: 0, top: 6, opacity: 1 - on }}>
                    <Skeleton w={130} h={10} />
                    <Skeleton w={220} h={7} style={{ marginTop: 7 }} />
                  </div>
                ) : null}
              </div>
              {it.badge && badge > 0 ? (
                <Pill tone={it.badge.tone} style={{ opacity: Math.min(1, badge * 1.5), scale: 0.6 + 0.4 * badge }}>
                  {lit > 0.5 ? "Open →" : it.badge.label}
                </Pill>
              ) : null}
            </div>
          );
        })}
      </div>
      {pointer && pointer.o > 0 ? (
        <div style={{ opacity: pointer.o }}>
          <Pointer x={pointer.x} y={pointer.y} />
        </div>
      ) : s.pointer === undefined && hover > 0 ? (
        <Pointer x={BRIEF_DRAFTS.x + 6} y={BRIEF_DRAFTS.y} />
      ) : null}
    </div>
  );
};

export const BRIEFING_FRAMES: readonly { s: DayState; title: string; caption: string }[] = [
  { s: { items: 0, badges: 0, preparing: true }, title: "Waiting on your dashboard", caption: "Your daily briefing from Savvy Intelligence, being prepared across the whole book (142 households)." },
  { s: { items: 3, badges: 0 }, title: "What changed, what's open", caption: "Account changes, open items and drafts land one after another." },
  { s: { items: 3, badges: 2 }, title: "Flagged", caption: "“Due soon” and “Ready” pop on, so what needs you stands out." },
  { s: { items: 3, badges: 2, hover: true }, title: "Ready for your review", caption: "The cursor rests on the drafts; the row lifts and “Ready” becomes “Open →”. Then the day resets." },
];

// The loop (10 s), timed as the first section's: prepared, the items land,
// the flags pop, the drafts are opened under the cursor; then back to
// "Preparing…".
export const BRIEFING_SECONDS = 10;
export const BriefingLoop: React.FC = () => {
  const t = useT();
  const reset = 1 - ramp(t, 8.6, 9.0);
  const items = [0, 1, 2].reduce((n, i) => n + ramp(t, 1.2 + 0.45 * i, 1.6 + 0.45 * i), 0) * reset;
  const badges = (ramp(t, 2.7, 3.05, POP) + ramp(t, 3.0, 3.35, POP)) * (1 - ramp(t, 8.35, 8.65));
  const target = { x: BRIEF_DRAFTS.x, y: BRIEF_DRAFTS.y };
  const p = along(t, [
    [4.4, 500, H + 16],
    [5.0, target.x, target.y],
    [7.0, target.x, target.y],
    [7.6, 520, H + 16],
  ]);
  return (
    <Briefing
      s={{
        items,
        badges,
        preparing: 1 - ramp(t, 0.9, 1.15, LINEAR) + ramp(t, 9.0, 9.25, LINEAR),
        hover: window(t, 5.0, 7.0, 0.3, 0.3),
        pointer: { ...p, o: window(t, 4.4, 7.2, 0.25, 0.4) },
      }}
    />
  );
};
