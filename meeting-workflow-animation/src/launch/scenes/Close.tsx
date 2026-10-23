import React from "react";
import { interpolate } from "remotion";
import { Headline } from "../components/Headline";
import { Logo } from "../components/Logo";
import { CLAMP, EASE_OUT } from "../theme";
import { L, useT } from "../timeline";

const LOGO = { x: 820, y: 493, h: 93.85 }; // F25

// F24 → F25: the tagline, then the Savvy wordmark.
export const Close: React.FC = () => {
  const t = useT();
  if (t < L.closeIn) {
    return null;
  }
  const logo = interpolate(t, [L.logoIn, L.logoIn + 0.9], [0, 1], {
    ...CLAMP,
    easing: EASE_OUT,
  });
  return (
    <>
      <Headline
        lines={["Your whole practice,", "working for you"]}
        x={0}
        align="center"
        capTop={459}
        inAt={L.closeIn + 0.2}
        outAt={L.taglineOut}
      />
      {logo > 0 ? (
        <div
          style={{
            position: "absolute",
            left: LOGO.x,
            top: LOGO.y,
            opacity: logo,
            scale: 0.96 + 0.04 * logo,
            filter: logo < 1 ? `blur(${(1 - logo) * 8}px)` : undefined,
          }}
        >
          <Logo h={LOGO.h} />
        </div>
      ) : null}
    </>
  );
};
