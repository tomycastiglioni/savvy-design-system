import React from "react";
import { Easing } from "remotion";
import { Card, Headline } from "../components/Bits";
import { headlineMotion, lerp, lerpRect, ramp, Rect, rectStyle } from "../components/Motion";
import {
  CAPTURE_HEADLINE,
  LIFT,
  PRESENT,
  PRESENT_HEADLINE,
  PresentationContent,
  PhoneScreen,
  Scaled,
  ScreenPhone,
} from "../frames/Communicate";
import { RECAP, RecapContent } from "../frames/Deliver";
import { AGENDA_ITEM } from "../frames/Prep";
import { CARD_SHADOW, EASE_IN_OUT, EASE_MORPH, EASE_OUT } from "../theme";
import { L, useT } from "../timeline";

const PHONE_REST: Rect = { x: 1340, y: 190, w: 340, h: 700 };
const PHONE_START: Rect = { ...PHONE_REST, y: 1130 };
// Close-up: 1.5× around the top centre, running off the bottom of the frame.
const PHONE_CLOSE: Rect = { x: 705, y: 200, w: 510, h: 1050 };
// Where the presentation steps back to behind the phone (F08).
const BACK = { x: 820, y: 232, scale: 0.84, opacity: 0.5 };

// 0:09–0:18.75 — the plan lifts out of the prep and lands as the presentation;
// a what-if; the phone records the meeting, comes up close, and grows into
// the recap.
export const CommunicateScene: React.FC = () => {
  const t = useT();
  if (t < L.lift[0] || t >= L.toRecap[1]) return null;

  const lift = ramp(t, ...L.lift, EASE_MORPH);
  const land = ramp(t, ...L.land, EASE_MORPH);
  const plan = t < L.land[0] ? lerpRect(AGENDA_ITEM, LIFT, lift) : lerpRect(LIFT, PRESENT, land);
  const back = ramp(t, ...L.stepBack, EASE_MORPH);
  const planGone = ramp(t, L.captureOut - 0.05, L.captureOut + 0.25, EASE_IN_OUT);
  const drag = ramp(t, ...L.drag, EASE_IN_OUT);
  const hot = ramp(t, L.drag[0] - 0.1, L.drag[0] + 0.05) * (1 - ramp(t, L.drag[1] + 0.3, L.drag[1] + 0.6));

  const phoneIn = ramp(t, ...L.phoneIn, EASE_OUT);
  const close = ramp(t, ...L.closeUp, EASE_MORPH);
  const toRecap = ramp(t, ...L.toRecap, EASE_MORPH);
  const screen = toRecap > 0 ? lerpRect(PHONE_CLOSE, RECAP, toRecap) : close > 0 ? lerpRect(PHONE_REST, PHONE_CLOSE, close) : lerpRect(PHONE_START, PHONE_REST, phoneIn);
  const fade = (from: number, dur: number) => 1 - ramp(t, from, from + dur, Easing.linear);

  return (
    <>
      {planGone < 1 ? (
        <Card
          style={{
            ...rectStyle(plan),
            left: lerp(plan.x, BACK.x, back),
            top: lerp(plan.y, BACK.y, back),
            scale: lerp(1, BACK.scale, back),
            transformOrigin: "0 0",
            opacity: lerp(1, BACK.opacity, back) * (1 - planGone),
            boxShadow: t < L.land[1] ? "0 40px 90px -30px rgba(16, 24, 40, 0.35)" : undefined,
          }}
        >
          <div style={{ position: "absolute", inset: 0, opacity: ramp(t, L.lift[0] + 0.2, L.lift[0] + 0.55) }}>
            <PresentationContent m={land} chrome={ramp(t, L.chrome, L.chrome + 0.4)} drag={drag} hot={hot} />
          </div>
        </Card>
      ) : null}

      {t >= L.presentText && t < L.presentOut + 0.5 ? <Headline {...PRESENT_HEADLINE} lineStyle={headlineMotion(t, L.presentText, L.presentOut)} /> : null}
      {t >= L.captureText && t < L.captureOut + 0.5 ? <Headline {...CAPTURE_HEADLINE} lineStyle={headlineMotion(t, L.captureText, L.captureOut)} /> : null}

      {t >= L.phoneIn[0] ? (
        <ScreenPhone
          screen={screen}
          radius={lerp(50, 22, toRecap)}
          frame={fade(L.toRecap[0], 0.3)}
          chrome={fade(L.toRecap[0], 0.2)}
          screenStyle={toRecap > 0 ? { boxShadow: CARD_SHADOW } : undefined}
        >
          <Scaled w={screen.w} opacity={fade(L.toRecap[0], 0.25)}>
            <PhoneScreen
              writing={ramp(t, ...L.writing, Easing.linear)}
              timer={t < 15.6 ? "32:03" : t < 16.4 ? "32:04" : "32:05"}
              spin={Math.max(0, t - L.writing[0]) * 200}
            />
          </Scaled>
          {toRecap > 0 ? <RecapContent reveal={ramp(t, ...L.recapReveal, Easing.linear)} /> : null}
        </ScreenPhone>
      ) : null}
    </>
  );
};
