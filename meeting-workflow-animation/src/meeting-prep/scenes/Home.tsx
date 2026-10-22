import React from "react";
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AIIcon, AIIconAvatar } from "../../shared/components/AIIcon";
import { Avatar } from "../../shared/components/Avatar";
import { Reveal } from "../../shared/components/Reveal";
import { C, CLAMP, EASE_IN_OUT, EASE_OUT, FONT, REVIEW_BUTTON, REVIEW_CARD, REVIEW_PANEL } from "../theme";
import { T } from "../timeline";

const STATS: { label: string; value: (p: number) => string; sub: string }[] = [
  { label: "AUM", value: (p) => `$${(240.3 * p).toFixed(1)}M`, sub: "1 new in 30 days" },
  { label: "Upcoming meetings", value: () => "1", sub: "1 completed today" },
  { label: "Prospects", value: (p) => String(Math.round(384 * p)), sub: "8 new in 30 days" },
  { label: "Reviews", value: () => "1", sub: "All reviews on track" },
];

// Local time = absolute time (mounted at frame 0).
export const Home: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const click = T.clickReview;

  const exit = interpolate(frame, [T.prepDocStart * fps, (T.prepDocStart + 0.4) * fps], [0, 1], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const count = interpolate(frame, [0.35 * fps, 1.6 * fps], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const card = interpolate(frame, [0.95 * fps, 1.55 * fps], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const glow = interpolate(frame, [1.5 * fps, 1.8 * fps, 2.5 * fps], [0, 1, 0], CLAMP);
  const hover = interpolate(frame, [(click - 0.32) * fps, (click - 0.2) * fps], [0, 1], CLAMP);
  const press = interpolate(frame, [(click - 0.03) * fps, (click + 0.05) * fps, (click + 0.15) * fps], [0, 1, 0], CLAMP);

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - exit,
        scale: 1 - 0.015 * exit,
        filter: `blur(${exit * 4}px)`,
      }}
    >
      {/* Greeting */}
      <Reveal
        at={0}
        dur={0.6}
        y={12}
        style={{ position: "absolute", left: 129, top: 159, height: 70, display: "flex", alignItems: "center", gap: 28 }}
      >
        <Avatar size={70} person="heather" />
        <div style={{ fontFamily: FONT.serif, fontSize: 42, lineHeight: 1, color: C.ink, letterSpacing: "-0.005em" }}>
          Good afternoon, Heather
        </div>
      </Reveal>

      {/* Stats */}
      <Reveal
        at={0.15}
        dur={0.6}
        y={12}
        style={{
          position: "absolute",
          left: 130,
          top: 261,
          width: 1037,
          height: 142,
          background: C.white,
          border: `1px solid ${C.statsBorder}`,
          borderRadius: 12,
          display: "flex",
          overflow: "hidden",
        }}
      >
        {STATS.map((s, i) => (
          <Reveal
            key={s.label}
            at={0.3 + i * 0.08}
            y={10}
            style={{ flex: 1, padding: "25px 26px", borderLeft: i ? `1px solid ${C.statsBorder}` : "none" }}
          >
            <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: "0.05em", color: C.body, textTransform: "uppercase", whiteSpace: "nowrap" }}>
              {s.label}
            </div>
            <div style={{ fontSize: 36, fontWeight: 500, color: C.ink, marginTop: 12, letterSpacing: "-0.01em", fontVariantNumeric: "tabular-nums" }}>
              {s.value(count)}
            </div>
            <div style={{ fontSize: 15.5, color: C.muted, marginTop: 8, whiteSpace: "nowrap" }}>{s.sub}</div>
          </Reveal>
        ))}
      </Reveal>

      {/* For your review */}
      <Reveal
        at={0.65}
        dur={0.6}
        y={14}
        style={{
          position: "absolute",
          left: REVIEW_PANEL.x,
          top: REVIEW_PANEL.y,
          width: REVIEW_PANEL.w,
          height: REVIEW_PANEL.h,
          background: C.panel,
          borderRadius: 12,
        }}
      >
        <div style={{ position: "absolute", left: 25, top: 28, fontSize: 20, fontWeight: 500, color: C.ink }}>
          For your review <span style={{ color: C.muted, fontWeight: 400 }}>(1)</span>
        </div>

        <div
          style={{
            position: "absolute",
            left: REVIEW_CARD.x - REVIEW_PANEL.x,
            top: REVIEW_CARD.y - REVIEW_PANEL.y,
            width: REVIEW_CARD.w,
            height: REVIEW_CARD.h,
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
          <div style={{ position: "absolute", left: 105, top: 26, fontSize: 18, fontWeight: 500, color: C.ink, whiteSpace: "nowrap" }}>
            Meeting prep document created for Allison &amp; Frank Chan household
          </div>
          <div style={{ position: "absolute", left: 105, top: 57, fontSize: 17, color: C.muted, whiteSpace: "nowrap" }}>
            Quarterly Review · Friday, Jul 31, 2026 9:00 AM ET · Allison &amp; Frank Chan
          </div>

          {/* The button the cursor clicks; the PrepDocument box takes over at T.prepDocStart. */}
          <div
            style={{
              position: "absolute",
              // Canvas rect minus the card offset and the card's 1px border.
              left: REVIEW_BUTTON.x - REVIEW_CARD.x - 1,
              top: REVIEW_BUTTON.y - REVIEW_CARD.y - 1,
              width: REVIEW_BUTTON.w,
              height: REVIEW_BUTTON.h,
              borderRadius: 9,
              border: `1px solid ${interpolateColors(hover, [0, 1], [C.faint, C.muted])}`,
              background: interpolateColors(hover, [0, 1], [C.white, C.panel]),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 9,
              fontSize: 15.5,
              fontWeight: 500,
              color: C.ink,
              scale: 1 - 0.03 * press,
              opacity: frame >= T.prepDocStart * fps ? 0 : 1,
            }}
          >
            <AIIcon size={20} />
            Review prep document
          </div>
        </div>
      </Reveal>
    </AbsoluteFill>
  );
};
