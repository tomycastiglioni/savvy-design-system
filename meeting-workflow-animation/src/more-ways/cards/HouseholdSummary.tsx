import { Phone } from "lucide-react";
import React from "react";
import { ramp, useT } from "../anim";
import { Icon, Skeleton } from "../Bits";
import { C, FONT, MEDIUM } from "../theme";

// Every household, summarized before the call (700×430; Ad 13), on the dark
// card. Allison & Frank Chan's household summary, ahead of a call: who's in
// the household, what was discussed last, open tasks and recent account
// changes fill in one after another; then "Updated by Savvy Intelligence
// after your last meeting". The same household and meeting as the launch
// video.
export type SummaryState = {
  readonly filled?: number; // 0–4 sections in (fractional: the one coming in)
  readonly footer?: number; // 0–1: "Updated by Savvy Intelligence…"
  readonly ready?: number; // 0–1: the call chip's dot, live
};

const W = 700;
const H = 430;
export const SUMMARY_CARD = { x: 24, y: 20, w: 652, h: 390 };
const CELL = { top: 78, w: 300, h: 128, gap: 12 };
const c01 = (n: number) => Math.min(1, Math.max(0, n));

const Label: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontSize: 9.5, fontWeight: MEDIUM, letterSpacing: "0.04em", textTransform: "uppercase", color: C.muted }}>{children}</div>
);
const Line: React.FC<{ readonly main: string; readonly sub?: string; readonly lead?: React.ReactNode }> = ({ main, sub, lead }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 24 }}>
    {lead}
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 11.5, color: C.ink, whiteSpace: "nowrap" }}>{main}</div>
      {sub ? <div style={{ fontSize: 9.5, color: C.muted, marginTop: 1, whiteSpace: "nowrap" }}>{sub}</div> : null}
    </div>
  </div>
);
const Person: React.FC<{ readonly initials: string }> = ({ initials }) => (
  <div style={{ width: 22, height: 22, borderRadius: 11, background: C.greenSoft, color: C.green, fontSize: 8.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{initials}</div>
);
const Dot: React.FC = () => <div style={{ width: 5, height: 5, borderRadius: 3, background: C.green2, flexShrink: 0, marginLeft: 3, marginRight: 2 }} />;
const Box: React.FC = () => <div style={{ width: 11, height: 11, borderRadius: 3, border: `1.3px solid #c4cad2`, flexShrink: 0, marginLeft: 1 }} />;

const SECTIONS: readonly { label: string; body: React.ReactNode }[] = [
  {
    label: "In the household",
    body: (
      <>
        <Line lead={<Person initials="AC" />} main="Allison Chan" sub="62 · primary" />
        <Line lead={<Person initials="FC" />} main="Frank Chan" sub="64" />
        <Line lead={<Person initials="EC" />} main="Ellie Chan" sub="17 · dependent" />
      </>
    ),
  },
  {
    label: "Last discussed · Quarterly Review, Oct 14",
    body: (
      <>
        <Line lead={<Dot />} main="Rebalance to 70/30" />
        <Line lead={<Dot />} main="Open a 529 for Ellie" />
        <Line lead={<Dot />} main="Retiring at 63: on track" />
      </>
    ),
  },
  {
    label: "Open tasks",
    body: (
      <>
        <Line lead={<Box />} main="Open Ellie’s 529" sub="Priya Kapoor · due Fri" />
        <Line lead={<Box />} main="Raise 401(k) to 12.5%" sub="Waiting on Frank’s signature" />
      </>
    ),
  },
  {
    label: "Recent account changes",
    body: (
      <>
        <Line main="+$25,000 contribution" sub="Joint brokerage · Oct 20" />
        <Line main="Rebalanced to 70/30" sub="All accounts · Oct 16" />
      </>
    ),
  },
];

export const HouseholdSummary: React.FC<{ readonly s: SummaryState; readonly h?: number }> = ({ s }) => {
  const { filled = 4, footer = 1, ready = 1 } = s;
  const K = SUMMARY_CARD;
  return (
    <div style={{ position: "relative", width: W, height: H, overflow: "hidden", fontFamily: FONT }}>
      <div style={{ position: "absolute", left: K.x, top: K.y, width: K.w, height: K.h, background: "#ffffff", borderRadius: 10, border: `0.7px solid ${C.border}`, overflow: "hidden" }}>
        {/* the household, ahead of the call */}
        <div style={{ position: "absolute", left: 20, top: 15, width: 36, height: 36, borderRadius: 18, background: C.greenSoft, color: C.green, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>AC</div>
        <div style={{ position: "absolute", left: 66, top: 15, fontWeight: MEDIUM, fontSize: 15, color: C.ink }}>Allison &amp; Frank Chan</div>
        <div style={{ position: "absolute", left: 66, top: 36, fontSize: 10.5, color: C.muted }}>Household summary</div>
        <div style={{ position: "absolute", right: 20, top: 20, display: "flex", alignItems: "center", gap: 7, padding: "6px 11px", borderRadius: 20, background: C.greenBg, color: C.greenInk, fontWeight: MEDIUM, fontSize: 10.5 }}>
          <span style={{ position: "relative", width: 7, height: 7 }}>
            <span style={{ position: "absolute", inset: 0, borderRadius: 4, background: C.green2, opacity: 0.35 + 0.65 * ready }} />
            {ready > 0 ? <span style={{ position: "absolute", inset: -4 * ready, borderRadius: 8, border: `1.2px solid rgba(8,107,78,${0.5 * (1 - ready)})` }} /> : null}
          </span>
          <Phone size={11} color={C.greenInk} strokeWidth={2} /> Call · 2:00 PM
        </div>
        <div style={{ position: "absolute", left: 20, right: 20, top: 64, height: 1, background: C.border }} />

        {/* the four sections, filling in */}
        {SECTIONS.map((sec, i) => {
          const on = c01(filled - i);
          const col = i % 2;
          const row = Math.floor(i / 2);
          return (
            <div
              key={sec.label}
              style={{
                position: "absolute",
                left: 20 + col * (CELL.w + CELL.gap),
                top: CELL.top + row * (CELL.h + CELL.gap),
                width: CELL.w,
                height: CELL.h,
                padding: "11px 12px",
                boxSizing: "border-box",
                borderRadius: 8,
                background: C.tile,
                boxShadow: on > 0 && on < 1 ? `inset 0 0 0 1px rgba(23,82,66,${0.25 * Math.sin(Math.PI * on)})` : undefined,
              }}
            >
              <Label>{sec.label}</Label>
              <div style={{ position: "relative", marginTop: 8 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, opacity: on, translate: `0px ${(1 - on) * 5}px` }}>{sec.body}</div>
                {on < 1 ? (
                  <div style={{ position: "absolute", left: 0, top: 4, opacity: 1 - on }}>
                    <Skeleton w={190} h={8} />
                    <Skeleton w={150} h={8} style={{ marginTop: 14 }} />
                    <Skeleton w={170} h={8} style={{ marginTop: 14 }} />
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}

        {/* kept up to date */}
        <div
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            bottom: 14,
            height: 30,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 10.5,
            color: C.sub2,
            opacity: footer,
            translate: `0px ${(1 - footer) * 4}px`,
          }}
        >
          <Icon name="savvy-mark" w={13} />
          Updated by Savvy Intelligence after your last meeting
          <span style={{ width: 14, height: 14, borderRadius: 7, background: C.greenBg, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="check-dark" w={8} />
          </span>
        </div>
      </div>
    </div>
  );
};

// The loop (11 s): the summary fills in section by section, is marked as
// updated after the last meeting, holds for reading, then clears for the next
// call. The call chip's dot pulses once it's ready.
export const SUMMARY_SECONDS = 11;
export const HouseholdSummaryLoop: React.FC<{ readonly h?: number }> = () => {
  const t = useT();
  const back = 1 - ramp(t, 9.6, 10.2);
  const filled = [0, 1, 2, 3].reduce((n, i) => n + ramp(t, 0.5 + 0.6 * i, 0.95 + 0.6 * i), 0) * back;
  const footer = ramp(t, 3.3, 3.7) * back;
  const pulse = t > 3.7 && t < 9.6 ? ((t - 3.7) % 1.4) / 1.4 : 0;
  return <HouseholdSummary s={{ filled, footer, ready: footer > 0.5 ? (pulse > 0 ? pulse : 1) : 0 }} />;
};
