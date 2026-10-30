import React from "react";
import { Logo, LOGO_RATIO } from "../../launch/components/Logo";
import { Bg, CenteredLine, HEAD, HouseholdChip, lineTop, TITLE } from "../components/Bits";
import { CY, DIATYPE } from "../theme";

// F1: the 44 s cut's title card. Cap top at 509; the wordmark sits between.
export const TITLE_CAP = 509;
export const TITLE_LOGO = { x: 796, y: 509, h: 73.6 };
export const titleWord = (left: number): React.CSSProperties => ({
  position: "absolute",
  left,
  top: lineTop(TITLE_CAP, TITLE.size, TITLE.lh),
  fontFamily: DIATYPE,
  fontSize: TITLE.size,
  lineHeight: `${TITLE.lh}px`,
  letterSpacing: TITLE.tracking,
  color: "#000000",
  whiteSpace: "nowrap",
});

// F2: the meeting line in two parts, and the household pill under it.
export const MEETING_LINE = { capTop: 455, parts: ["One client meeting,", "start to finish"] };
export const MEETING_PILL = { top: 568, size: 28, bg: "rgba(255, 255, 255, 0.8)" };

// F13: the three phase words, each landing in its place in the line.
export const PHASE_WORDS = ["Prep.", "Communicate.", "Deliver."];
export const PHASE_WORDS_CAP = CY - 0.35 * HEAD.size;
// F14: the launch tagline, two lines centred on the middle.
export const TAGLINE = ["Your whole practice,", "working for you"];
export const TAGLINE_CAP = CY - (HEAD.lh + 0.7 * HEAD.size) / 2;
// F15: the wordmark, centred.
export const END_LOGO_H = 93.85;
export const END_LOGO = { x: 960 - (END_LOGO_H * LOGO_RATIO) / 2, y: CY - END_LOGO_H / 2 };

// F1 · 0:00 — title card, same layout as the 44 s cut.
export const F01Intro: React.FC = () => (
  <>
    <Bg bg="cream" />
    <div style={titleWord(375)}>Introducing</div>
    <div style={{ position: "absolute", left: TITLE_LOGO.x, top: TITLE_LOGO.y }}>
      <Logo h={TITLE_LOGO.h} />
    </div>
    <div style={titleWord(1035)}>Intelligence 2.0</div>
  </>
);

// F2 · 0:02 — the meeting we follow.
export const F02Meeting: React.FC = () => (
  <>
    <Bg bg="cream" />
    <CenteredLine capTop={MEETING_LINE.capTop} size={TITLE.size} tracking={TITLE.tracking}>
      {MEETING_LINE.parts.map((part) => (
        <span key={part}>{part}</span>
      ))}
    </CenteredLine>
    <div style={{ position: "absolute", left: 0, right: 0, top: MEETING_PILL.top, display: "flex", justifyContent: "center" }}>
      <HouseholdChip size={MEETING_PILL.size} style={{ background: MEETING_PILL.bg }} />
    </div>
  </>
);

// F13a–c · 0:24 — "Prep. Communicate. Deliver.", one word after another,
// each sliding into its place in the final line out of a blur. `step` is how
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
              translate: arriving ? "46px 0px" : undefined,
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
export const F13bCommunicate: React.FC = () => <ThreeWords step={2} />;
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
