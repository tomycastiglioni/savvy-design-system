import React from "react";
import { FirmLogo } from "../../recap/components/FirmLogo";
import { along, blink, EASE_IN_OUT, EASE_MORPH, LINEAR, lerp as lerpT, press, ramp, useT } from "../anim";
import { Caret, GlassChip, Icon, IconName, Pencil, Pointer, Spinner } from "../Bits";
import { C, DM, FONT, MEDIUM } from "../theme";

// 03 · Every report sounds like you wrote it (700×324). The request in the
// prompt pill (Figma): “Write the advisor note for the Chans’ Q4 report.”
// Sent, the pill moves up and two agents take it: the Reporting Agent builds
// the report, the Email Agent learns the advisor's writing style from their
// sent emails. The report builder rises in with the advisor note open, a
// “Writing style” indicator and the draft writing itself, and an Edit option
// the advisor takes.
export type ReportState = {
  readonly typed?: number; // 0–1 of the request
  readonly sent?: number; // 0–1: pill up, agents in
  readonly agents?: number; // how many agents are done (0–2)
  readonly builder?: number; // 0–1: the report builder rising in
  readonly note?: number; // 0–1 of the note written
  readonly hover?: boolean; // cursor on Edit
  readonly editing?: boolean; // the note open for editing
  readonly spin?: number;
  readonly caret?: boolean; // blink state for idle carets
  readonly pointer?: { x: number; y: number; o: number };
  readonly pressEdit?: number;
  readonly pressSend?: number;
};

const W = 700;
const H = 324;
const PROMPT = "Write the advisor note for the Chans’ Q4 report.";
const NOTE = "Allison, Frank — a steady quarter for you both. We brought the portfolio back to its 70/30 target and fully funded Ellie’s 529. Nothing needs your attention before we meet.";
const AGENTS: readonly { icon: IconName; name: string; working: string; done: string }[] = [
  { icon: "file-text-white", name: "Reporting Agent", working: "Building the Q4 report", done: "Report built" },
  { icon: "chip-mail", name: "Email Agent", working: "Learning your writing style", done: "Style from 212 emails" },
];
const SECTIONS = ["Performance", "Allocation", "Advisor note", "Next steps"];
const B = { x: 60, w: 580, top: 128 }; // the builder

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

