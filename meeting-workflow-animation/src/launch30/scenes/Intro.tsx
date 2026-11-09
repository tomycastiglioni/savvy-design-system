import React from "react";
import { Easing } from "remotion";
import { Card } from "../components/Bits";
import { lerp, lerpRect, ramp, rectStyle, slideText } from "../components/Motion";
import { ClientList, ClientRowContent, CLIENTS, LIST_SCROLL, PAGE_UP, rowRect, SELECTED, Title } from "../frames/Clients";
import { PREP_CARD, PrepCardContent } from "../frames/Prep";
import { EASE_IN_OUT, EASE_MORPH } from "../theme";
import { usePeek } from "../peek";
import { useL, useT } from "../timeline";

// 0:00–0:03.75 — "Deliver more for your clients with Savvy Intelligence"; the page
// scrolls up into the advisor's client list, which scrolls on to Allison &
// Frank Marlowe. Their row is picked and becomes the prep card.
export const Intro: React.FC = () => {
  const L = useL();
  const t = useT();
  const peek = usePeek();
  if (t >= L.cardIn) return null;

  const up = ramp(t, ...L.pageUp, EASE_IN_OUT);
  const scroll = LIST_SCROLL * ramp(t, ...L.listScroll, EASE_IN_OUT);
  const titleOut = ramp(t, L.listScroll[0], L.listScroll[0] + 0.3, Easing.linear);
  const listIn = ramp(t, ...L.listIn);
  const hover = ramp(t, L.listScroll[1] - 0.05, L.pickClick);
  const morph = ramp(t, ...L.pickMorph, EASE_MORPH);
  const othersOut = ramp(t, L.pickMorph[0] - 0.05, L.pickMorph[0] + 0.3, EASE_IN_OUT);
  // One after the other, so the two layouts never overlap mid-morph.
  const rowContent = 1 - ramp(t, L.pickMorph[0], L.pickMorph[0] + 0.15, Easing.linear);
  const prepContent = ramp(t, L.pickMorph[0] + 0.17, L.pickMorph[0] + 0.45);

  return (
    <>
      {titleOut < 1 && !peek ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - titleOut, visibility: "visible" }}>
          <Title offset={PAGE_UP * up - scroll} lineStyle={(i) => slideText(t, L.titleIn[i])} />
        </div>
      ) : null}

      {listIn > 0 && othersOut < 1 ? (
        <ClientList
          scroll={scroll}
          // The list rides up with the page, then scrolls under its header.
          offset={-PAGE_UP * (1 - up)}
          opacity={listIn * (1 - othersOut)}
          hover={hover}
          hide={morph > 0 ? SELECTED : undefined}
          style={othersOut > 0 ? { filter: `blur(${othersOut * 6}px)` } : undefined}
        />
      ) : null}

      {morph > 0 ? (
        <Card style={{ ...rectStyle(lerpRect(rowRect(SELECTED, LIST_SCROLL), PREP_CARD, morph)), borderRadius: lerp(10, 22, morph) }}>
          {rowContent > 0 ? (
            <div style={{ position: "absolute", inset: 0, opacity: rowContent }}>
              <ClientRowContent client={CLIENTS[SELECTED]} />
            </div>
          ) : null}
          {prepContent > 0 ? (
            <div style={{ position: "absolute", inset: 0, opacity: prepContent }}>
              <PrepCardContent />
            </div>
          ) : null}
        </Card>
      ) : null}
    </>
  );
};
