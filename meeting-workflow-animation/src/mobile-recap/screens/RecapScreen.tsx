import { Check, ChevronRight, CircleCheck, Mail, Send } from "lucide-react";
import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, spring } from "remotion";
import { Card, NavBar } from "../../mobile-household/components";
import { BUTTON_BG, C, CLAMP, EASE_OUT, FONT, PAD } from "../../mobile-prep/layout";
import { AIIcon } from "../../shared/components/AIIcon";
import { RecordedPill } from "../components";
import { BUTTON, POINTS, RECAP, SENT } from "../content";
import { T } from "../timeline";

// Rise into place: fade up from `dist` pt below over `dur` seconds.
const rise = (t: number, at: number, dur = 0.45, dist = 10): React.CSSProperties => {
  const p = interpolate(t, [at, at + dur], [0, 1], { ...CLAMP, easing: EASE_OUT });
  return { opacity: p, translate: `0px ${(1 - p) * dist}px` };
};

// A spring that settles at 1, for pops. Finite past the end so stills work.
const pop = (t: number, at: number, fps: number) =>
  spring({ frame: Math.min(Math.max(0, (t - at) * fps), 600), fps, config: { damping: 12, stiffness: 210 } });

// Press curve for the button at `at`: in over 0.06 s, out over 0.14 s.
const press = (t: number, at: number) => interpolate(t, [at, at + 0.06, at + 0.2], [0, 1, 0], CLAMP);

// The recap, option A with option C's header, at time `t` (seconds). The
// recorded pill and "Review recap" rise in, the summary card follows, its
// three points check in, then the drafted email and the send button. The
// button is pressed and turns to "Sent".
export const RecapScreen: React.FC<{ readonly t: number; readonly fps: number }> = ({ t, fps }) => {
  const down = press(t, T.press);
  const sent = interpolate(t, [T.sent, T.sent + 0.18], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const sentPop = pop(t, T.sent, fps);

  return (
    <AbsoluteFill style={{ background: C.panel }}>
      <NavBar />
      <RecordedPill style={{ position: "absolute", left: PAD, top: 104, ...rise(t, T.pill) }} />
      <div style={{ position: "absolute", left: PAD, right: PAD, top: 146 }}>
        <div style={{ fontFamily: FONT.serif, fontSize: 36, lineHeight: 1.1, color: C.ink, ...rise(t, T.pill + 0.05) }}>{RECAP.title}</div>
        <div style={{ fontSize: 14, color: C.muted, marginTop: 6, ...rise(t, T.pill + 0.1) }}>{RECAP.short}</div>
      </div>

      <Card style={{ position: "absolute", left: PAD - 4, right: PAD - 4, top: 228, padding: "16px 18px 4px", ...rise(t, T.card, 0.5, 16) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: C.green }}>
          <AIIcon size={18} /> Summary
        </div>
        {POINTS.map((p, i) => (
          <div key={p} style={{ display: "flex", alignItems: "center", gap: 12, height: 54, borderTop: i ? `1px solid ${C.borderSoft}` : "none", marginTop: i ? 0 : 6 }}>
            <CircleCheck
              size={20}
              strokeWidth={2.2}
              color={C.green}
              style={{ flexShrink: 0, opacity: interpolate(t, [T.points[i], T.points[i] + 0.1], [0, 1], CLAMP), scale: 0.5 + 0.5 * pop(t, T.points[i], fps) }}
            />
            <div style={{ fontSize: 17, fontWeight: 600, color: C.ink, ...rise(t, T.points[i] + 0.03, 0.35, 6) }}>{p}</div>
          </div>
        ))}
      </Card>

      <Card style={{ position: "absolute", left: PAD - 4, right: PAD - 4, top: 462, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, ...rise(t, T.email, 0.45, 12) }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: C.green50, color: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Mail size={20} strokeWidth={2.2} />
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: C.ink }}>Follow-up email</div>
          <div style={{ fontSize: 13.5, color: C.muted, marginTop: 2 }}>Drafted in your voice</div>
        </div>
        <ChevronRight size={20} color={C.faint} style={{ marginLeft: "auto" }} />
      </Card>

      <div
        style={{
          position: "absolute",
          left: PAD,
          right: PAD,
          top: 558,
          height: 50,
          borderRadius: 25,
          background: interpolateColors(sent, [0, 1], [BUTTON_BG, C.green50]),
          filter: down > 0 ? `brightness(${1 - 0.18 * down})` : undefined,
          scale: 1 - 0.03 * down,
          ...rise(t, T.button, 0.45, 12),
        }}
      >
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: C.white, fontSize: 16, fontWeight: 600, opacity: 1 - sent }}>
          <Send size={17} strokeWidth={2.2} /> {BUTTON}
        </div>
        {sent > 0 ? (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: C.green, fontSize: 16, fontWeight: 600, opacity: sent, scale: 0.9 + 0.1 * sentPop }}>
            <Check size={18} strokeWidth={2.6} /> {SENT}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
