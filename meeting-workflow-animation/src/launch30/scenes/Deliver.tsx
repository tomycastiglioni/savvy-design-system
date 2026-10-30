import React from "react";
import { Easing } from "remotion";
import { Card, Headline } from "../components/Bits";
import { headlineMotion, lerpRect, ramp, rectStyle } from "../components/Motion";
import { ClientDocContent, DELIVER_HEADLINE, DOC, EMAIL, EmailContent, RECAP, RecapContent, SENT, SentContent } from "../frames/Deliver";
import { EASE_IN_OUT, EASE_MORPH, EASE_OUT } from "../theme";
import { L, pressAt, useT } from "../timeline";

const EMAIL_START = { ...EMAIL, y: 1130 };

// 0:18–0:24 — the recap (handed over from the phone at full size), the client
// document and the email, sent.
export const DeliverScene: React.FC = () => {
  const t = useT();
  if (t < L.deliverText || t > L.deliverOut + 0.45) return null;

  const out = ramp(t, L.deliverOut, L.deliverOut + 0.35, EASE_IN_OUT);
  const exit: React.CSSProperties = out > 0 ? { opacity: 1 - out, filter: `blur(${out * 6}px)` } : {};
  const toDoc = ramp(t, ...L.toDoc, EASE_MORPH);
  const docOut = ramp(t, L.toSent[0], L.toSent[0] + 0.35, EASE_IN_OUT);
  const toSent = ramp(t, ...L.toSent, EASE_MORPH);
  const emailIn = ramp(t, ...L.emailIn, EASE_OUT);
  const fade = (from: number, dur: number) => 1 - ramp(t, from, from + dur, Easing.linear);

  return (
    <>
      <Headline {...DELIVER_HEADLINE} lineStyle={headlineMotion(t, L.deliverText, L.deliverOut)} />

      {t >= L.toRecap[1] && docOut < 1 ? (
        <Card style={{ ...rectStyle(lerpRect(RECAP, DOC, toDoc)), opacity: 1 - docOut, translate: `${-40 * docOut}px 0px`, ...exit }}>
          {toDoc < 1 ? (
            <div style={{ position: "absolute", inset: 0, opacity: fade(L.toDoc[0], 0.15) }}>
              <RecapContent reveal={ramp(t, ...L.recapReveal, Easing.linear)} />
            </div>
          ) : null}
          {toDoc > 0 ? (
            <div style={{ position: "absolute", inset: 0, opacity: ramp(t, L.toDoc[0] + 0.2, L.toDoc[0] + 0.5) }}>
              <ClientDocContent />
            </div>
          ) : null}
        </Card>
      ) : null}

      {t >= L.emailIn[0] ? (
        <Card
          style={{
            ...rectStyle(toSent > 0 ? lerpRect(EMAIL, SENT, toSent) : lerpRect(EMAIL_START, EMAIL, emailIn)),
            boxShadow: "0 40px 90px -30px rgba(16, 24, 40, 0.35)",
            ...exit,
          }}
        >
          {toSent < 1 ? (
            <div style={{ position: "absolute", inset: 0, opacity: fade(L.toSent[0], 0.15) }}>
              <EmailContent write={ramp(t, ...L.write, Easing.linear)} press={pressAt(t, L.sendClick)} />
            </div>
          ) : null}
          {toSent > 0 ? (
            <div style={{ position: "absolute", inset: 0, opacity: ramp(t, L.toSent[0] + 0.25, L.toSent[0] + 0.5) }}>
              <SentContent draw={ramp(t, ...L.sentCheck, EASE_IN_OUT)} rows={L.results.map((at) => ramp(t, at, at + 0.3))} />
            </div>
          ) : null}
        </Card>
      ) : null}
    </>
  );
};
