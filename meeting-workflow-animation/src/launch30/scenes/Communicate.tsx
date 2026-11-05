import React from "react";
import { Easing } from "remotion";
import { Card, Headline } from "../components/Bits";
import { headlineMotion, lerp, lerpRect, ramp, Rect, rectStyle } from "../components/Motion";
import {
  CAPTURE_BACK as BACK,
  CAPTURE_HEADLINE,
  LIFT,
  PRESENT,
  PRESENT_HEADLINE,
  PresentationContent,
  PhoneScreen,
  PROFILE,
  ProfileCardContent,
  QuestionBubble,
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

// The client's question pops in under the headline and writes itself out,
// then leaves with the headline.
const Question: React.FC<{ readonly t: number }> = ({ t }) => {
  const pop = ramp(t, L.bubble, L.bubble + 0.45, Easing.out(Easing.back(1.8)));
  const shown = ramp(t, L.bubble, L.bubble + 0.2, Easing.linear);
  const out = ramp(t, L.presentOut, L.presentOut + 0.35, EASE_IN_OUT);
  return (
    <QuestionBubble
      typed={ramp(t, ...L.typing, Easing.linear)}
      style={{ opacity: shown * (1 - out), scale: 0.85 + 0.15 * pop, transformOrigin: "0 0", translate: `0px ${(1 - shown) * 10 - out * 10}px` }}
    />
  );
};

// The client's CRM profile rises in beside the phone; its meeting notes fill
// in, "Syncing" turns to "Synced", and it leaves with the presentation.
const Profile: React.FC<{ readonly t: number; readonly gone: number }> = ({ t, gone }) => {
  const rise = ramp(t, ...L.profileIn, EASE_OUT);
  return (
    <Card
      style={{
        ...rectStyle(PROFILE),
        borderRadius: 18,
        opacity: ramp(t, L.profileIn[0], L.profileIn[0] + 0.25, Easing.linear) * (1 - gone),
        translate: `0px ${(1 - rise) * 40}px`,
        filter: gone > 0 ? `blur(${gone * 6}px)` : undefined,
      }}
    >
      <ProfileCardContent notes={ramp(t, ...L.notes, Easing.linear)} synced={ramp(t, L.synced, L.synced + 0.3, Easing.linear)} spin={(t - L.profileIn[0]) * 300} />
    </Card>
  );
};

// 0:08.5–0:18.25 — the plan lifts out of the prep and lands as the
// presentation; the client asks a what-if and it's answered live; the phone
// records the meeting, comes up close, and grows into the recap.
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
            <PresentationContent m={land} chrome={ramp(t, L.chrome, L.chrome + 0.4)} build={ramp(t, ...L.lineDraw, EASE_IN_OUT)} drag={drag} hot={hot} />
          </div>
        </Card>
      ) : null}

      {t >= L.profileIn[0] && planGone < 1 ? <Profile t={t} gone={planGone} /> : null}

      {t >= L.presentText && t < L.presentOut + 0.5 ? <Headline {...PRESENT_HEADLINE} lineStyle={headlineMotion(t, L.presentText, L.presentOut)} /> : null}
      {t >= L.bubble && t < L.presentOut + 0.4 ? <Question t={t} /> : null}
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
              timer={t < L.phoneIn[1] + 0.35 ? "32:03" : t < L.phoneIn[1] + 1.15 ? "32:04" : "32:05"}
              spin={Math.max(0, t - L.writing[0]) * 200}
            />
          </Scaled>
          {toRecap > 0 ? <RecapContent reveal={ramp(t, ...L.recapReveal, Easing.linear)} /> : null}
        </ScreenPhone>
      ) : null}
    </>
  );
};
