import { ChartLine, Landmark, Mail, NotebookPen } from "lucide-react";
import React from "react";
import { Icon, Pill, Skeleton, Spinner } from "../../more-ways/Bits";
import { C, MEDIUM } from "../../more-ways/theme";
import { Button, c01, Done, Frame, Head, Label, MarkAvatar, Panel } from "../Bits";

// Automated meeting prep. Tomorrow's Quarterly Review with the Chans,
// prepared on its own: Savvy pulls from their accounts, plan, last meeting
// notes and emails, writes the agenda item by item, and flags a talking
// point. Prep ready.
export type PrepState = {
  readonly pulled?: number; // 0–4 sources pulled (fractional: the one in progress)
  readonly agenda?: number; // 0–4 agenda items written
  readonly ready?: number; // 0–1: prep ready, the talking point and Review prep
  readonly spin?: number;
};

type G = React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
const SOURCES: readonly { label: string; meta: string; Glyph: G }[] = [
  { label: "Accounts", meta: "6 accounts", Glyph: Landmark },
  { label: "Financial plan", meta: "Updated Oct 14", Glyph: ChartLine },
  { label: "Last meeting notes", meta: "Quarterly Review", Glyph: NotebookPen },
  { label: "Recent emails", meta: "4 threads", Glyph: Mail },
];
const AGENDA = ["Check-in and life updates", "Portfolio: back to 70/30", "Retiring at 63: on track", "Opening Ellie’s 529"];
const SRC = { x: 20, top: 98, h: 40, w: 214 };
const AG = { x: 258, top: 98, h: 36, w: 302 };

export const MeetingPrep: React.FC<{ readonly s: PrepState }> = ({ s }) => {
  const { pulled = 4, agenda = 4, ready = 1, spin = 0 } = s;
  return (
    <Frame>
      <Panel>
        <Head
          lead={<MarkAvatar />}
          title="Quarterly Review"
          sub="Allison & Frank Chan · Tomorrow, 2:00 PM"
          right={
            ready > 0.5 ? (
              <Pill tone="green" size={10.5}>
                <Icon name="check-dark" w={8} /> Prep ready
              </Pill>
            ) : (
              <Pill tone="amber" size={10.5} style={{ background: "#f1f3f5", color: C.sub2 }}>
                <Spinner angle={spin} size={9} dark={false} /> Preparing…
              </Pill>
            )
          }
        />
        {/* what it pulls together */}
        <Label style={{ position: "absolute", left: SRC.x, top: 80 }}>Pulled together from</Label>
        {SOURCES.map(({ label, meta, Glyph }, i) => {
          const p = c01(pulled - i);
          return (
            <div key={label} style={{ position: "absolute", left: SRC.x, top: SRC.top + i * (SRC.h + 6), width: SRC.w, height: SRC.h, display: "flex", alignItems: "center", gap: 10, padding: "0 10px", boxSizing: "border-box", borderRadius: 8, background: C.tile, opacity: 0.45 + 0.55 * c01(pulled - i + 1) }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: "#ffffff", border: `0.7px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Glyph size={12} color={C.sub} strokeWidth={1.9} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11.5, color: C.ink, whiteSpace: "nowrap" }}>{label}</div>
                <div style={{ fontSize: 9.5, color: C.muted, marginTop: 1 }}>{meta}</div>
              </div>
              {p >= 1 ? <Done /> : p > 0 ? <Spinner angle={spin} size={11} dark={false} /> : null}
            </div>
          );
        })}

        {/* the agenda, written item by item */}
        <Label style={{ position: "absolute", left: AG.x, top: 80 }}>Agenda</Label>
        {AGENDA.map((item, i) => {
          const on = c01(agenda - i);
          return (
            <div key={item} style={{ position: "absolute", left: AG.x, top: AG.top + i * (AG.h + 6), width: AG.w, height: AG.h, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 22, height: 22, borderRadius: 11, background: on > 0 ? C.greenIcon : "#eef0f2", color: C.green, fontSize: 10.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
              <div style={{ position: "relative", flex: 1, height: 16 }}>
                <div style={{ position: "absolute", inset: 0, fontSize: 12.5, color: C.ink, whiteSpace: "nowrap", opacity: on, translate: `0px ${(1 - on) * 4}px` }}>{item}</div>
                {on < 1 ? <Skeleton w={150 + ((i * 37) % 60)} h={8} style={{ position: "absolute", top: 4, opacity: 1 - on }} /> : null}
              </div>
            </div>
          );
        })}

        {/* a talking point, flagged */}
        <div
          style={{
            position: "absolute",
            left: AG.x,
            top: 272,
            width: AG.w,
            height: 44,
            boxSizing: "border-box",
            padding: "0 12px",
            borderRadius: 8,
            background: "rgba(222,243,220,0.6)",
            display: "flex",
            alignItems: "center",
            gap: 9,
            opacity: ready,
            translate: `0px ${(1 - ready) * 6}px`,
          }}
        >
          <Icon name="savvy-mark" w={14} />
          <div style={{ fontSize: 11, lineHeight: 1.35, color: C.text }}>
            <span style={{ fontWeight: MEDIUM }}>Talking point:</span> Frank asked about Social Security timing.
          </div>
        </div>
        <div style={{ position: "absolute", left: SRC.x, top: 279, opacity: ready }}>
          <Button primary={false}>
            <Icon name="savvy-mark" w={13} /> Review prep
          </Button>
        </div>
      </Panel>
    </Frame>
  );
};

export const PREP_FRAMES: readonly { s: PrepState; title: string; caption: string }[] = [
  { s: { pulled: 2.5, agenda: 0, ready: 0, spin: 120 }, title: "Preparing on its own", caption: "Tomorrow’s Quarterly Review with the Chans. No one asked: Savvy pulls their accounts, plan, last meeting notes and emails, one after another." },
  { s: { pulled: 4, agenda: 2.6, ready: 0, spin: 220 }, title: "The agenda writes itself", caption: "With everything in, the agenda fills in item by item: check-in, back to 70/30, retiring at 63, Ellie’s 529." },
  { s: {}, title: "Prep ready", caption: "“Prep ready”, with a flagged talking point (Frank asked about Social Security timing) and Review prep." },
];
