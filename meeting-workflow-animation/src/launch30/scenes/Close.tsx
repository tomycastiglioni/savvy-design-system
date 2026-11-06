import React from "react";
import { Logo } from "../../launch/components/Logo";
import { CenteredLine, HEAD } from "../components/Bits";
import { lerp, ramp, slideText } from "../components/Motion";
import { END_LOGO, END_LOGO_H, PHASE_WORDS_CAP, TAGLINE, TAGLINE_CAP } from "../frames/Bookends";
import { EASE_IN_OUT } from "../theme";
import { CLOSE, useL, useT } from "../timeline";

// The close, on the voiceover: "Prep. Meet. Deliver." word by word as each is
// said, then "And so much more." rises in under it once the first line has
// moved up to make room; then the launch tagline line by line, then the wordmark. Text slides
// up out of a blur.
export const CloseScene: React.FC = () => {
  const L = useL();
  const t = useT();
  if (t < L.words[0]) return null;
  const logo = ramp(t, L.logoIn, L.logoIn + 0.9);
  // One line, centred, until the second line arrives; then the pair is. The
  // first line is up before the second rises in under it, so they never cross.
  const lift = ramp(t, L.more - 0.45, L.more + 0.1, EASE_IN_OUT);
  const firstCap = lerp(PHASE_WORDS_CAP, TAGLINE_CAP, lift);
  return (
    <>
      {t < L.wordsOut + 0.4 ? (
        <>
          <CenteredLine capTop={firstCap}>
            {CLOSE.words.map((word, i) => (
              <span key={word} style={slideText(t, L.words[i], L.wordsOut)}>
                {word}
              </span>
            ))}
          </CenteredLine>
          <CenteredLine capTop={TAGLINE_CAP + HEAD.lh}>
            <span style={slideText(t, L.more, L.wordsOut)}>{CLOSE.more}</span>
          </CenteredLine>
        </>
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
