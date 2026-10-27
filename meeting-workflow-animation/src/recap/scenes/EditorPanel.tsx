import { Check, Send } from "lucide-react";
import React from "react";
import { AbsoluteFill, Easing, interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { Reveal } from "../../shared/components/Reveal";
import { useClick } from "../components/Bits";
import { C, CLAMP, EASE_MORPH, EASE_OUT, EDITOR, FONT, ROW, ROWS, SAVE_BTN, SEGMENT } from "../layout";
import { T } from "../timeline";

const Step: React.FC<{ readonly top: number; readonly n: number; readonly title: string; readonly at: number }> = ({ top, n, title, at }) => (
  <Reveal at={at} style={{ position: "absolute", left: ROW.x, top }}>
    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", color: C.faint }}>STEP {n}</div>
    <div style={{ fontSize: 15, fontWeight: 600, color: C.ink, marginTop: 4 }}>{title}</div>
  </Reveal>
);

const CheckRow: React.FC<{
  readonly top: number;
  readonly label: string;
  readonly checked: number;
  readonly chip?: string;
  readonly at: number;
  readonly hover?: number;
}> = ({ top, label, checked, chip, at, hover = 0 }) => (
  <Reveal
    at={at}
    style={{
      position: "absolute",
      left: ROW.x,
      top,
      width: ROW.w,
      height: ROW.h,
      borderRadius: 9,
      background: interpolateColors(checked, [0, 1], [interpolateColors(hover, [0, 1], [C.white, C.panel]), "#E3F3E9"]),
      border: `1px solid ${interpolateColors(checked, [0, 1], [C.statsBorder, "#CEDDD8"])}`,
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 14,
        top: (ROW.h - 2 - 18) / 2,
        width: 18,
        height: 18,
        borderRadius: 5,
        background: interpolateColors(checked, [0, 1], [C.white, C.green]),
        border: `1.5px solid ${interpolateColors(checked, [0, 1], [C.border, C.green])}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Check size={13} strokeWidth={3} color={C.white} style={{ opacity: checked, scale: 0.5 + 0.5 * checked }} />
    </div>
    <div style={{ position: "absolute", left: 44, top: 14, fontSize: 14, fontWeight: 500, color: C.ink }}>{label}</div>
    {chip ? (
      <div style={{ position: "absolute", right: 12, top: 14, fontSize: 11, fontWeight: 500, color: C.green, background: "rgba(255, 255, 255, 0.7)", borderRadius: 999, padding: "2px 8px" }}>
        {chip}
      </div>
    ) : null}
  </Reveal>
);

// "Edit client materials": choose sections, graphs and the typeface.
// `primary` swaps "Save changes" for "Draft email to client" and `serifSwitch`
// adds the click on Serif (both for the launch video).
export const EditorPanel: React.FC<{ readonly primary?: "save" | "draft"; readonly serifSwitch?: boolean }> = ({
  primary = "save",
  serifSwitch = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const graph = useClick(T.clickGraph);
  const serifBtn = useClick(T.clickSerif);
  const save = useClick(T.clickSave);
  const m = interpolate(t, [T.toEditor, T.toEditor + 0.6, T.toRecap, T.toRecap + 0.6], [0, 1, 1, 0], {
    ...CLAMP,
    easing: [EASE_MORPH, Easing.linear, EASE_MORPH],
  });
  if (m <= 0) {
    return null;
  }

  const at = (s: number) => T.toEditor + 0.3 + s;
  const graphOn = interpolate(t, [T.clickGraph, T.clickGraph + 0.15], [0, 1], CLAMP);
  const serif = serifSwitch ? interpolate(t, [T.clickSerif, T.clickSerif + 0.3], [0, 1], { ...CLAMP, easing: EASE_OUT }) : 0;
  const half = SEGMENT.w / 2;

  return (
    <AbsoluteFill style={{ opacity: interpolate(m, [0.3, 1], [0, 1], CLAMP), translate: `${(1 - m) * -40}px 0px` }}>
      <div
        style={{
          position: "absolute",
          left: EDITOR.x,
          top: EDITOR.y,
          width: EDITOR.w,
          height: EDITOR.h,
          background: C.white,
          border: `1px solid ${C.statsBorder}`,
          borderRadius: 12,
          boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
        }}
      >
        <Reveal at={at(0)} style={{ position: "absolute", left: ROW.x, top: 22 }}>
          <div style={{ fontSize: 17, fontWeight: 600, color: C.ink }}>Edit client materials</div>
          <div style={{ fontSize: 12.5, color: C.muted, marginTop: 5 }}>Allison &amp; Frank Chan · Quarterly Review recap</div>
        </Reveal>
        <div style={{ position: "absolute", left: 0, right: 0, top: 82, height: 1, background: "#EEF0F2" }} />

        <Step top={98} n={1} title="Recap sections" at={at(0.06)} />
        <CheckRow top={ROWS.summary} label="Meeting summary" chip="From recap" checked={1} at={at(0.1)} />
        <CheckRow top={ROWS.steps} label="Next steps" chip="From recap" checked={1} at={at(0.14)} />

        <Step top={284} n={2} title="Graphs" at={at(0.2)} />
        <CheckRow top={ROWS.graphRetirement} label="Retirement projection" checked={graphOn} hover={graph.hover} at={at(0.24)} />
        <CheckRow top={ROWS.graphAccounts} label="Account breakdown" checked={0} at={at(0.28)} />

        <Step top={470} n={3} title="Typeface" at={at(0.34)} />
        <Reveal
          at={at(0.38)}
          style={{ position: "absolute", left: SEGMENT.x, top: SEGMENT.y, width: SEGMENT.w, height: SEGMENT.h, borderRadius: 10, background: C.tabsBg }}
        >
          <div
            style={{
              position: "absolute",
              left: 4 + serif * half,
              top: 4,
              width: half - 8,
              height: SEGMENT.h - 8,
              borderRadius: 7,
              background: C.white,
              boxShadow: "0 1px 3px rgba(16, 24, 40, 0.12)",
              scale: 1 - 0.03 * (serifSwitch ? serifBtn.press : 0),
            }}
          />
          <div style={{ position: "absolute", left: 0, width: half, top: 0, height: SEGMENT.h, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: C.ink }}>
            Sans
          </div>
          <div
            style={{
              position: "absolute",
              left: half,
              width: half,
              top: 0,
              height: SEGMENT.h,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONT.serif,
              fontSize: 17,
              color: C.ink,
            }}
          >
            Serif
          </div>
        </Reveal>

        <Reveal
          at={at(0.44)}
          style={{
            position: "absolute",
            left: SAVE_BTN.x,
            top: SAVE_BTN.y,
            width: SAVE_BTN.w,
            height: SAVE_BTN.h,
            borderRadius: 9,
            background: C.green,
            color: C.white,
            fontSize: 14,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            scale: 1 - 0.03 * save.press,
            filter: `brightness(${1 - 0.12 * save.hover})`,
            gap: 8,
          }}
        >
          {primary === "draft" ? (
            <>
              <Send size={15} strokeWidth={2} /> Draft email to client
            </>
          ) : (
            "Save changes"
          )}
        </Reveal>
      </div>
    </AbsoluteFill>
  );
};
