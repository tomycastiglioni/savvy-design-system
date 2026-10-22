import { ChevronUp, ExternalLink, FileText, Send } from "lucide-react";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Reveal } from "../components/Reveal";
import { C, CLAMP, EASE_IN_OUT, FONT } from "../theme";
import { T } from "../timeline";

const SectionLabel: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.07em", color: C.label, textTransform: "uppercase", marginBottom: 7 }}>
    {children}
  </div>
);

const ViewTask: React.FC = () => (
  <span style={{ color: C.green, fontWeight: 500, fontSize: 14, whiteSpace: "nowrap", marginLeft: 8 }}>
    View task <ExternalLink size={13} strokeWidth={2} style={{ verticalAlign: "-2px" }} />
  </span>
);

const Bullet: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "flex", gap: 12, fontSize: 15.5, lineHeight: 1.5, color: C.body, marginBottom: 6 }}>
    <div style={{ width: 4, height: 4, borderRadius: 2, background: C.faint, marginTop: 11, flexShrink: 0 }} />
    <div>{children}</div>
  </div>
);

const CHANGES = [
  "Options Overlay strategy in progress across the Trust and Joint accounts.",
  "401(k) contributions remain well below the limit for both spouses.",
  "2025 tax return requested from the client, not yet received.",
];

// Mounted at T.contextStart; exits when the agenda tab is clicked.
export const HouseholdContext: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exitAt = T.tabToAgenda - T.contextStart;
  const exit = interpolate(frame, [exitAt * fps, (exitAt + 0.18) * fps], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - exit,
        translate: `${-30 * exit}px 0px`,
        maskImage: "linear-gradient(to bottom, #000 calc(100% - 120px), transparent)",
      }}
    >
      <div style={{ position: "absolute", left: 52, right: 52, top: 40 }}>
        <Reveal at={0.1} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ fontFamily: FONT.serif, fontSize: 40, lineHeight: 1.1, color: C.ink }}>Quarterly Review</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              height: 36,
              padding: "0 14px",
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              color: C.ink,
              boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
            }}
          >
            <Send size={15} strokeWidth={1.9} /> Draft client email
          </div>
        </Reveal>
        <Reveal at={0.2} style={{ fontSize: 14.5, color: C.muted, marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}>
          <FileText size={15} strokeWidth={1.8} />
          Linked documents:
          <span style={{ color: C.green }}>Quarterly Review recap,</span>
          <span style={{ color: C.green }}>Client materials: Quarterly Review prep</span>
        </Reveal>

        <Reveal
          at={0.32}
          y={16}
          style={{
            marginTop: 32,
            marginLeft: 25,
            width: 880,
            background: C.card,
            border: `1px solid ${C.borderSoft}`,
            borderRadius: 12,
            padding: "20px 26px 22px",
          }}
        >
          <Reveal at={0.44} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: C.ink }}>Household context</div>
            <ChevronUp size={18} strokeWidth={2} color={C.muted} />
          </Reveal>

          <Reveal at={0.54}>
            <SectionLabel>Account performance</SectionLabel>
            <div style={{ fontSize: 15.5, lineHeight: 1.5, color: C.body }}>
              The portfolio ended July at $9.36M, up +5.87% YTD and +9.74% over the past year, led by the Trust account.
            </div>
          </Reveal>

          <Reveal at={0.72} style={{ marginTop: 18 }}>
            <SectionLabel>What&apos;s changed</SectionLabel>
          </Reveal>
          {CHANGES.map((text, i) => (
            <Reveal key={text} at={0.8 + i * 0.12}>
              <Bullet>
                {text}
                <ViewTask />
              </Bullet>
            </Reveal>
          ))}

          <Reveal at={1.2} style={{ marginTop: 16 }}>
            <SectionLabel>Worth keeping in mind</SectionLabel>
          </Reveal>
          <Reveal at={1.28}>
            <Bullet>
              Joint account de-risking agreed at the Mid-Year Review hasn&apos;t been executed yet.
              <ViewTask />
            </Bullet>
          </Reveal>
        </Reveal>
      </div>
    </AbsoluteFill>
  );
};