// `h` lets the frame run taller than the card's (the ads let the graphic run
// on past the website card's edge).
export const EveryReport: React.FC<{ readonly s: ReportState; readonly h?: number }> = ({ s, h = H }) => {
  const { typed = 1, sent = 0, agents = 0, builder = 0, note = 0, hover = false, editing = false, spin = 0, caret = true, pointer, pressEdit = 0 } = s;
  const text = PROMPT.slice(0, Math.round(typed * PROMPT.length));
  const written = NOTE.slice(0, Math.round(note * NOTE.length));
  return (
    <div style={{ position: "relative", width: W, height: h, overflow: "hidden", fontFamily: FONT }}>
      {/* the agents on it */}
      {sent > 0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 84, display: "flex", justifyContent: "center", gap: 8, opacity: sent }}>
          {AGENTS.map((a, i) => (
            <GlassChip
              key={a.name}
              icon={a.icon}
              label={a.name}
              size={11}
              extra={
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, marginLeft: 2, color: "rgba(255,255,255,0.6)" }}>
                  · {agents > i ? a.done : a.working}
                  {agents > i ? (
                    <span style={{ width: 13, height: 13, borderRadius: 7, background: C.mint, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name="check-green" w={7.5} />
                    </span>
                  ) : (
                    <Spinner angle={spin} size={12} />
                  )}
                </span>
              }
            />
          ))}
        </div>
      ) : null}

      {/* the report builder, advisor note open */}
      {builder > 0 ? (
        <div
          style={{
            position: "absolute",
            left: B.x,
            top: lerp(h + 10, B.top, builder),
            width: B.w,
            height: h > B.top + 260 + 4 ? h - B.top + 24 : 260, // runs on past a taller frame (ads)
            background: "#ffffff",
            borderRadius: 10,
            border: `0.7px solid ${C.border}`,
            boxShadow: "0 18px 40px -18px rgba(0,0,0,0.4)",
            overflow: "hidden",
          }}
        >
          <div style={{ height: 46, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", borderBottom: `0.7px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 112, height: 24, display: "flex", alignItems: "center" }}>
                <div style={{ scale: 0.72, transformOrigin: "0 50%", width: "max-content", flexShrink: 0 }}>
                  <FirmLogo />
                </div>
              </div>
              <div style={{ fontWeight: MEDIUM, fontSize: 13, color: C.ink }}>Q4 Report · Allison &amp; Frank Chan</div>
            </div>
            <div style={{ fontFamily: DM, fontSize: 10.5, color: C.muted }}>Quarterly · Client portal</div>
          </div>
          <div style={{ display: "flex", height: 214 }}>
            <div style={{ width: 138, padding: "12px 8px", borderRight: `0.7px solid ${C.border}`, background: "#fbfbfc" }}>
              <div style={{ fontFamily: DM, fontWeight: 600, fontSize: 9, letterSpacing: "0.06em", textTransform: "uppercase", color: C.muted, padding: "0 8px 8px" }}>Sections</div>
              {SECTIONS.map((sec) => {
                const on = sec === "Advisor note";
                return (
                  <div
                    key={sec}
                    style={{
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      padding: "0 8px",
                      borderRadius: 6,
                      fontFamily: DM,
                      fontSize: 11.5,
                      fontWeight: on ? 600 : 400,
                      color: on ? C.green : C.sub2,
                      background: on ? C.greenSoft : undefined,
                    }}
                  >
                    {sec}
                  </div>
                );
              })}
            </div>
            <div style={{ flex: 1, padding: "14px 18px", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontWeight: MEDIUM, fontSize: 14, color: C.ink }}>Advisor note</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 8px 3px 5px", borderRadius: 10, background: C.greenBg, color: C.greenInk, fontSize: 10, fontWeight: MEDIUM }}>
                    <Icon name="savvy-mark" w={11} />
                    Writing style: Yours
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    height: 24,
                    padding: "0 9px",
                    borderRadius: 6,
                    border: `0.8px solid ${editing ? C.green : "#d4d7de"}`,
                    background: editing ? C.green : hover ? "#f3f5f7" : "#ffffff",
                    color: editing ? "#ffffff" : C.ink,
                    fontWeight: MEDIUM,
                    fontSize: 10.5,
                    opacity: note >= 1 ? 1 : 0.4,
                    scale: 1 - 0.06 * pressEdit,
                  }}
                >
                  {editing ? null : <Pencil size={11} />}
                  {editing ? "Done" : "Edit"}
                </div>
              </div>
              <div style={{ fontFamily: DM, fontSize: 10, color: C.muted, marginTop: 6 }}>Draft · in your voice, from your sent client emails</div>
              <div
                style={{
                  marginTop: 10,
                  padding: editing ? "9px 10px" : "9px 0",
                  borderRadius: 7,
                  border: editing ? `1px solid ${C.green2}` : "1px solid transparent",
                  boxShadow: editing ? "0 0 0 3px rgba(8,107,78,0.12)" : undefined,
                  fontFamily: DM,
                  fontSize: 12,
                  lineHeight: 1.55,
                  color: C.text,
                }}
              >
                {written}
                {(note > 0 && note < 1) || (editing && caret) ? <Caret h={13} /> : null}
              </div>
              {hover && !pointer ? <Pointer x={402} y={30} /> : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* the request */}
      <div
        style={{
          position: "absolute",
          left: W / 2,
          top: lerp(H / 2, 42, sent),
          translate: "-50% -50%",
          scale: lerp(1, 0.72, sent),
          height: 81.711,
          boxSizing: "border-box",
          padding: 8.677,
          borderRadius: 57.849,
          background: "rgba(252, 252, 250, 0.2)",
          boxShadow: "0 6.508px 13.739px rgba(37, 58, 47, 0.12)",
        }}
      >
        <div style={{ height: "100%", display: "flex", alignItems: "center", gap: 20.247, padding: "0 7.231px 0 20.247px", borderRadius: 57.849, background: "#ffffff", whiteSpace: "nowrap" }}>
          <Icon name="savvy-mark-lg" w={26.7} h={27.256} />
          <div style={{ fontSize: 17.658, lineHeight: 1.25, color: "#000000", minWidth: 366 }}>
            {text}
            {typed < 1 && caret ? <Caret h={20} color="#000000" /> : null}
          </div>
          <div style={{ width: 49.894, height: 49.894, borderRadius: "50%", background: C.green2, display: "flex", alignItems: "center", justifyContent: "center", scale: 1 - 0.08 * (s.pressSend ?? 0) }}>
            <Icon name="send-pill" w={21.137} />
          </div>
        </div>
      </div>
      {pointer && pointer.o > 0 ? (
        <div style={{ opacity: pointer.o }}>
          <Pointer x={pointer.x} y={pointer.y} />
        </div>
      ) : null}
    </div>
  );
};

