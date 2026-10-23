import React from "react";
import {
  Easing,
  interpolate,
  interpolateColors,
  Sequence,
  useVideoConfig,
} from "remotion";
import { DocTabs } from "../../meeting-prep/scenes/DocTabs";
import { HouseholdContext } from "../../meeting-prep/scenes/HouseholdContext";
import { AIIcon } from "../../shared/components/AIIcon";
import { Headline } from "../components/Headline";
import { Stage } from "../components/Stage";
import {
  C,
  CLAMP,
  EASE_IN_OUT,
  EASE_MORPH,
  EYEBROW,
  rectViaCam,
  TEXT_X,
} from "../theme";
import { CAM, L, useT } from "../timeline";
import { REVIEW_BTN } from "./Intro";

// 01 · Meeting prep's document panel, seen through the F7 camera.
const DOC_W = 1010;
const DOC = rectViaCam(CAM.prep, { x: 145, y: 150, w: DOC_W, h: 690 });
const LOADING = { x: 972, y: 274, w: 684, h: 532 }; // F6

// F5 → F6 → F7: the "Review prep document" button grows into the loading
// card, which opens into the prep document (household context).
export const Prep: React.FC = () => {
  const t = useT();
  const { fps } = useVideoConfig();
  if (t < L.prepMorph || t > L.prepOut + 0.6) {
    return null;
  }

  const keys = [
    L.prepMorph,
    L.prepMorph + 0.6,
    L.prepExpand,
    L.prepExpand + 0.6,
  ];
  const easing = [EASE_MORPH, Easing.linear, EASE_MORPH];
  const rect = (a: number, b: number, c: number) =>
    interpolate(t, keys, [a, b, b, c], { ...CLAMP, easing });
  const box = {
    x: rect(REVIEW_BTN.x, LOADING.x, DOC.x),
    y: rect(REVIEW_BTN.y, LOADING.y, DOC.y),
    w: rect(REVIEW_BTN.w, LOADING.w, DOC.w),
    h: rect(REVIEW_BTN.h, LOADING.h, DOC.h),
  };

  const label = interpolate(
    t,
    [L.prepMorph, L.prepMorph + 0.12],
    [1, 0],
    CLAMP,
  );
  const loading =
    interpolate(t, [L.prepMorph + 0.4, L.prepMorph + 0.65], [0, 1], CLAMP) *
    interpolate(t, [L.prepExpand, L.prepExpand + 0.15], [1, 0], CLAMP);
  const spin = interpolate(
    t,
    [L.prepMorph + 0.35, L.prepExpand + 0.2],
    [0, 360],
    { ...CLAMP, easing: EASE_IN_OUT },
  );
  const shimmer = interpolate(
    t,
    [L.prepMorph + 0.55, L.prepExpand],
    [130, -30],
    CLAMP,
  );
  const panel = interpolate(t, [L.prepExpand, L.prepExpand + 0.6], [0, 1], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const exit = interpolate(t, [L.prepOut, L.prepOut + 0.45], [0, 1], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const contentAt = L.prepExpand + 0.3;

  return (
    <>
      <Headline
        eyebrow="Meeting prep"
        color={EYEBROW.prep}
        lines={["Prepared", "before you ask"]}
        x={TEXT_X}
        inAt={L.prepText}
        outAt={L.prepOut}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - exit,
          scale: 1 - 0.015 * exit,
          filter: exit > 0 ? `blur(${exit * 4}px)` : undefined,
        }}
      >
        <Stage cam={CAM.prepTabs}>
          <Sequence from={Math.round(L.prepTabs * fps)} layout="none">
            <DocTabs />
          </Sequence>
        </Stage>

        <div
          style={{
            position: "absolute",
            left: box.x,
            top: box.y,
            width: box.w,
            height: box.h,
            borderRadius: rect(10, 16, 14.6),
            overflow: "hidden",
            background: C.white,
            border: `${rect(2, 2, 1)}px solid ${interpolateColors(panel, [0, 1], ["#D3D4D8", C.borderSoft])}`,
            boxShadow: `0 1px 2px rgba(16, 24, 40, 0.05), 0 16px 40px -12px rgba(16, 24, 40, ${0.1 * panel})`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 21,
              top: "50%",
              translate: "0px -50%",
              display: "flex",
              alignItems: "center",
              gap: 15,
              fontSize: 22.2,
              fontWeight: 500,
              color: C.ink,
              whiteSpace: "nowrap",
              opacity: label,
            }}
          >
            <AIIcon size={28} /> Review prep document
          </div>

          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              translate: "-50% -50%",
              width: 640,
              textAlign: "center",
              opacity: loading,
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <AIIcon size={106} style={{ rotate: `${spin}deg` }} />
            </div>
            <div
              style={{
                fontSize: 44,
                fontWeight: 500,
                color: "#141414",
                marginTop: 46,
                lineHeight: "56px",
              }}
            >
              Loading household
            </div>
            <div
              style={{
                fontSize: 28,
                lineHeight: "36px",
                marginTop: 16,
                color: "transparent",
                backgroundImage: `linear-gradient(100deg, #8A8784 0%, #8A8784 40%, #D4D1CC 50%, #8A8784 60%, #8A8784 100%)`,
                backgroundSize: "250% 100%",
                backgroundPosition: `${shimmer}% 0`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
              }}
            >
              Loading household data…
            </div>
          </div>

          {/* The prep document, laid out at 01's size and scaled to the box */}
          {t >= contentAt ? (
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: DOC_W,
                height: 690,
                scale: box.w / DOC_W,
                transformOrigin: "0px 0px",
                translate: "-10px -10px",
              }}
            >
              <Sequence from={Math.round(contentAt * fps)} layout="none">
                <HouseholdContext />
              </Sequence>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};
