import { ChevronUp, ExternalLink, FileText, Send } from "lucide-react";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Reveal } from "../components/Reveal";
import { C, CLAMP, EASE_IN_OUT, FONT } from "../theme";
import { T } from "../timeline";

const SectionLabel: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.07em", color: C.label, textTransform: "uppercase", marginBottom: 6 }}>
    {children}
  </div>
);

const ViewTask: React.FC = () => (
  <span style={{ color: C.green, fontWeight: 500, fontSize: 14, whiteSpace: "nowrap", marginLeft: 8 }}>
    View task <ExternalLink size={13} strokeWidth={2} style={{ verticalAlign: "-2px" }} />
  </span>
);

const Bullet: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "flex", gap: 12, fontSize: 15, lineHeight: 1.5, color: C.body, marginBottom: 4 }}>
    <div style={{ width: 4, height: 4, borderRadius: 2, background: C.faint, marginTop: 10, flexShrink: 0 }} />
    <div>{children}</div>
  </div>
);

const CHANGES = [
  "Two requests are in progress to implement a Savvy Portfolio Finance (Options Overlay) strategy across both the Trust (••2985) and Joint (••8859) Schwab accounts.",
  "A rejected fee task is open — the Joint account (••8859) had insufficient cash to cover a $500 advisory fee; cash needs to be raised before ops can resubmit.",
  "A task to maximize tax-deferred contributions across both employers is in progress — 401(k) utilization remains very low relative to their combined $786K income.",
  "The 2025 tax return upload request sent to the client is still in progress — not yet received.",
];

// Mounted at T.contextStart (4.25s); exits when the agenda tab is clicked.
export const HouseholdContext: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exitAt = T.tabToAgenda - T.contextStart;
  const exit = interpolate(frame, [exitAt * fps, (exitAt + 0.18) * fps], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const scrolled = interpolate(frame, [0.9 * fps, 1.85 * fps], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const highlight = interpolate(frame, [1.4 * fps, 1.9 * fps], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - exit,
        translate: `${-30 * exit}px 0px`,
        // Top edge fades in only as the content scrolls under it.
        maskImage: `linear-gradient(to bottom, rgba(0, 0, 0, ${1 - scrolled}) 0px, #000 70px, #000 calc(100% - 120px), transparent)`,
      }}
    >
      <div style={{ position: "absolute", left: 52, right: 52, top: 38, translate: `0px ${-126 * scrolled}px` }}>
        <Reveal at={0.05} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ fontFamily: FONT.serif, fontSize: 38, lineHeight: 1.1, color: C.ink }}>Quarterly Review</div>
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
        <Reveal at={0.13} style={{ fontSize: 14, color: C.muted, marginTop: 10 }}>
          Jul 31, 9:00 AM · 30 min · YTD +5.87% · last quarter (Q2) +8.63% · past year +9.74% · past month −1.08%
        </Reveal>
        <Reveal at={0.2} style={{ fontSize: 14, color: C.muted, marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
          <FileText size={15} strokeWidth={1.8} />
          Linked documents:
          <span style={{ color: C.green }}>Quarterly Review recap,</span>
          <span style={{ color: C.green }}>Client materials: Quarterly Review prep · Jul 31</span>
        </Reveal>

        <Reveal
          at={0.28}
          y={16}
          style={{
            marginTop: 30,
            marginLeft: 25,
            width: 880,
            background: C.card,
            border: `1px solid ${C.borderSoft}`,
            borderRadius: 12,
            padding: "18px 24px 20px",
          }}
        >
          <Reveal at={0.38} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: C.ink }}>Household context</div>
            <ChevronUp size={18} strokeWidth={2} color={C.muted} />
          </Reveal>

          <Reveal at={0.45}>
            <SectionLabel>Account performance</SectionLabel>
            <div style={{ fontSize: 15, lineHeight: 1.5, color: C.body }}>
              The portfolio ended July at $9.36M, up +5.87% YTD and +9.74% over the past year. Q2 (last quarter) was the standout period at +8.63%, driven almost entirely by the Trust account (••2985, +7.78% last quarter). The Joint account (••8859) had a strong Q2 rebound at +23.67% but pulled back −4.61% in July, underscoring its higher volatility relative to the Trust.
            </div>
          </Reveal>

          <Reveal at={0.62} style={{ marginTop: 16 }}>
            <SectionLabel>What&apos;s changed</SectionLabel>
          </Reveal>
          {CHANGES.map((text, i) => (
            <Reveal key={text} at={0.68 + i * 0.09}>
              <Bullet>
                {text}
                <ViewTask />
              </Bullet>
            </Reveal>
          ))}

          <Reveal at={1.08} style={{ marginTop: 14 }}>
            <SectionLabel>Worth keeping in mind</SectionLabel>
          </Reveal>
          <Reveal at={1.14}>
            <Bullet>
              <span
                style={{
                  backgroundImage: `linear-gradient(${C.amber100}, ${C.amber100})`,
                  backgroundSize: `${highlight * 100}% 100%`,
                  backgroundRepeat: "no-repeat",
                  borderRadius: 3,
                  padding: "1px 0",
                }}
              >
                The Joint account (••8859) de-risking agreed at the 6/10 Mid-Year Review has not yet been executed
              </span>{" "}
              — a lower-beta target allocation proposal for this account is still outstanding.
              <ViewTask />
            </Bullet>
          </Reveal>
          <Reveal at={1.23}>
            <Bullet>
              Multiple money movement requests remain open and past due — ops should confirm which are still actionable before the meeting.
            </Bullet>
          </Reveal>
        </Reveal>
      </div>
    </AbsoluteFill>
  );
};
