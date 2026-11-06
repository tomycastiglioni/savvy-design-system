import React from "react";
import { blink, lerp, press, ramp, typeOut, useT, window, LINEAR } from "../anim";
import { Caret, GlassChip, Icon, IconName } from "../Bits";
import { C, FONT, MEDIUM } from "../theme";

// 01 · Just say what you need (534×320). The Savvy Intelligence prompt box
// (Figma): a typed question, then a dictated after-meeting recap; after each
// send, what Savvy did appears under the box.
export type SayState = {
  readonly text?: string; // in the prompt field ("" shows the placeholder)
  readonly textOpacity?: number;
  readonly caret?: boolean;
  readonly voice?: number; // 0–1: dictating (button lit, live waveform)
  readonly wave?: number; // waveform phase
  readonly sendPress?: number; // 0–1
  readonly lift?: number; // the box rises (px) to make room for results
  readonly results?: readonly { icon: IconName; label: string; show?: number }[];
};

const BOX = { w: 404, h: 195 };
const W = 534;
const H = 320;

const Waveform: React.FC<{ readonly phase: number }> = ({ phase }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 2.4, height: 16 }}>
    {Array.from({ length: 22 }, (_, i) => {
      const a = 0.35 + 0.65 * Math.abs(Math.sin(phase * 2.2 + i * 0.9) * Math.cos(phase * 1.3 + i * 0.37));
      return <div key={i} style={{ width: 2, height: 3 + 13 * a, borderRadius: 1, background: C.green2, opacity: 0.55 + 0.45 * a }} />;
    })}
  </div>
);

