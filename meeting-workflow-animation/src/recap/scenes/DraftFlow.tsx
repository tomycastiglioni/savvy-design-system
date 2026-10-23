import { Bold, Check, Italic, List, ListOrdered, Paperclip, Send, Strikethrough, Underline } from "lucide-react";
import React from "react";
import { AbsoluteFill, Easing, interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { AIIcon } from "../../shared/components/AIIcon";
import { useClick } from "../components/Bits";
import { ATTACHMENT, EMAIL_BODY, EMAIL_SUBJECT, EMAIL_TO, WRITING_STYLE } from "../content";
import { C, CLAMP, DRAFT_BTN, EASE_IN_OUT, EASE_MORPH, EASE_OUT, EMAIL, LOADING_BOX, SEND_BTN } from "../layout";
import { T } from "../timeline";

const WORDS = EMAIL_BODY.map((p) => p.split(/(\s+)/));
const TOTAL = WORDS.reduce((n, p) => n + p.filter((w) => w.trim()).length, 0);

const Caret: React.FC = () => (
  <span style={{ display: "inline-block", width: 2, height: "1.15em", background: C.green, verticalAlign: "text-bottom", marginLeft: 2 }} />
);

// Streams the email body word by word, with a caret while it writes.
const Body: React.FC<{ readonly shown: number; readonly typing: boolean }> = ({ shown, typing }) => {
  let left = shown;
  let caretPlaced = false;
  return (
    <>
      {WORDS.map((parts, i) => {
        if (left <= 0 && i > 0) {
          return null;
        }
        let text = "";
        for (const part of parts) {
          if (part.trim()) {
            if (left <= 0) break;
            left--;
          } else if (left <= 0) {
            break;
          }
          text += part;
        }
        const caret = typing && !caretPlaced && left <= 0;
        caretPlaced = caretPlaced || caret;
        return (
          <div key={EMAIL_BODY[i]} style={{ marginBottom: 14, whiteSpace: "pre-line" }}>
            {text}
            {caret ? <Caret /> : null}
          </div>
        );
      })}
    </>
  );
};

// "Draft client email": the button grows into the writing-style loader, then
// into the email draft, which writes itself and is sent.
export const DraftFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const send = useClick(T.clickSend);
  if (t < T.loadStart) {
    return null;
  }

  const keys = [T.loadStart, T.loadStart + 0.55, T.loadEnd, T.loadEnd + 0.55];
  const easing = [EASE_MORPH, Easing.linear, EASE_MORPH];
  const rect = (a: number, b: number, c: number) => interpolate(t, keys, [a, b, b, c], { ...CLAMP, easing });
  const colorKeys = [T.loadStart, T.loadStart + 0.4, T.loadEnd, T.loadEnd + 0.5];

  const label = interpolate(t, [T.loadStart, T.loadStart + 0.12], [1, 0], CLAMP);
  const loader =
    interpolate(t, [T.loadStart + 0.4, T.loadStart + 0.65], [0, 1], CLAMP) * interpolate(t, [T.loadEnd, T.loadEnd + 0.15], [1, 0], CLAMP);
  const spin = interpolate(t, [T.loadStart + 0.35, T.loadEnd + 0.2], [0, 540], { ...CLAMP, easing: EASE_IN_OUT });
  const email = interpolate(t, [T.emailOpen - 0.15, T.emailOpen + 0.2], [0, 1], CLAMP);

  const shown = Math.floor(interpolate(t, [T.typeStart, T.typeEnd], [0, TOTAL], CLAMP));
  const typing = t >= T.typeStart && t < T.typeEnd + 0.1;
  const saved = interpolate(t, [T.typeEnd + 0.1, T.typeEnd + 0.35], [0, 1], CLAMP);
  const sentBtn = interpolate(t, [T.clickSend + 0.08, T.clickSend + 0.25], [0, 1], CLAMP);
  // The draft clears first, then the confirmation arrives (no overlap).
  const draftOut = interpolate(t, [T.sent, T.sent + 0.25], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const success = interpolate(t, [T.sent + 0.22, T.sent + 0.55], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const draw = interpolate(t, [T.sent + 0.4, T.sent + 0.8], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: rect(DRAFT_BTN.x, LOADING_BOX.x, EMAIL.x),
          top: rect(DRAFT_BTN.y, LOADING_BOX.y, EMAIL.y),
          width: rect(DRAFT_BTN.w, LOADING_BOX.w, EMAIL.w),
          height: rect(DRAFT_BTN.h, LOADING_BOX.h, EMAIL.h),
          borderRadius: rect(8, 18, 16),
          overflow: "hidden",
          background: interpolateColors(t, colorKeys, [C.white, "#F7F8FB", "#F7F8FB", C.white]),
          border: `1px solid ${interpolateColors(t, colorKeys, [C.border, "#EEF0F3", "#EEF0F3", C.borderSoft])}`,
          boxShadow: `0 1px 2px rgba(16, 24, 40, 0.05), 0 16px 40px -12px rgba(16, 24, 40, ${0.1 * email})`,
        }}
      >
        {/* The clicked button's label */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            translate: "-50% -50%",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 500,
            color: C.ink,
            whiteSpace: "nowrap",
            opacity: label,
          }}
        >
          <Send size={15} strokeWidth={1.9} /> Draft client email
        </div>

        {/* Analyzing your writing style */}
        <div style={{ position: "absolute", left: "50%", top: "50%", translate: "-50% -50%", width: 600, textAlign: "center", opacity: loader }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <AIIcon size={76} style={{ rotate: `${spin}deg` }} />
          </div>
          <div style={{ fontSize: 25, fontWeight: 500, color: C.ink, marginTop: 36 }}>Analyzing your writing style…</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 24 }}>
            {WRITING_STYLE.map((tag, i) => {
              const p = interpolate(t, [T.loadHold + i * 0.18, T.loadHold + i * 0.18 + 0.3], [0, 1], {
                ...CLAMP,
                easing: Easing.spring({ damping: 11 }),
              });
              return (
                <div
                  key={tag}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 999,
                    background: C.green100,
                    color: C.green,
                    fontSize: 15.5,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    opacity: Math.min(1, p * 1.4),
                    scale: 0.7 + 0.3 * p,
                  }}
                >
                  {tag}
                </div>
              );
            })}
          </div>
        </div>

        {/* Email draft, laid out at its final size */}
        <div style={{ position: "absolute", left: 0, top: 0, width: EMAIL.w - 2, height: EMAIL.h - 2, opacity: email * (1 - draftOut) }}>
          <div style={{ position: "absolute", left: 28, top: 24, fontSize: 18, fontWeight: 600, color: C.ink }}>Email draft</div>
          <div style={{ position: "absolute", left: 28, top: 68, display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: C.muted }}>
            <span style={{ width: 56 }}>To:</span>
            {EMAIL_TO.map((name) => (
              <span key={name} style={{ padding: "4px 10px", borderRadius: 7, background: C.tabsBg, color: C.ink, fontSize: 13.5 }}>
                {name}
              </span>
            ))}
          </div>
          <div style={{ position: "absolute", left: 28, right: 28, top: 106, display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: C.muted }}>
            <span style={{ width: 56 }}>Subject:</span>
            <div style={{ flex: 1, height: 38, border: `1px solid ${C.borderSoft}`, borderRadius: 8, display: "flex", alignItems: "center", padding: "0 12px", color: C.ink, fontSize: 14.5 }}>
              {EMAIL_SUBJECT}
            </div>
          </div>

          <div style={{ position: "absolute", left: 28, right: 28, top: 162, bottom: 78, border: `1px solid ${C.borderSoft}`, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ height: 42, background: C.card, borderBottom: `1px solid ${C.borderSoft}`, display: "flex", alignItems: "center", gap: 16, padding: "0 16px", color: C.faint }}>
              <Bold size={16} strokeWidth={2.2} />
              <Italic size={16} strokeWidth={2.2} />
              <Underline size={16} strokeWidth={2.2} />
              <Strikethrough size={16} strokeWidth={2.2} />
              <div style={{ width: 1, height: 18, background: C.borderSoft }} />
              <List size={16} strokeWidth={2.2} />
              <ListOrdered size={16} strokeWidth={2.2} />
            </div>
            <div style={{ padding: "18px 22px", fontSize: 15.5, lineHeight: 1.6, color: C.body }}>
              <Body shown={shown} typing={typing} />
            </div>
            <div
              style={{
                position: "absolute",
                left: 22,
                bottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 12px",
                borderRadius: 8,
                border: `1px solid ${C.borderSoft}`,
                background: C.card,
                fontSize: 13.5,
                color: C.ink,
              }}
            >
              <Paperclip size={14} strokeWidth={2} color={C.muted} /> {ATTACHMENT}
            </div>
          </div>

          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 64, borderTop: "1px solid #EEF0F2" }}>
            <div style={{ position: "absolute", left: 28, top: 23, display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: C.muted, opacity: saved }}>
              <Check size={14} strokeWidth={2.2} /> Saved
            </div>
            <div
              style={{
                position: "absolute",
                right: SEND_BTN.right,
                bottom: SEND_BTN.bottom,
                width: SEND_BTN.w,
                height: SEND_BTN.h,
                borderRadius: 9,
                background: C.green,
                color: C.white,
                fontSize: 14,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                scale: 1 - 0.04 * send.press,
                filter: `brightness(${1 - 0.12 * send.hover})`,
              }}
            >
              {sentBtn > 0.5 ? <Check size={17} strokeWidth={2.6} /> : <Send size={15} strokeWidth={2} />}
              {sentBtn > 0.5 ? "Sent" : "Send"}
            </div>
          </div>
        </div>

        {/* Sent */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: EMAIL.w - 2,
            height: EMAIL.h - 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: success,
            scale: 0.96 + 0.04 * success,
          }}
        >
          <div style={{ width: 88, height: 88, borderRadius: "50%", background: C.green50, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={44} height={44} viewBox="0 0 44 44">
              <path
                d="M11 23 L19 31 L34 14"
                fill="none"
                stroke={C.green}
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - draw}
              />
            </svg>
          </div>
          <div style={{ fontSize: 26, fontWeight: 600, color: C.ink, marginTop: 26 }}>Email sent</div>
          <div style={{ fontSize: 16, color: C.muted, marginTop: 8 }}>To Allison &amp; Frank Chan, with the Quarterly Review recap attached</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
