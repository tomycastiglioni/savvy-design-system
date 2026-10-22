import { Archive, ChevronRight, Clock } from "lucide-react";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Avatar } from "../components/Avatar";
import { Reveal } from "../components/Reveal";
import { SIMark } from "../components/SIMark";
import { C, CLAMP, EASE_IN_OUT, EASE_OUT, FONT, REVIEW_BUTTON } from "../theme";

const STATS: { label: string; value: (p: number) => string; sub: string }[] = [
  { label: "AUM", value: (p) => `$${(241.1 * p).toFixed(1)}M`, sub: "1 new in 30 days" },
  { label: "Upcoming meetings", value: () => "1", sub: "1 completed today" },
  { label: "Prospects", value: (p) => String(Math.round(385 * p)), sub: "8 new in 30 days" },
  { label: "Onboarding", value: (p) => String(Math.round(197 * p)), sub: "197 in progress" },
  { label: "Reviews", value: () => "1", sub: "All reviews on track" },
];

// Local time = absolute time (mounted at frame 0).
export const Home: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exit = interpolate(frame, [2.5 * fps, 2.9 * fps], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const count = interpolate(frame, [0.3 * fps, 1.4 * fps], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const card = interpolate(frame, [0.75 * fps, 1.35 * fps], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const glow = interpolate(frame, [1.25 * fps, 1.55 * fps, 2.2 * fps], [0, 1, 0], CLAMP);
  const hover = interpolate(frame, [2.08 * fps, 2.2 * fps], [0, 1], CLAMP);
  const press = interpolate(frame, [2.32 * fps, 2.4 * fps, 2.5 * fps], [0, 1, 0], CLAMP);

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - exit,
        scale: 1 - 0.015 * exit,
        filter: `blur(${exit * 4}px)`,
      }}
    >
      {/* Greeting + stats */}
      <Reveal
        at={0}
        dur={0.6}
        y={14}
        style={{ position: "absolute", left: 155, top: 145, width: 990, height: 300, background: C.panel, borderRadius: 14 }}
      >
        <div style={{ position: "absolute", left: 18, top: 18 }}>
          <Avatar size={84} initials="HL" />
        </div>
        <Reveal at={0.1} y={8} style={{ position: "absolute", left: 124, top: 22 }}>
          <div style={{ fontFamily: FONT.serif, fontSize: 46, lineHeight: 1.1, color: C.ink, letterSpacing: "-0.005em" }}>
            Good afternoon, Heather.
          </div>
          <div style={{ fontSize: 17, color: C.muted, marginTop: 10 }}>Today is Friday, August 21, 2026.</div>
        </Reveal>
        <div
          style={{
            position: "absolute",
            left: 17,
            top: 128,
            width: 956,
            height: 154,
            background: C.white,
            border: `1px solid ${C.borderSoft}`,
            borderRadius: 12,
            display: "flex",
            overflow: "hidden",
          }}
        >
          {STATS.map((s, i) => (
            <Reveal
              key={s.label}
              at={0.25 + i * 0.07}
              y={10}
              style={{ flex: 1, padding: "24px 22px", borderLeft: i ? `1px solid ${C.borderSoft}` : "none" }}
            >
              <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: "0.06em", color: C.muted, textTransform: "uppercase", whiteSpace: "nowrap" }}>
                {s.label}
              </div>
              <div style={{ fontSize: 34, fontWeight: 500, color: C.ink, marginTop: 14, letterSpacing: "-0.01em", fontVariantNumeric: "tabular-nums" }}>
                {s.value(count)}
              </div>
              <div style={{ fontSize: 14, color: C.muted, marginTop: 8, whiteSpace: "nowrap" }}>{s.sub}</div>
            </Reveal>
          ))}
        </div>
      </Reveal>

      {/* For your review */}
      <Reveal
        at={0.5}
        dur={0.6}
        y={14}
        style={{ position: "absolute", left: 155, top: 475, width: 990, height: 278, background: C.panel, borderRadius: 14 }}
      >
        <div style={{ position: "absolute", left: 18, top: 22, fontSize: 20, fontWeight: 600, color: C.ink }}>
          For your review <span style={{ color: C.faint, fontWeight: 400 }}>(1)</span>
        </div>
        <div style={{ position: "absolute", right: 24, top: 25, fontSize: 15, fontWeight: 500, color: C.ink, display: "flex", alignItems: "center", gap: 4 }}>
          View all <ChevronRight size={16} strokeWidth={2} />
        </div>

        <div
          style={{
            position: "absolute",
            left: 17,
            top: 73,
            width: 956,
            height: 190,
            background: C.white,
            border: `1px solid ${C.borderSoft}`,
            borderRadius: 12,
            opacity: card,
            translate: `0px ${(1 - card) * 28}px`,
            scale: 0.98 + 0.02 * card,
            boxShadow: `0 0 0 ${glow * 6}px rgba(103, 189, 141, ${0.3 * glow}), 0 ${2 + 10 * card}px ${24 * card}px -8px rgba(16, 24, 40, ${0.1 * card})`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 21,
              top: 22,
              width: 50,
              height: 50,
              borderRadius: "50%",
              background: C.green50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SIMark size={30} />
          </div>
          <div style={{ position: "absolute", left: 89, top: 21, fontSize: 18, fontWeight: 500, color: C.ink }}>
            Meeting prep document created for Allison &amp; Frank Chan household
          </div>
          <div style={{ position: "absolute", left: 89, top: 52, width: 600, fontSize: 16, lineHeight: 1.45, color: C.muted }}>
            Quarterly Review · Friday, Jul 31, 2026 9:00 AM ET · Allison &amp; Frank Chan household
          </div>
          <div style={{ position: "absolute", right: 22, top: 24, display: "flex", alignItems: "center", gap: 16, color: "#3B4252" }}>
            <span style={{ fontSize: 14, color: C.muted }}>4m ago</span>
            <Clock size={19} strokeWidth={1.8} />
            <Archive size={19} strokeWidth={1.8} />
          </div>

          {/* The button the cursor clicks; the PrepDocument box takes over at 2.5s. */}
          <div
            style={{
              position: "absolute",
              // Canvas rect minus panel offset, card offset and the card's 1px border.
              left: REVIEW_BUTTON.x - 155 - 17 - 1,
              top: REVIEW_BUTTON.y - 475 - 73 - 1,
              width: REVIEW_BUTTON.w,
              height: REVIEW_BUTTON.h,
              borderRadius: 8,
              border: `1px solid ${interpolateColors(hover, [0, 1], [C.border, C.faint])}`,
              background: interpolateColors(hover, [0, 1], [C.white, C.panel]),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 9,
              fontSize: 15,
              fontWeight: 500,
              color: C.ink,
              boxShadow: "0 1px 2px rgba(16, 24, 40, 0.06)",
              scale: 1 - 0.03 * press,
              opacity: frame >= 2.5 * fps ? 0 : 1,
            }}
          >
            <SIMark size={20} />
            Review prep document
          </div>
        </div>
      </Reveal>
    </AbsoluteFill>
  );
};