export const JustSay: React.FC<{ readonly s: SayState }> = ({ s }) => {
  const { text = "", textOpacity = 1, caret = false, voice = 0, wave = 0, sendPress = 0, lift = 0, results = [] } = s;
  const top = (H - BOX.h) / 2 - 0.5 - lift;
  return (
    <div style={{ position: "relative", width: W, height: H, fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          left: (W - BOX.w) / 2,
          top,
          width: BOX.w,
          height: BOX.h,
          background: "#ffffff",
          border: `0.578px solid ${C.border}`,
          borderRadius: 7.9,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", left: 24.5, top: 21.81, display: "flex", alignItems: "center", gap: 9.85 }}>
          <Icon name="savvy-mark" w={23.283} />
          <div style={{ fontWeight: MEDIUM, fontSize: 15.898, lineHeight: "21.859px", color: C.ink, whiteSpace: "nowrap" }}>Savvy Intelligence</div>
        </div>
        <div
          style={{
            position: "absolute",
            left: (BOX.w - 351) / 2 + 0.18,
            top: 66.42,
            width: 351,
            height: 106,
            background: "rgba(255, 255, 255, 0.73)",
            border: `0.537px solid ${voice > 0 ? `rgba(8, 107, 78, ${0.35 * voice})` : C.field}`,
            borderRadius: 4.477,
            padding: 10.746,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: 14, lineHeight: "18px", color: text ? C.text : C.muted, minHeight: 18 }}>
            {text ? (
              <span style={{ opacity: textOpacity }}>
                {text}
                {caret ? <Caret h={16} /> : null}
              </span>
            ) : voice > 0.01 ? null : (
              <span>Ask about a client...</span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {voice > 0.01 ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: voice }}>
                <Waveform phase={wave} />
                <span style={{ fontSize: 11, color: C.green2, fontWeight: MEDIUM }}>Listening…</span>
              </div>
            ) : (
              <Icon name="paperclip" w={13.2} />
            )}
            <div style={{ display: "flex", gap: 6 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  boxSizing: "border-box",
                  borderRadius: 3.6,
                  border: `1.2px solid ${voice > 0.5 ? C.green2 : "#d4d7de"}`,
                  background: voice > 0.5 ? "#e7f2ec" : "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="audio-lines" w={13.2} />
              </div>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 3.6,
                  background: "#060807",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  scale: 1 - 0.1 * sendPress,
                }}
              >
                <Icon name="send-white" w={13.2} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {results.length ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: top + BOX.h + 14, display: "flex", justifyContent: "center", gap: 7 }}>
          {results.map((r) => (
            <GlassChip
              key={r.label}
              icon={r.icon}
              label={r.label}
              size={11.5}
              style={{ opacity: r.show ?? 1, translate: `0px ${(1 - (r.show ?? 1)) * 8}px` }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export const SAY_FRAMES: readonly { s: SayState; title: string; caption: string }[] = [
  { s: {}, title: "Ask anything", caption: "Opens on the prompt as designed: “Ask about a client…”" },
  {
    s: { text: "What if the Chans retire at 63?", caret: true },
    title: "Typed",
    caption: "A scenario to model, typed in plain words. The send button presses.",
  },
  {
    s: { lift: 22, results: [{ icon: "chip-chart", label: "Scenario modeled · Retire at 63" }] },
    title: "Taken from there",
    caption: "The box clears and lifts; what Savvy did lands under it as a chip.",
  },
  {
    s: { voice: 1, wave: 1.7, lift: 22, text: "Quick recap from the Chans: move the rebalance to Monday, have Priya send the 529 forms", caret: true },
    title: "Dictated",
    caption: "Next, the voice button lights up: a live waveform and the words appear as they're said.",
  },
  {
    s: {
      lift: 22,
      results: [
        { icon: "chip-refresh", label: "Rebalance → Monday" },
        { icon: "chip-users", label: "529 forms → Priya" },
        { icon: "chip-mail", label: "Recap drafted" },
      ],
    },
    title: "Everything on your mind",
    caption: "One dictated recap becomes tasks for the team and a drafted recap. Loops back to the empty prompt.",
  },
];

// The loop (12 s): a typed scenario, then a dictated after-meeting recap.
const Q = "What if the Chans retire at 63?";
const R = "Quick recap from the Chans: move the rebalance to Monday, have Priya send the 529 forms";
export const SAY_SECONDS = 12;
export const JustSayLoop: React.FC = () => {
  const t = useT();
  const typing = ramp(t, 0.6, 2.4, LINEAR);
  const speaking = ramp(t, 5.55, 8.3, LINEAR);
  let text = "";
  let textOpacity = 1;
  let caret = false;
  if (t < 2.9) {
    text = typeOut(Q, typing);
    textOpacity = 1 - ramp(t, 2.72, 2.88);
    caret = t < 0.6 ? blink(t) : t < 2.4 || blink(t - 2.4);
  } else if (t >= 5.5 && t < 8.9) {
    text = typeOut(R, speaking, true);
    textOpacity = 1 - ramp(t, 8.72, 8.88);
    caret = true;
  } else if (t >= 11.6) {
    caret = blink(t - 11.6);
  }
  const chip1 = window(t, 2.95, 4.9, 0.45, 0.35);
  const chipsOut = 1 - ramp(t, 10.9, 11.3);
  const results =
    t < 5.4
      ? chip1 > 0
        ? [{ icon: "chip-chart" as IconName, label: "Scenario modeled · Retire at 63", show: chip1 }]
        : []
      : t >= 8.9
        ? [
            { icon: "chip-refresh" as IconName, label: "Rebalance → Monday", show: ramp(t, 8.9, 9.35) * chipsOut },
            { icon: "chip-users" as IconName, label: "529 forms → Priya", show: ramp(t, 9.05, 9.5) * chipsOut },
            { icon: "chip-mail" as IconName, label: "Recap drafted", show: ramp(t, 9.2, 9.65) * chipsOut },
          ]
        : [];
  return (
    <JustSay
      s={{
        text,
        textOpacity,
        caret: caret && text.length > 0,
        voice: window(t, 5.2, 8.35, 0.3, 0.2),
        wave: t * 3,
        sendPress: press(t, 2.6) + press(t, 8.6),
        lift: lerp(0, 22, ramp(t, 2.75, 3.25)) * (1 - ramp(t, 11.0, 11.6)),
        results,
      }}
    />
  );
};