export const REPORT_FRAMES: readonly { s: ReportState; title: string; caption: string }[] = [
  { s: { typed: 0.62 }, title: "The request", caption: "The request types itself in the prompt from the design: “Write the advisor note for the Chans’ Q4 report.”" },
  {
    s: { sent: 1, agents: 0, spin: 120 },
    title: "Two agents on it",
    caption: "Sent: the pill moves up and two agents pick it up. The Reporting Agent builds the report; the Email Agent learns the advisor’s writing style from their sent emails.",
  },
  {
    s: { sent: 1, agents: 1, builder: 1, note: 0.5 },
    title: "The report builder",
    caption: "Both tick. The report builder rises in with the advisor note open and a “Writing style: Yours” indicator; the draft writes itself.",
  },
  { s: { sent: 1, agents: 1, builder: 1, note: 1, hover: true }, title: "Your draft", caption: "The draft is done and reads like the advisor. The cursor goes to “Edit”." },
  { s: { sent: 1, agents: 1, builder: 1, note: 1, editing: true }, title: "Yours to edit", caption: "The note opens for editing (outlined, caret in it): the advisor has the last word. Then it loops." },
];

// The loop (13 s): the request, the agents, the builder and the draft, Edit;
// then it all steps back and the pill empties.
export const REPORT_SECONDS = 13;
const EDIT = { x: 597, y: 200 }; // the Edit button, frame px
export const EveryReportLoop: React.FC<{ readonly h?: number }> = ({ h }) => {
  const t = useT();
  const sent = ramp(t, 2.85, 3.45, EASE_MORPH) - ramp(t, 11.7, 12.3, EASE_MORPH);
  const typed = t < 12.3 ? ramp(t, 0.5, 2.5, LINEAR) : 0;
  const p = along(t, [
    [8.8, 640, 300],
    [9.35, EDIT.x + 3, EDIT.y + 4],
    [10.3, EDIT.x + 3, EDIT.y + 4],
    [10.9, 640, 300],
  ]);
  return (
    <EveryReport
      h={h}
      s={{
        typed,
        sent,
        agents: (t > 4.9 ? 1 : 0) + (t > 5.3 ? 1 : 0),
        builder: ramp(t, 5.4, 6.0) - ramp(t, 11.3, 11.85, EASE_IN_OUT),
        note: ramp(t, 6.1, 8.6, LINEAR),
        hover: t >= 9.35 && t < 11.3,
        editing: t >= 9.6 && t < 11.3,
        spin: t * 360,
        caret: t < 0.5 || t >= 12.3 ? blink(t) : t >= 9.6 ? blink(t - 9.6) : true,
        pointer: { ...p, o: lerpT(0, 1, ramp(t, 8.8, 9.05)) * (1 - ramp(t, 10.4, 10.8)) },
        pressEdit: press(t, 9.55),
        pressSend: press(t, 2.65),
      }}
    />
  );
};
