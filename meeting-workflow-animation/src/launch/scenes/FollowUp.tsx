import { Send } from "lucide-react";
import React from "react";
import { Easing, interpolate, interpolateColors } from "remotion";
import { SEND_BTN } from "../../recap/layout";
import {
  EMAIL_WORD_COUNT,
  EmailDraft,
  EmailSent,
  WritingStyleLoader,
} from "../../recap/scenes/DraftFlow";
import { Headline } from "../components/Headline";
import {
  C,
  CLAMP,
  EASE_IN_OUT,
  EASE_MORPH,
  EASE_OUT,
  EYEBROW,
  Rect,
  TEXT_X,
} from "../theme";
import { CAM, L, useT } from "../timeline";
import { DRAFT_BTN_RECT } from "./Materials";

// Box rects in launch px, from the keyframes.
const LOADER_C: Rect = { x: 514, y: 302, w: 892, h: 476 }; // F20
const LOADER_R: Rect = { x: 868, y: 302, w: 892, h: 476 }; // F21
const EMAIL: Rect = { x: 887, y: 111, w: 845, h: 858 }; // F22
const SENT: Rect = { x: 483, y: 291, w: 954, h: 498 }; // F23
// Content scale over 04 · Recap's layout at each step.
const S = { button: CAM.editor.k, loader: 1.24, email: 1.24, sent: 1.3 };
const EMAIL_LAYOUT = { w: EMAIL.w / S.email - 2, h: EMAIL.h / S.email - 2 };

export const SEND_POINT = {
  x: EMAIL.x + EMAIL.w - (SEND_BTN.right + SEND_BTN.w / 2 + 1) * S.email,
  y: EMAIL.y + EMAIL.h - (SEND_BTN.bottom + SEND_BTN.h / 2 + 1) * S.email,
};

// F19 → F23: "Draft email to client" grows into the writing-style loader,
// which moves aside for the headline, opens into the email draft (it writes
// itself), and after Send becomes the "Email sent" card.
export const FollowUp: React.FC = () => {
  const t = useT();
  if (t < L.loaderMorph || t > L.closeIn + 0.5) {
    return null;
  }

  const keys = [
    L.loaderMorph,
    L.loaderMorph + 0.6,
    L.loaderSlide,
    L.loaderSlide + 0.6,
    L.emailMorph,
    L.emailMorph + 0.6,
    L.sent,
    L.sent + 0.6,
  ];
  const easing = [
    EASE_MORPH,
    Easing.linear,
    EASE_IN_OUT,
    Easing.linear,
    EASE_MORPH,
    Easing.linear,
    EASE_MORPH,
  ];
  const steps = [
    DRAFT_BTN_RECT,
    LOADER_C,
    LOADER_C,
    LOADER_R,
    LOADER_R,
    EMAIL,
    EMAIL,
    SENT,
  ];
  const at = (f: (r: Rect) => number) =>
    interpolate(t, keys, steps.map(f), { ...CLAMP, easing });
  const box = {
    x: at((r) => r.x),
    y: at((r) => r.y),
    w: at((r) => r.w),
    h: at((r) => r.h),
  };
  const s = interpolate(
    t,
    keys,
    [
      S.button,
      S.loader,
      S.loader,
      S.loader,
      S.loader,
      S.email,
      S.email,
      S.sent,
    ],
    { ...CLAMP, easing },
  );
  const radius = interpolate(t, keys, [9, 18, 18, 18, 18, 16, 16, 18], {
    ...CLAMP,
    easing,
  });

  const button = interpolate(
    t,
    [L.loaderMorph, L.loaderMorph + 0.3],
    [1, 0],
    CLAMP,
  );
  const label = interpolate(
    t,
    [L.loaderMorph, L.loaderMorph + 0.12],
    [1, 0],
    CLAMP,
  );
  const loader =
    interpolate(t, [L.loaderMorph + 0.4, L.loaderMorph + 0.65], [0, 1], CLAMP) *
    interpolate(t, [L.emailMorph, L.emailMorph + 0.15], [1, 0], CLAMP);
  const spin = interpolate(
    t,
    [L.loaderMorph + 0.35, L.emailMorph + 0.2],
    [0, 540],
    { ...CLAMP, easing: EASE_IN_OUT },
  );
  const email = interpolate(
    t,
    [L.emailOpen - 0.15, L.emailOpen + 0.2],
    [0, 1],
    CLAMP,
  );
  const shown = Math.floor(
    interpolate(t, [...L.type], [0, EMAIL_WORD_COUNT], CLAMP),
  );
  const typing = t >= L.type[0] && t < L.type[1] + 0.1;
  const saved = interpolate(
    t,
    [L.type[1] + 0.1, L.type[1] + 0.35],
    [0, 1],
    CLAMP,
  );
  const send = {
    hover: interpolate(
      t,
      [L.sendClick - 0.32, L.sendClick - 0.2],
      [0, 1],
      CLAMP,
    ),
    press: interpolate(
      t,
      [L.sendClick - 0.03, L.sendClick + 0.05, L.sendClick + 0.18],
      [0, 1, 0],
      CLAMP,
    ),
  };
  const sentBtn = t >= L.sendClick + 0.16;
  const draftOut = interpolate(t, [L.sent, L.sent + 0.25], [0, 1], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const success = interpolate(t, [L.sent + 0.25, L.sent + 0.6], [0, 1], {
    ...CLAMP,
    easing: EASE_OUT,
  });
  const draw = interpolate(t, [L.sent + 0.45, L.sent + 0.85], [0, 1], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const exit = interpolate(t, [L.closeIn, L.closeIn + 0.4], [0, 1], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const inner = { w: box.w / s, h: box.h / s };

  return (
    <>
      <Headline
        eyebrow="Follow-up"
        color={EYEBROW.followUp}
        lines={["The follow-up", "doesn’t wait"]}
        x={TEXT_X}
        inAt={L.followText}
        outAt={L.sent}
      />
      <div
        style={{
          position: "absolute",
          left: box.x,
          top: box.y,
          width: box.w,
          height: box.h,
          borderRadius: radius,
          overflow: "hidden",
          background: interpolateColors(button, [0, 1], [C.white, C.green]),
          border: `1px solid ${interpolateColors(button, [0, 1], ["#DCDFE3", C.green])}`,
          boxShadow: `0 1px 2px rgba(16, 24, 40, 0.05), 0 16px 40px -12px rgba(16, 24, 40, ${0.1 * (1 - button)})`,
          opacity: 1 - exit,
          scale: 1 - 0.02 * exit,
          filter: exit > 0 ? `blur(${exit * 4}px)` : undefined,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: inner.w,
            height: inner.h,
            scale: s,
            transformOrigin: "0px 0px",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              translate: "-50% -50%",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 14,
              fontWeight: 600,
              color: C.white,
              whiteSpace: "nowrap",
              opacity: label,
            }}
          >
            <Send size={15} strokeWidth={2} /> Draft email to client
          </div>
          <WritingStyleLoader
            t={t}
            holdAt={L.loadHold}
            spin={spin}
            style={{ opacity: loader }}
          />
          <EmailDraft
            w={EMAIL_LAYOUT.w}
            h={EMAIL_LAYOUT.h}
            shown={shown}
            typing={typing}
            saved={saved}
            sent={sentBtn}
            send={send}
            style={{ opacity: email * (1 - draftOut) }}
          />
          <EmailSent
            w={inner.w - 2}
            h={inner.h - 2}
            draw={draw}
            titleSize={26}
            subSize={16}
            style={{ opacity: success, scale: 0.96 + 0.04 * success }}
          />
        </div>
      </div>
    </>
  );
};
