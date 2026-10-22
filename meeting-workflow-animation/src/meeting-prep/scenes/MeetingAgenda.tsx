import { Bold, ChevronDown, Italic, Strikethrough, Underline } from "lucide-react";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Reveal } from "../../shared/components/Reveal";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { C, CLAMP, EASE_IN_OUT, EASE_OUT } from "../theme";
import { T } from "../timeline";

type Line = { kind: "heading" | "bullet"; text: string };

const AGENDA: Line[] = [
  { kind: "heading", text: "1. Welcome & check-in" },
  { kind: "bullet", text: "Frame the quarterly review: $9.69M in managed assets, two young children." },
  { kind: "bullet", text: "Recap what has changed since the last meeting." },
  { kind: "heading", text: "2. Portfolio performance" },
  { kind: "bullet", text: "Review results through August 17: +9.56% year to date." },
  { kind: "bullet", text: "Compare the Trust (+9.18% YTD) and Joint (+15.87% YTD) accounts." },
  { kind: "bullet", text: "Check the allocation still fits each spouse's comfort with risk." },
  { kind: "heading", text: "3. Financial plan check-in" },
  { kind: "bullet", text: "Revisit long-term goals and retirement timing." },
  { kind: "bullet", text: "Talk through cash flow across the two mortgages." },
  { kind: "heading", text: "4. Tax & accounts" },
  { kind: "bullet", text: "Confirm the 2025 tax return upload and 401(k) contributions." },
];

// Mounted at T.agendaStart; exits when the tasks tab is clicked.
export const MeetingAgenda: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exitAt = T.tabToTasks - T.agendaStart;
  const enter = interpolate(frame, [0, 0.4 * fps], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const exit = interpolate(frame, [exitAt * fps, (exitAt + 0.18) * fps], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const chip = interpolate(frame, [1.2 * fps, 1.38 * fps, 1.6 * fps], [0, 1, 0], CLAMP);
  const ring = interpolate(frame, [1.25 * fps, 1.5 * fps, 2.0 * fps], [0, 1, 0], CLAMP);

  return (
    <AbsoluteFill style={{ opacity: enter * (1 - exit), translate: `${30 * (1 - enter) - 30 * exit}px 0px` }}>
      <div style={{ position: "absolute", left: 52, right: 52, top: 40 }}>
        <Reveal at={0.05} style={{ marginLeft: 22 }}>
          <SectionHeader title="Meeting Agenda" />
        </Reveal>

        <Reveal
          at={0.12}
          y={14}
          style={{
            marginTop: 20,
            height: 540,
            border: `1px solid ${C.borderSoft}`,
            borderRadius: 12,
            background: C.white,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div style={{ height: 46, display: "flex", alignItems: "center", gap: 16, padding: "0 18px", color: C.faint, borderBottom: "1px solid #F0F1F3" }}>
            <Bold size={16} strokeWidth={2.2} />
            <Italic size={16} strokeWidth={2.2} />
            <Underline size={16} strokeWidth={2.2} />
            <Strikethrough size={16} strokeWidth={2.2} />
          </div>

          <div style={{ padding: "20px 64px 0 56px" }}>
            {AGENDA.map((line, i) => (
              <Reveal key={line.text} at={0.22 + i * 0.065} y={8}>
                {line.kind === "heading" ? (
                  <div style={{ fontSize: 16.5, fontWeight: 700, color: C.ink, margin: i ? "14px 0 7px -16px" : "0 0 7px -16px" }}>{line.text}</div>
                ) : (
                  <div style={{ display: "flex", gap: 12, fontSize: 15.5, lineHeight: 1.55, color: C.body, marginBottom: 5, paddingLeft: 16 }}>
                    <div style={{ width: 5, height: 5, borderRadius: 3, background: C.body, marginTop: 10, flexShrink: 0 }} />
                    <div>{line.text}</div>
                  </div>
                )}
              </Reveal>
            ))}
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 58,
              borderTop: "1px solid #F0F1F3",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 10,
              padding: "0 18px",
              background: C.white,
            }}
          >
            <span style={{ fontSize: 13.5, color: C.muted }}>Template:</span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                padding: "8px 12px",
                border: `1px solid ${ring > 0.05 ? C.green300 : C.borderSoft}`,
                borderRadius: 8,
                fontSize: 13.5,
                fontWeight: 500,
                color: C.ink,
                scale: 1 + 0.06 * chip,
                boxShadow: `0 0 0 ${4 * ring}px rgba(103, 189, 141, ${0.35 * ring})`,
              }}
            >
              Quarterly Review
              <ChevronDown size={14} strokeWidth={2} color={C.muted} />
            </div>
          </div>
        </Reveal>
      </div>
    </AbsoluteFill>
  );
};
