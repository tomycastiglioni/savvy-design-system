import { Bold, ChevronDown, Italic, Strikethrough, Underline } from "lucide-react";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import { C, CLAMP, EASE_IN_OUT, EASE_OUT } from "../theme";
import { T } from "../timeline";

type Line = { kind: "heading" | "bullet"; text: string };

const AGENDA: Line[] = [
  { kind: "heading", text: "1. Welcome & check-in" },
  { kind: "bullet", text: "Reconnect with Allison and Frank and frame this as a quarterly review of where the household stands today: about $9.69M in managed assets, two young children, and a high-income California balance sheet." },
  { kind: "bullet", text: "Recap what has changed since the last meeting, including the in-progress 2025 tax return upload, the pre-review check-in, and the open trust-as-beneficiary review." },
  { kind: "heading", text: "2. Portfolio performance" },
  { kind: "bullet", text: "Review household results through August 17: $9.69M ending value, +9.56% year to date, +12.52% over the past year, and +5.07% over the past three months." },
  { kind: "bullet", text: "Highlight account-level differences: the Trust account (••2985) is up +9.18% YTD, while the Joint account (••8859) is up +15.87% YTD, showing meaningfully higher volatility." },
  { kind: "bullet", text: "Discuss whether the current allocation still fits the family's comfort with risk, with Allison scored moderate and Frank conservative." },
  { kind: "heading", text: "3. Financial plan check-in" },
  { kind: "bullet", text: "Revisit progress toward long-term goals given roughly $950K of combined annual income and no retirement date set for either spouse." },
  { kind: "bullet", text: "Talk through cash flow priorities across the two mortgages, the pledged asset line, and how much current earnings should go to savings." },
];

// Mounted at T.agendaStart (6.6s); exits when the tasks tab is clicked.
export const MeetingAgenda: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = interpolate(frame, [0, 0.4 * fps], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const exitAt = T.tabToTasks - T.agendaStart;
  const exit = interpolate(frame, [exitAt * fps, (exitAt + 0.18) * fps], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const chip = interpolate(frame, [0.95 * fps, 1.12 * fps, 1.35 * fps], [0, 1, 0], CLAMP);
  const ring = interpolate(frame, [1.0 * fps, 1.25 * fps, 1.7 * fps], [0, 1, 0], CLAMP);
  const scroll = interpolate(frame, [0.9 * fps, 1.7 * fps], [0, -46], { ...CLAMP, easing: EASE_IN_OUT });

  return (
    <AbsoluteFill style={{ opacity: enter * (1 - exit), translate: `${30 * (1 - enter) - 30 * exit}px 0px` }}>
      <div style={{ position: "absolute", left: 52, right: 52, top: 36 }}>
        <Reveal at={0.05} style={{ marginLeft: 22 }}>
          <SectionHeader title="Meeting Agenda" subtitle="Edit to refine the meeting plan or capture notes during the meeting." />
        </Reveal>

        <Reveal
          at={0.12}
          y={14}
          style={{
            marginTop: 18,
            height: 560,
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

          <div style={{ position: "absolute", top: 46, bottom: 58, left: 0, right: 0, overflow: "hidden" }}>
            <div style={{ padding: "16px 64px 0 56px", translate: `0px ${scroll}px` }}>
              {AGENDA.map((line, i) => (
                <Reveal key={line.text} at={0.2 + i * 0.055} y={8}>
                  {line.kind === "heading" ? (
                    <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, margin: i ? "12px 0 6px -16px" : "0 0 6px -16px" }}>{line.text}</div>
                  ) : (
                    <div style={{ display: "flex", gap: 12, fontSize: 15, lineHeight: 1.55, color: C.body, marginBottom: 5, paddingLeft: 16 }}>
                      <div style={{ width: 5, height: 5, borderRadius: 3, background: C.body, marginTop: 10, flexShrink: 0 }} />
                      <div>{line.text}</div>
                    </div>
                  )}
                </Reveal>
              ))}
            </div>
            {/* Scrollbar */}
            <div style={{ position: "absolute", right: 10, top: 14 - scroll * 0.9, width: 6, height: 170, borderRadius: 3, background: "#C9CED4" }} />
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
            <span style={{ fontSize: 13, color: C.muted }}>Template:</span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                padding: "8px 12px",
                border: `1px solid ${C.borderSoft}`,
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                color: C.ink,
                scale: 1 + 0.06 * chip,
                boxShadow: `0 0 0 ${4 * ring}px rgba(103, 189, 141, ${0.35 * ring})`,
                borderColor: ring > 0.05 ? C.green300 : C.borderSoft,
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
