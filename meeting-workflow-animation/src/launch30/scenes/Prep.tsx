import React from "react";
import { Easing } from "remotion";
import { Card, Headline } from "../components/Bits";
import { headlineMotion, lerp, lerpRect, ramp, rectStyle } from "../components/Motion";
import { PREP_CARD, PREP_DOC, PREP_HEADLINE, PrepCardContent, PrepDocContent } from "../frames/Prep";
import { EASE_IN_OUT, EASE_MORPH } from "../theme";
import { L, pressAt, useT } from "../timeline";

// Where the prep document steps back to while the plan lifts out (F05).
const BACK = { dx: 300 - PREP_DOC.x, dy: 30, scale: 0.92, opacity: 0.55 };

// 0:04–0:10.4 — the prep card arrives, opens into the prep document, and
// steps back as agenda item 3 lifts out.
export const PrepScene: React.FC = () => {
  const t = useT();
  if (t < L.cardIn || t > L.land[0] + 0.45) return null;

  const cardIn = ramp(t, L.cardIn, L.cardIn + 0.45);
  const morph = ramp(t, ...L.docMorph, EASE_MORPH);
  const cardContent = ramp(t, L.cardIn + 0.25, L.cardIn + 0.65) * (1 - ramp(t, L.docMorph[0], L.docMorph[0] + 0.15, Easing.linear));
  const away = ramp(t, ...L.lift, EASE_MORPH);
  const gone = ramp(t, L.land[0], L.land[0] + 0.4, EASE_IN_OUT);

  return (
    <>
      {t < L.prepOut + 0.5 ? <Headline {...PREP_HEADLINE} lineStyle={headlineMotion(t, L.prepText, L.prepOut)} /> : null}
      <Card
        style={{
          ...rectStyle(lerpRect(PREP_CARD, PREP_DOC, morph)),
          opacity: cardIn * lerp(1, BACK.opacity, away) * (1 - gone),
          translate: `${BACK.dx * away}px ${(1 - cardIn) * 24 + BACK.dy * away}px`,
          scale: lerp(1, BACK.scale, away),
        }}
      >
        {cardContent > 0 ? (
          <div style={{ position: "absolute", inset: 0, opacity: cardContent }}>
            <PrepCardContent chip={t >= L.pillFly[1]} press={pressAt(t, L.reviewClick)} />
          </div>
        ) : null}
        {morph > 0 ? <PrepDocContent reveal={ramp(t, ...L.docReveal, Easing.linear)} highlight={ramp(t, L.highlight, L.highlight + 0.25)} /> : null}
      </Card>
    </>
  );
};
