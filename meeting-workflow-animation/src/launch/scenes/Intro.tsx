import { Paperclip } from "lucide-react";
import React from "react";
import { interpolate, interpolateColors } from "remotion";
import { AIIcon } from "../../shared/components/AIIcon";
import { Logo } from "../components/Logo";
import { camAt, Stage } from "../components/Stage";
import {
  C,
  CLAMP,
  DIATYPE,
  EASE_IN_OUT,
  EASE_OUT,
  FONT,
  HEADLINE,
  TITLE_SIZE,
} from "../theme";
import { CAM, L, useT } from "../timeline";

// Chat space = launch px once the camera has pulled back (F3–F5).
const BOX = { x: 338, w: 1244, h: 286 };
const LOGO = { x: 56, y: 50, h: 52.4 }; // box-relative
const MIC = { x: 1115, y: 155, s: 100 };
const PROMPT = "Prep me for my meeting with Allison and Frank";
const WORDS = PROMPT.split(" ");
export const REVIEW_BTN = { x: 381, y: 322, w: 307, h: 53 }; // F5, launch px

// The stack (status/reply, bubble, box) re-centers as it grows: F3 → F4 → F5.
const boxY = (t: number) =>
  interpolate(
    t,
    [L.send, L.send + 0.5, L.reply, L.reply + 0.45],
    [397, 516, 516, 567],
    { ...CLAMP, easing: EASE_IN_OUT },
  );
export const MIC_CENTER = {
  x: BOX.x + MIC.x + MIC.s / 2,
  y: 397 + MIC.y + MIC.s / 2,
};

const rise = (t: number, at: number, dur = 0.7) =>
  interpolate(t, [at, at + dur], [0, 1], { ...CLAMP, easing: EASE_OUT });

