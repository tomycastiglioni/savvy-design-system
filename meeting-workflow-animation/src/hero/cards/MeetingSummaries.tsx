import React from "react";
import { Icon, Pointer } from "../../more-ways/Bits";
import { C, MEDIUM } from "../../more-ways/theme";
import { Frame, Head, Label, MarkAvatar, Panel, Switch } from "../Bits";

// Customizable meeting summaries. The summary of the Chans' review, written
// from the meeting; switch its template and it rewrites itself (terse
// advisor notes → a recap for the clients), switch a section on and it's
// added; the setup is saved as the advisor's default.
export type SummaryTemplate = "notes" | "recap";
export type SummariesState = {
  readonly template?: SummaryTemplate;
  readonly swap?: number; // 0–1: the preview rewriting (fades out, then in)
  readonly next?: number; // 0–1 the "Next meeting" section switched on
  readonly saved?: number; // 0–1 "Saved as your default"
  readonly pointer?: { x: number; y: number; o: number };
};

const SIDE = { x: 14, y: 72, w: 168, h: 246 };
const PREV = { x: 198, y: 78, w: 362 };
const TEMPLATES: readonly { key: SummaryTemplate | "compliance"; label: string }[] = [
  { key: "notes", label: "Advisor notes" },
  { key: "recap", label: "Client recap" },
  { key: "compliance", label: "Compliance record" },
];
const SECTIONS = ["Decisions", "Action items", "Next meeting"];
export const templateAt = (i: number) => ({ x: 20 + SIDE.x + 120, y: 14 + SIDE.y + 32 + i * 30 + 12 }); // frame px
export const sectionAt = (i: number) => ({ x: 20 + SIDE.x + SIDE.w - 24, y: 14 + SIDE.y + 154 + i * 28 + 10 });

const Bullet: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "flex", gap: 8, alignItems: "baseline", fontSize: 11.5, lineHeight: 1.45, color: C.text }}>
    <span style={{ width: 4, height: 4, borderRadius: 2, background: C.green2, flexShrink: 0, translate: "0px -2px" }} />
    <span>{children}</span>
  </div>
);

const Notes: React.FC = () => (
  <>
    <div style={{ fontWeight: MEDIUM, fontSize: 13.5, color: C.ink }}>Advisor notes</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 9 }}>
      <Bullet>Rebalance to 70/30: approved</Bullet>
      <Bullet>Retiring at 63: on track (88%)</Bullet>
      <Bullet>Ellie’s 529: Priya opens it this week</Bullet>
      <Bullet>Frank: Social Security timing, revisit in Jan</Bullet>
    </div>
  </>
);
const Recap: React.FC = () => (
  <>
    <div style={{ fontWeight: MEDIUM, fontSize: 13.5, color: C.ink }}>Hi Allison and Frank,</div>
    <div style={{ fontSize: 11.5, lineHeight: 1.45, color: C.sub, marginTop: 6 }}>Thanks for meeting today. Here’s what we agreed:</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 7 }}>
      <Bullet>We’ll bring your portfolio back to 70/30.</Bullet>
      <Bullet>You’re on track to retire at 63.</Bullet>
      <Bullet>Priya will send the forms for Ellie’s 529.</Bullet>
    </div>
  </>
);

