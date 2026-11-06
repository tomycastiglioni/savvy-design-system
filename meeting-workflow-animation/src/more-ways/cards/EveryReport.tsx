import React from "react";
import { FirmLogo } from "../../recap/components/FirmLogo";
import { Caret, Icon, Pointer } from "../Bits";
import { C, DM, FONT, MEDIUM } from "../theme";

// 03 · Every report sounds like you wrote it (700×324). The prompt pill
// (Figma) asks for the Chans' Q4 advisor note; the pill moves up and the
// report rises in under it, branded, the note writing itself in the advisor's
// voice; it's scheduled and published to the client portal, and the pill
// becomes the confirmation.
export type ReportState = {
  readonly typed?: number; // 0–1 of the prompt
  readonly sent?: number; // 0–1: pill up, report in
  readonly note?: number; // 0–1 of the note written
  readonly voice?: boolean; // "In your voice" detail
  readonly hover?: boolean; // cursor on Publish
  readonly published?: boolean;
};

const W = 700;
const H = 324;
const PROMPT = "Write the advisor note for the Chans’ Q4 report.";
const NOTE =
  "Allison, Frank — a steady quarter for you both. We brought the portfolio back to its 70/30 target and fully funded Ellie’s 529. Nothing needs your attention before we meet.";
const DOC = { w: 560, top: 108 };

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

export const EveryReport: React.FC<{ readonly s: ReportState }> = ({ s }) => {
  const { typed = 1, sent = 0, note = 0, voice = false, hover = false, published = false } = s;
  const text = PROMPT.slice(0, Math.round(typed * PROMPT.length));
  const pillScale = lerp(1, 0.78, sent);
  const pillTop = lerp(H / 2, 46, sent);
  const written = NOTE.slice(0, Math.round(note * NOTE.length));
  return (
    <div style={{ position: "relative", width: W, height: H, overflow: "hidden", fontFamily: FONT }}>
      {/* the report */}
      {sent > 0 ? (
        <div
          style={{
            position: "absolute",
            left: (W - DOC.w) / 2,
            top: lerp(H + 20, DOC.top, sent),
            width: DOC.w,
            height: 300,
            background: "#ffffff",
            borderRadius: 10,
            border: `0.7px solid ${C.border}`,
            boxShadow: "0 18px 40px -18px rgba(0,0,0,0.35)",
            padding: "20px 24px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ scale: 0.8, transformOrigin: "0 50%" }}>
              <FirmLogo />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontFamily: DM, fontSize: 10.5, color: C.sub2, padding: "6px 10px", borderRadius: 6, border: `0.8px solid ${C.border}` }}>Every quarter</div>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  height: 28,
                  padding: "0 12px",
                  borderRadius: 6,
                  fontWeight: MEDIUM,
                  fontSize: 11,
                  background: published ? C.greenBg : C.green,
                  color: published ? C.greenInk : "#ffffff",
                }}
              >
                {published ? <Icon name="check-dark" w={10} /> : null}
                {published ? "Published" : "Publish to portal"}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <div style={{ fontWeight: MEDIUM, fontSize: 15, color: C.ink }}>Q4 Report · Allison &amp; Frank Chan</div>
          </div>
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontFamily: DM, fontWeight: 600, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: C.sub2 }}>Advisor note</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 8px 3px 5px", borderRadius: 10, background: C.greenBg, color: C.greenInk, fontSize: 10, fontWeight: MEDIUM, opacity: voice ? 1 : 0.0 }}>
              <Icon name="savvy-mark" w={11} />
              In your voice
            </div>
            {voice ? <div style={{ fontFamily: DM, fontSize: 10, color: C.muted }}>Learned from 212 of your sent emails</div> : null}
          </div>
          <div style={{ marginTop: 8, fontFamily: DM, fontSize: 12.5, lineHeight: 1.55, color: C.text, minHeight: 58 }}>
            {written}
            {note > 0 && note < 1 ? <Caret h={13} /> : null}
          </div>
          {hover ? <Pointer x={486} y={38} /> : null}
        </div>
      ) : null}
      {/* the prompt pill; once published it carries the confirmation */}
      <div
        style={{
          position: "absolute",
          left: W / 2,
          top: pillTop,
          translate: "-50% -50%",
          scale: pillScale,
          height: 81.711,
          boxSizing: "border-box",
          padding: 8.677,
          borderRadius: 57.849,
          background: "rgba(252, 252, 250, 0.2)",
          boxShadow: "0 6.508px 13.739px rgba(37, 58, 47, 0.12)",
        }}
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            gap: 20.247,
            padding: "0 7.231px 0 20.247px",
            borderRadius: 57.849,
            background: "#ffffff",
            whiteSpace: "nowrap",
          }}
        >
          <Icon name="savvy-mark-lg" w={26.7} h={27.256} />
          <div style={{ fontSize: 17.658, lineHeight: 1.25, color: "#000000", minWidth: published ? 0 : 366 }}>
            {published ? "Published to the Chans’ client portal" : text}
            {!published && typed < 1 ? <Caret h={20} color="#000000" /> : null}
          </div>
          <div style={{ width: 49.894, height: 49.894, borderRadius: "50%", background: C.green2, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {published ? <Icon name="check-small" w={18} style={{ filter: "brightness(0) invert(1)" }} /> : <Icon name="send-pill" w={21.137} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export const REPORT_FRAMES: readonly { s: ReportState; title: string; caption: string }[] = [
  { s: { typed: 0.62 }, title: "Ask for it", caption: "The prompt from the design types itself: “Write the advisor note for the Chans’ Q4 report.”" },
  { s: { typed: 1, sent: 1, note: 0.45 }, title: "Drafted", caption: "Sent: the pill moves up and the Chans’ Q4 report rises in, in the firm’s brand; the note writes itself." },
  { s: { typed: 1, sent: 1, note: 1, voice: true }, title: "In your voice", caption: "“In your voice”, learned from the advisor’s sent emails. It reads like them, not like a template." },
  { s: { typed: 1, sent: 1, note: 1, voice: true, hover: true }, title: "On schedule", caption: "Set to go out every quarter; the cursor clicks “Publish to portal”." },
  { s: { typed: 1, sent: 1, note: 1, voice: true, published: true }, title: "Published", caption: "The button reads “Published” and the pill becomes the confirmation: “Published to the Chans’ client portal”." },
];
