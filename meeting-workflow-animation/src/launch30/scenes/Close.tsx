import React from "react";
import { Logo } from "../../launch/components/Logo";
import { CenteredLine, HEAD } from "../components/Bits";
import { ramp, slideText } from "../components/Motion";
import { END_LOGO, END_LOGO_H, PHASE_WORDS, PHASE_WORDS_CAP, TAGLINE, TAGLINE_CAP } from "../frames/Bookends";
import { L, useT } from "../timeline";

// 0:24–0:30 — "Prep. Communicate. Deliver." word by word, the launch tagline
// line by line (both sliding in out of a blur), then the wordmark.
export const CloseScene: React.FC = () => {
  const t = useT();
  if (t < L.words[0]) return null;
  const logo = ramp(t, L.logoIn, L.logoIn + 0.9);
  return (
    <>
      {t < L.wordsOut + 0.4 ? (
        <CenteredLine capTop={PHASE_WORDS_CAP}>
          {PHASE_WORDS.map((word, i) => (
            <span key={word} style={slideText(t, L.words[i], L.wordsOut)}>
              {word}
            </span>
          ))}
        </CenteredLine>
      ) : null}
      {t >= L.tagline[0] && t < L.taglineOut + 0.4
        ? TAGLINE.map((line, i) => (
            <CenteredLine key={line} capTop={TAGLINE_CAP + i * HEAD.lh}>
              <span style={slideText(t, L.tagline[i], L.taglineOut)}>{line}</span>
            </CenteredLine>
          ))
        : null}
      {logo > 0 ? (
        <div
          style={{
            position: "absolute",
            left: END_LOGO.x,
            top: END_LOGO.y,
            opacity: logo,
            scale: 0.96 + 0.04 * logo,
            filter: logo < 1 ? `blur(${(1 - logo) * 8}px)` : undefined,
          }}
        >
          <Logo h={END_LOGO_H} />
        </div>
      ) : null}
    </>
  );
};