export const MeetingSummaries: React.FC<{ readonly s: SummariesState }> = ({ s }) => {
  const { template = "notes", swap = 0, next = 0, saved = 0, pointer } = s;
  // the preview leaves (swap 0 → 0.5) and the new template comes in (0.5 → 1)
  const shown: SummaryTemplate = swap > 0 && swap < 0.5 ? (template === "recap" ? "notes" : "recap") : template;
  const fade = swap > 0 && swap < 1 ? Math.abs(1 - 2 * swap) : 1;
  return (
    <Frame>
      <Panel>
        <Head lead={<MarkAvatar />} title="Meeting summary" sub="Quarterly Review · Allison & Frank Chan · Oct 14" />
        {/* the template and its sections */}
        <div style={{ position: "absolute", left: SIDE.x, top: SIDE.y, width: SIDE.w, height: SIDE.h, borderRadius: 9, background: C.tile, padding: "12px 10px", boxSizing: "border-box" }}>
          <Label style={{ paddingLeft: 4 }}>Template</Label>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            {TEMPLATES.map((tp) => {
              const on = tp.key === template;
              return (
                <div key={tp.key} style={{ height: 24, display: "flex", alignItems: "center", gap: 8, padding: "0 8px", borderRadius: 6, background: on ? "#ffffff" : "transparent", boxShadow: on ? `0 0 0 1px ${C.green2}` : undefined }}>
                  <div style={{ width: 11, height: 11, borderRadius: 6, border: `1.5px solid ${on ? C.green2 : "#c4cad2"}`, display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>
                    {on ? <div style={{ width: 5, height: 5, borderRadius: 3, background: C.green2 }} /> : null}
                  </div>
                  <div style={{ fontSize: 11.5, color: on ? C.ink : C.sub2, fontWeight: on ? MEDIUM : 400 }}>{tp.label}</div>
                </div>
              );
            })}
          </div>
          <Label style={{ paddingLeft: 4, marginTop: 18 }}>Sections</Label>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
            {SECTIONS.map((sec, i) => (
              <div key={sec} style={{ height: 20, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px" }}>
                <div style={{ fontSize: 11.5, color: C.ink }}>{sec}</div>
                <Switch on={i < 2 ? 1 : next} />
              </div>
            ))}
          </div>
        </div>

        {/* the summary, as the template writes it */}
        <div style={{ position: "absolute", left: PREV.x, top: PREV.y, width: PREV.w, opacity: fade, translate: `0px ${(1 - fade) * 5}px` }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 9.5, color: C.muted, marginBottom: 9 }}>
            <Icon name="savvy-mark" w={11} /> Written from the meeting
          </div>
          {shown === "notes" ? <Notes /> : <Recap />}
          {next > 0 ? (
            <div style={{ marginTop: 12, opacity: next, translate: `0px ${(1 - next) * 5}px` }}>
              <Label>Next meeting</Label>
              <div style={{ fontSize: 11.5, color: C.text, marginTop: 4 }}>Tuesday, Jan 20 at 2:00 PM · Social Security timing</div>
            </div>
          ) : null}
        </div>

        {/* saved */}
        <div
          style={{
            position: "absolute",
            right: 20,
            bottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "7px 11px",
            borderRadius: 8,
            background: "#0f2a35",
            color: "#ffffff",
            fontSize: 10.5,
            opacity: saved,
            translate: `0px ${(1 - saved) * 8}px`,
            boxShadow: "0 12px 24px -12px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: 7, background: C.mint, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="check-green" w={8} />
          </div>
          Saved as your default for client reviews
        </div>
      </Panel>
      {pointer && pointer.o > 0 ? (
        <div style={{ opacity: pointer.o }}>
          <Pointer x={pointer.x} y={pointer.y} />
        </div>
      ) : null}
    </Frame>
  );
};

export const SUMMARIES_FRAMES: readonly { s: SummariesState; title: string; caption: string }[] = [
  { s: { template: "notes" }, title: "Written from the meeting", caption: "The Chans’ review, summarized as terse advisor notes: what was decided, what’s on track, who’s doing what." },
  { s: { template: "recap", pointer: { ...templateAt(1), o: 1 } }, title: "Switch the template", caption: "Pick “Client recap” and the same summary rewrites itself as a note to Allison and Frank, ready to send." },
  { s: { template: "recap", next: 1, saved: 1, pointer: { ...sectionAt(2), o: 1 } }, title: "Your sections, your default", caption: "Switch on “Next meeting” and it’s added. The setup is saved as the advisor’s default for client reviews." },
];
