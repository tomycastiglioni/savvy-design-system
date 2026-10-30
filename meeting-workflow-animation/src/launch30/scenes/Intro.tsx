import React, { useMemo } from "react";
import { interpolateColors } from "remotion";
import { Logo } from "../../launch/components/Logo";
import { CenteredLine, HouseholdChip, TITLE } from "../components/Bits";
import { lerp, ramp, slideText } from "../components/Motion";
import { MEETING_LINE, MEETING_PILL, TITLE_LOGO, titleWord } from "../frames/Bookends";
import { CARD_CHIP } from "../frames/Prep";
import { EASE_IN_OUT, HOUSEHOLD, MEETING } from "../theme";
import { L, useT } from "../timeline";

// HouseholdChip's width at `size`, from its proportions and measured text.
const chipWidth = (size: number) => {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return 0;
  ctx.font = `500 ${size}px "DM Sans"`;
  const name = ctx.measureText(HOUSEHOLD).width;
  ctx.font = `400 ${size}px "DM Sans"`;
  const meeting = ctx.measureText(`· ${MEETING}`).width;
  return size * (0.35 + 1.6 + 0.5 + 0.5 + 0.8) + name + meeting;
};

const CARD_CHIP_SIZE = 17;

// 0:00–0:04.6 — the title card, then the meeting we follow. The household
// pill flies into the prep card on the right and becomes its chip.
export const Intro: React.FC = () => {
  const t = useT();
  const pillW = useMemo(() => chipWidth(MEETING_PILL.size), []);
  if (t >= L.pillFly[1]) return null;

  const titleOut = ramp(t, L.titleOut, L.titleOut + 0.35, EASE_IN_OUT);
  const word = (i: number, dir: number): React.CSSProperties => {
    const p = ramp(t, L.titleIn + i * 0.12, L.titleIn + i * 0.12 + 0.8);
    const blur = (1 - p) * 6 + titleOut * 5;
    return {
      opacity: p * (1 - titleOut),
      translate: `${dir * titleOut * 18}px ${(1 - p) * 24}px`,
      filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
    };
  };

  const pillIn = ramp(t, L.pillIn, L.pillIn + 0.5);
  const fly = ramp(t, ...L.pillFly, EASE_IN_OUT);
  const k = lerp(1, CARD_CHIP_SIZE / MEETING_PILL.size, fly);

  return (
    <>
      {titleOut < 1 ? (
        <>
          <div style={{ ...titleWord(375), ...word(0, -1) }}>Introducing</div>
          <div style={{ position: "absolute", left: TITLE_LOGO.x, top: TITLE_LOGO.y, ...word(1, 0) }}>
            <Logo h={TITLE_LOGO.h} />
          </div>
          <div style={{ ...titleWord(1035), ...word(2, 1) }}>Intelligence 2.0</div>
        </>
      ) : null}

      {t >= L.meetingIn[0] ? (
        <CenteredLine capTop={MEETING_LINE.capTop} size={TITLE.size} tracking={TITLE.tracking}>
          {MEETING_LINE.parts.map((part, i) => (
            <span key={part} style={slideText(t, L.meetingIn[i], L.meetingOut)}>
              {part}
            </span>
          ))}
        </CenteredLine>
      ) : null}

      {t >= L.pillIn ? (
        <div
          style={{
            position: "absolute",
            left: lerp(960 - pillW / 2, CARD_CHIP.x, fly),
            top: lerp(MEETING_PILL.top, CARD_CHIP.y, fly),
            scale: k,
            transformOrigin: "0 0",
            opacity: pillIn,
            translate: `0px ${(1 - pillIn) * -16}px`,
          }}
        >
          <HouseholdChip size={MEETING_PILL.size} style={{ background: interpolateColors(fly, [0, 1], [MEETING_PILL.bg, "#F1F3F5"]) }} />
        </div>
      ) : null}
    </>
  );
};
