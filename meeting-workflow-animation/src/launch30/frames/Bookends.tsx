import React from "react";
import { Logo, LOGO_RATIO } from "../../launch/components/Logo";
import { Bg, HEAD, HouseholdChip, lineTop } from "../components/Bits";
import { CY, DIATYPE } from "../theme";

// The 44 s cut's title metrics: Diatype 78.5px, -2% tracking, cap top at 509.
const TITLE = { size: 78.5, lh: 79.6 * 1.15, capTop: 509, tracking: "-0.02em" };

const titleWord = (left: number): React.CSSProperties => ({
  position: "absolute",
  left,
  top: lineTop(TITLE.capTop, TITLE.size, TITLE.lh),
  fontFamily: DIATYPE,
  fontSize: TITLE.size,
  lineHeight: `${TITLE.lh}px`,
  letterSpacing: TITLE.tracking,
  color: "#000000",
  whiteSpace: "nowrap",
});

// Centred single line of Diatype with its cap top at `capTop`.
const Centered: React.FC<{ readonly capTop: number; readonly size?: number; readonly tracking?: string; readonly children: React.ReactNode }> = ({
  capTop,
  size = HEAD.size,
  tracking = HEAD.tracking,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: lineTop(capTop, size, HEAD.lh),
      display: "flex",
      justifyContent: "center",
      gap: size * 0.26,
      fontFamily: DIATYPE,
      fontSize: size,
      lineHeight: `${HEAD.lh}px`,
      letterSpacing: tracking,
      color: "#000000",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

// F1 · 0:00 — title card, same layout as the 44 s cut.
export const F01Intro: React.FC = () => (
  <>
    <Bg bg="cream" />
    <div style={titleWord(375)}>Introducing</div>
    <div style={{ position: "absolute", left: 796, top: 509 }}>
      <Logo h={73.6} />
    </div>
    <div style={titleWord(1035)}>Intelligence 2.0</div>
  </>
);

// F2 · 0:02 — the meeting we follow.
export const F02Meeting: React.FC = () => (
  <>
    <Bg bg="cream" />
    <Centered capTop={455} size={TITLE.size} tracking={TITLE.tracking}>
      One client meeting, start to finish
    </Centered>
    <div style={{ position: "absolute", left: 0, right: 0, top: 568, display: "flex", justifyContent: "center" }}>
      <HouseholdChip size={28} style={{ background: "rgba(255, 255, 255, 0.8)" }} />
    </div>
  </>
);

// F13a–c · 0:24 — "Prep. Communicate. Deliver.", one word after another,
// each sliding into its place in the final line out of a blur. `step` is how
// many words are visible; the last of them is still arriving unless `settled`.
const WORDS = ["Prep.", "Communicate.", "Deliver."];
const ThreeWords: React.FC<{ readonly step: number; readonly settled?: boolean }> = ({ step, settled = false }) => (
  <>
    <Bg bg="blue" />
    <Centered capTop={CY - 0.35 * HEAD.size}>
      {WORDS.map((word, i) => {
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
    </Centered>
  </>
);
export const F13aPrep: React.FC = () => <ThreeWords step={1} settled />;
export const F13bCommunicate: React.FC = () => <ThreeWords step={2} />;
export const F13cDeliver: React.FC = () => <ThreeWords step={3} settled />;

// F14 · 0:26 — the launch tagline.
export const F14Tagline: React.FC = () => {
  const capTop = CY - (HEAD.lh + 0.7 * HEAD.size) / 2;
  return (
    <>
      <Bg bg="blue" />
      <Centered capTop={capTop}>Your whole practice,</Centered>
      <Centered capTop={capTop + HEAD.lh}>working for you</Centered>
    </>
  );
};

// F15 · 0:28 — the Savvy wordmark, as in the 44 s cut.
const LOGO_H = 93.85;
export const F15Logo: React.FC = () => (
  <>
    <Bg bg="blue" />
    <div style={{ position: "absolute", left: 960 - (LOGO_H * LOGO_RATIO) / 2, top: CY - LOGO_H / 2 }}>
      <Logo h={LOGO_H} />
    </div>
  </>
);
