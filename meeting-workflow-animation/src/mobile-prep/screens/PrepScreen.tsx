import { ChevronLeft, ChevronUp, Flag, Share } from "lucide-react";
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AIIcon } from "../../shared/components/AIIcon";
import { Avatar } from "../../shared/components/Avatar";
import { Reveal } from "../../shared/components/Reveal";
import { ACCOUNT_CHANGES, AGENDA, FLAGGED, OPEN_TASK, REVIEW } from "../content";
import { AMBER, C, FONT, PAD, SAFE_TOP, W } from "../layout";
import { pushAt, T } from "../timeline";

const Label: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.07em", color: C.label, textTransform: "uppercase", margin: "16px 0 7px" }}>
    {children}
  </div>
);

// Rows fade in one after another as the screen lands. `at` is local to the
// screen's Sequence.
const STEP = 0.05;
const at = (i: number) => T.reveal - T.push + i * STEP;
const Row: React.FC<{ readonly i: number; readonly style?: React.CSSProperties; readonly children: React.ReactNode }> = ({ i, style, children }) => (
  <Reveal at={at(i)} dur={0.35} y={6} style={style}>
    {children}
  </Reveal>
);

// Mounted at T.push. The prep the notification opens: household summary and a
// short agenda on one screen.
export const PrepScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const push = pushAt(frame / fps + T.push);

  return (
    <AbsoluteFill
      style={{
        background: C.white,
        translate: `${W * (1 - push)}px 0px`,
        boxShadow: push < 1 ? "-8px 0 24px rgba(16, 24, 40, 0.10)" : "none",
      }}
    >
      {/* Nav bar */}
      <div style={{ position: "absolute", left: 6, top: SAFE_TOP, height: 44, display: "flex", alignItems: "center", color: C.green }}>
        <ChevronLeft size={28} strokeWidth={2.2} />
        <span style={{ fontSize: 17, fontWeight: 500, marginLeft: -1 }}>Today</span>
      </div>
      <div style={{ position: "absolute", right: PAD, top: SAFE_TOP, height: 44, display: "flex", alignItems: "center", color: C.green }}>
        <Share size={20} strokeWidth={2} />
      </div>

      <div style={{ position: "absolute", left: PAD, right: PAD, top: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: C.muted }}>
          <AIIcon size={14} /> Prepared by Savvy Intelligence
        </div>
        <div style={{ fontFamily: FONT.serif, fontSize: 30, lineHeight: 1.1, color: C.ink, marginTop: 9 }}>{REVIEW.title}</div>
        <div style={{ fontSize: 14, color: C.muted, marginTop: 6 }}>{REVIEW.meta}</div>
      </div>

      <div style={{ position: "absolute", left: PAD - 4, right: PAD - 4, top: 196, display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Household summary */}
        <div style={{ background: C.card, border: `1px solid ${C.borderSoft}`, borderRadius: 16, padding: "15px 16px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 16.5, fontWeight: 600, color: C.ink }}>Household summary</div>
            <ChevronUp size={18} strokeWidth={2} color={C.muted} />
          </div>

          <Row i={0}>
            <Label>Account changes</Label>
            {ACCOUNT_CHANGES.map((text) => (
              <div key={text} style={{ display: "flex", gap: 10, fontSize: 14, lineHeight: 1.45, color: C.body, marginBottom: 3 }}>
                <div style={{ width: 4, height: 4, borderRadius: 2, background: C.faint, marginTop: 9, flexShrink: 0 }} />
                {text}
              </div>
            ))}
          </Row>

          <Row i={1}>
            <Label>Open task</Label>
            <div style={{ background: C.white, border: `1px solid ${C.borderSoft}`, borderRadius: 12, padding: "11px 12px" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{OPEN_TASK.title}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 7, fontSize: 12.5, color: C.muted }}>
                <Avatar size={18} person="heather" />
                {OPEN_TASK.owner} · {OPEN_TASK.due}
                <div
                  style={{
                    marginLeft: "auto",
                    fontSize: 11.5,
                    fontWeight: 500,
                    color: C.ink,
                    padding: "3px 8px",
                    borderRadius: 7,
                    border: `1px solid ${C.borderSoft}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {OPEN_TASK.status}
                </div>
              </div>
            </div>
          </Row>

          <Row i={2}>
            <Label>Flagged</Label>
            <div
              style={{
                display: "flex",
                gap: 9,
                background: AMBER.bg,
                border: `1px solid ${AMBER.border}`,
                borderRadius: 12,
                padding: "10px 12px",
              }}
            >
              <Flag size={15} strokeWidth={2.2} color={AMBER.icon} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{FLAGGED.title}</div>
                <div style={{ fontSize: 12.5, color: C.muted, marginTop: 3 }}>{FLAGGED.due}</div>
              </div>
            </div>
          </Row>
        </div>

        {/* Agenda */}
        <div style={{ background: C.white, border: `1px solid ${C.borderSoft}`, borderRadius: 16, padding: "15px 16px 8px" }}>
          <div style={{ fontSize: 16.5, fontWeight: 600, color: C.ink, marginBottom: 10 }}>Agenda</div>
          {AGENDA.map((item, i) => (
            <Row key={item} i={3 + i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  background: C.tabsBg,
                  fontSize: 11,
                  fontWeight: 600,
                  color: C.muted,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <div style={{ fontSize: 14, color: C.body }}>{item}</div>
            </Row>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
