import React from "react";
import { Logo, LOGO_RATIO } from "../../launch/components/Logo";
import { Bg, CenteredLine, HEAD } from "../components/Bits";
import { CY } from "../theme";

// F13: the three phase words, each landing in its place in the line.
export const PHASE_WORDS = ["Prep.", "Meet.", "Deliver."];
export const PHASE_WORDS_CAP = CY - 0.35 * HEAD.size;
// F14: the launch tagline, two lines centred on the middle.
export const TAGLINE = ["Your whole practice,", "working for you."];
export const TAGLINE_CAP = CY - (HEAD.lh + 0.7 * HEAD.size) / 2;
// F15: the wordmark, centred.
export const END_LOGO_H = 93.85;
export const END_LOGO = { x: 960 - (END_LOGO_H * LOGO_RATIO) / 2, y: CY - END_LOGO_H / 2 };

// F13a–c · 0:24 — "Prep. Meet. Deliver.", one word after another,
// each sliding up into its place in the final line out of a blur. `step` is how
// many words are visible; the last of them is still arriving unless `settled`.
const ThreeWords: React.FC<{ readonly step: number; readonly settled?: boolean }> = ({ step, settled = false }) => (
  <>
    <Bg bg="blue" />
    <CenteredLine capTop={PHASE_WORDS_CAP}>
      {PHASE_WORDS.map((word, i) => {
        const arriving = i === step - 1 && !settled;
        return (
          <span
            key={word}
            style={{
              opacity: i < step ? (arriving ? 0.45 : 1) : 0,
              translate: arriving ? "0px 36px" : undefined,
              filter: arriving ? "blur(9px)" : undefined,
            }}
          >
            {word}
          </span>
        );
      })}
    </CenteredLine>
  </>
);
export const F13aPrep: React.FC = () => <ThreeWords step={1} settled />;
export const F13bMeet: React.FC = () => <ThreeWords step={2} />;
export const F13cDeliver: React.FC = () => <ThreeWords step={3} settled />;

// F14 · 0:26 — the launch tagline.
export const F14Tagline: React.FC = () => (
  <>
    <Bg bg="blue" />
    {TAGLINE.map((line, i) => (
      <CenteredLine key={line} capTop={TAGLINE_CAP + i * HEAD.lh}>
        <span>{line}</span>
      </CenteredLine>
    ))}
  </>
);

// F15 · 0:28 — the Savvy wordmark, as in the 44 s cut.
export const F15Logo: React.FC = () => (
  <>
    <Bg bg="blue" />
    <div style={{ position: "absolute", left: END_LOGO.x, top: END_LOGO.y }}>
      <Logo h={END_LOGO_H} />
    </div>
  </>
);