// F1: "Introducing [Savvy] Intelligence 2.0". The wordmark stays put and
// becomes the prompt box's logo (same pixels under the close-up camera).
const Title: React.FC<{ readonly t: number }> = ({ t }) => {
  const out = interpolate(t, [L.titleOut, L.titleOut + 0.35], [0, 1], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  if (out >= 1) {
    return null;
  }
  const word = (i: number, dir: number): React.CSSProperties => {
    const p = rise(t, L.titleIn + i * 0.12, 0.8);
    return {
      position: "absolute",
      top: 509 - HEADLINE.lh / 2 + 0.395 * TITLE_SIZE,
      fontFamily: DIATYPE,
      fontSize: TITLE_SIZE,
      lineHeight: `${HEADLINE.lh}px`,
      color: HEADLINE.color,
      letterSpacing: "-0.02em",
      whiteSpace: "nowrap",
      opacity: p * (1 - out),
      translate: `${dir * out * 18}px ${(1 - p) * 24}px`,
      filter: p < 1 || out > 0 ? `blur(${(1 - p) * 6 + out * 5}px)` : undefined,
    };
  };
  const logo = rise(t, L.titleIn + 0.12, 0.8);
  return (
    <>
      <div style={{ ...word(0, -1), left: 375 }}>Introducing</div>
      {/* Hidden once the box (with its own logo) is in place */}
      {t < L.titleOut + 0.05 ? (
        <div
          style={{
            position: "absolute",
            left: 796,
            top: 509,
            opacity: logo,
            translate: `0px ${(1 - logo) * 24}px`,
            filter: logo < 1 ? `blur(${(1 - logo) * 6}px)` : undefined,
          }}
        >
          <Logo h={73.6} />
        </div>
      ) : null}
      <div style={{ ...word(2, 1), left: 1035 }}>Intelligence 2.0</div>
    </>
  );
};

// Voice input button; while dictating it turns green and its bars move.
const MicButton: React.FC<{
  readonly t: number;
  readonly active: number;
  readonly press: number;
}> = ({ t, active, press }) => {
  const bars = [0.28, 0.55, 0.9, 0.45, 0.8, 0.5, 0.28];
  return (
    <div
      style={{
        position: "absolute",
        left: MIC.x,
        top: MIC.y,
        width: MIC.s,
        height: MIC.s,
        borderRadius: 20,
        border: `2px solid ${interpolateColors(active, [0, 1], ["#A3A7AF", C.green])}`,
        background: interpolateColors(active, [0, 1], [C.white, C.green]),
        boxShadow: `0 0 0 ${active * (7 + 4 * Math.sin(t * 9))}px rgba(23, 82, 66, 0.14)`,
        scale: 1 - 0.05 * press,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
      }}
    >
      {bars.map((b, i) => {
        const wave = active * 0.45 * Math.sin(t * 14 + i * 1.7);
        return (
          <div
            key={i}
            style={{
              width: 3.2,
              height: 44 * Math.max(0.18, b + wave * b),
              borderRadius: 2,
              background: interpolateColors(active, [0, 1], [C.ink, C.white]),
            }}
          />
        );
      })}
    </div>
  );
};

export const Intro: React.FC = () => {
  const t = useT();
  if (t > L.prepMorph + 0.5) {
    return null;
  }
  const cam = camAt(t, [
    { t: L.zoom[0], cam: CAM.chatClose },
    { t: L.zoom[1], cam: CAM.chat },
  ]);
  const y = boxY(t);

  const boxIn = interpolate(t, [L.titleOut + 0.2, L.titleOut + 0.7], [0, 1], {
    ...CLAMP,
    easing: EASE_OUT,
  });
  const placeholder =
    rise(t, L.titleOut + 0.45, 0.5) *
    interpolate(t, [L.dictate[0] - 0.1, L.dictate[0]], [1, 0], CLAMP);
  const icons = interpolate(t, [L.zoom[0], L.zoom[0] + 0.5], [0, 1], CLAMP);
  const micPress = interpolate(
    t,
    [L.micClick - 0.03, L.micClick + 0.05, L.micClick + 0.18],
    [0, 1, 0],
    CLAMP,
  );
  const micActive = interpolate(
    t,
    [L.micClick, L.micClick + 0.15, L.dictate[1], L.dictate[1] + 0.25],
    [0, 1, 1, 0],
    CLAMP,
  );
  const typed = interpolate(t, [L.send, L.send + 0.12], [1, 0], CLAMP);
  const bubble = rise(t, L.send + 0.05, 0.5);
  const status =
    rise(t, L.status, 0.45) *
    interpolate(t, [L.reply, L.reply + 0.15], [1, 0], CLAMP);
  const reply = rise(t, L.reply + 0.05, 0.55);
  const exit = interpolate(t, [L.prepMorph, L.prepMorph + 0.4], [0, 1], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const hover = interpolate(
    t,
    [L.reviewClick - 0.32, L.reviewClick - 0.2],
    [0, 1],
    CLAMP,
  );
  const press = interpolate(
    t,
    [L.reviewClick - 0.03, L.reviewClick + 0.05, L.reviewClick + 0.18],
    [0, 1, 0],
    CLAMP,
  );
  const per = (L.dictate[1] - L.dictate[0]) / WORDS.length;

  return (
    <>
      <Title t={t} />
      <Stage cam={cam} w={1920} h={1080} style={{ fontFamily: FONT.sans }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 1 - exit,
            scale: 1 - 0.015 * exit,
            filter: exit > 0 ? `blur(${exit * 4}px)` : undefined,
          }}
        >
          {/* F4 status */}
          {status > 0 ? (
            <div
              style={{
                position: "absolute",
                left: 336,
                top: y - 238,
                height: 40,
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 30,
                color: "#85827D",
                opacity: status,
                translate: `0px ${(1 - status) * 12}px`,
              }}
            >
              <AIIcon
                size={40}
                style={{ rotate: `${(t - L.status) * 300}deg` }}
              />
              Checking your meeting preps…
            </div>
          ) : null}

          {/* F5 reply */}
          {reply > 0 ? (
            <div
              style={{
                position: "absolute",
                left: 336,
                top: y - 340,
                width: 562,
                height: 181,
                borderRadius: 14,
                background: "rgba(255, 255, 255, 0.92)",
                boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
                opacity: reply,
                translate: `0px ${(1 - reply) * 16}px`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 45,
                  top: 25,
                  fontSize: 31.5,
                  lineHeight: "44px",
                  color: C.body,
                  whiteSpace: "nowrap",
                }}
              >
                Already done. Your prep is ready.
              </div>
              {t < L.prepMorph ? (
                <div
                  style={{
                    position: "absolute",
                    left: REVIEW_BTN.x - 336,
                    top: REVIEW_BTN.y - 227,
                    width: REVIEW_BTN.w,
                    height: REVIEW_BTN.h,
                    borderRadius: 10,
                    border: `2px solid ${interpolateColors(hover, [0, 1], ["#D3D4D8", C.faint])}`,
                    background: interpolateColors(
                      hover,
                      [0, 1],
                      [C.white, C.panel],
                    ),
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: 21,
                    gap: 15,
                    fontSize: 22.2,
                    fontWeight: 500,
                    color: C.ink,
                    whiteSpace: "nowrap",
                    scale: 1 - 0.04 * press,
                  }}
                >
                  <AIIcon size={28} /> Review prep document
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Message bubble */}
          {bubble > 0 ? (
            <div
              style={{
                position: "absolute",
                right: 1920 - (BOX.x + BOX.w),
                top: y - 129,
                height: 90,
                padding: "0 42px 0 45px",
                borderRadius: 12,
                background: "linear-gradient(100deg, #CEC5B8, #C3B8A9)",
                display: "flex",
                alignItems: "center",
                fontSize: 31.5,
                color: C.body,
                whiteSpace: "nowrap",
                opacity: bubble,
                translate: `0px ${(1 - bubble) * 70}px`,
                scale: 0.94 + 0.06 * bubble,
                transformOrigin: "100% 100%",
              }}
            >
              {PROMPT}
            </div>
          ) : null}

          {/* Prompt box */}
          <div
            style={{
              position: "absolute",
              left: BOX.x,
              top: y,
              width: BOX.w,
              height: BOX.h,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 16,
                background: C.white,
                border: "2px solid #DADBDF",
                boxShadow: "0 1px 3px rgba(16, 24, 40, 0.05)",
                opacity: boxIn,
                scale: 0.97 + 0.03 * boxIn,
                transformOrigin: `${LOGO.x + 77}px ${LOGO.y + 26}px`,
              }}
            />
            {t >= L.titleOut ? (
              <div style={{ position: "absolute", left: LOGO.x, top: LOGO.y }}>
                <Logo h={LOGO.h} />
              </div>
            ) : null}
            <div style={{ opacity: boxIn }}>
              <div
                style={{
                  position: "absolute",
                  left: 257,
                  top: 49,
                  fontSize: 40,
                  lineHeight: "52px",
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    color: C.faint,
                    opacity: placeholder,
                    translate: `0px ${(1 - rise(t, L.titleOut + 0.45, 0.5)) * 8}px`,
                  }}
                >
                  Ask anything…
                </span>
                <span style={{ color: C.body, opacity: typed }}>
                  {WORDS.map((w, i) => {
                    const p = interpolate(
                      t,
                      [L.dictate[0] + i * per, L.dictate[0] + i * per + 0.18],
                      [0, 1],
                      CLAMP,
                    );
                    return (
                      <span
                        key={w + i}
                        style={{
                          opacity: p,
                          filter: p < 1 ? `blur(${(1 - p) * 3}px)` : undefined,
                        }}
                      >
                        {i ? " " : ""}
                        {w}
                      </span>
                    );
                  })}
                </span>
              </div>
              <div style={{ opacity: icons }}>
                <div
                  style={{
                    position: "absolute",
                    left: 56,
                    top: 183,
                    color: C.muted,
                  }}
                >
                  <Paperclip size={46} strokeWidth={1.9} />
                </div>
                <MicButton t={t} active={micActive} press={micPress} />
              </div>
            </div>
          </div>
        </div>
      </Stage>
    </>
  );
};
