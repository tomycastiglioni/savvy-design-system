import React from "react";
import { Easing, interpolate, Sequence, useVideoConfig } from "remotion";
import { RetirementChart } from "../../delivery/charts/RetirementChart";
import { TaxBracketChart } from "../../delivery/charts/TaxBracketChart";
import {
  AddGraphLabel,
  BuildSpinner,
  CardHeader,
  cardStyle,
  useAddGraph,
} from "../../delivery/components/GraphCard";
import {
  CARD,
  CARD_HEADER_H,
  HEADER,
  PRESENT_RECT,
  presentButtonCenter,
  slotCenter,
  SLOTS,
} from "../../delivery/layout";
import { SLIDERS, sliderLabel } from "../../delivery/whatif";
import { Reveal } from "../../shared/components/Reveal";
import { Headline } from "../components/Headline";
import { camAt, Stage } from "../components/Stage";
import {
  C,
  CLAMP,
  EASE_IN_OUT,
  EASE_MORPH,
  EASE_OUT,
  EYEBROW,
  FONT,
  TEXT_X_RIGHT,
  viaCam,
} from "../theme";
import { CAM, L, useT } from "../timeline";

// What-if controls under the presented chart (F11), in launch px.
const GRID = {
  cols: [158, 621],
  w: 387,
  titleY: 724,
  labelY: [766, 844, 922],
  trackY: [790, 869, 947],
};
const CONTROLS = [
  { slider: 0, col: 0, row: 0 }, // Annual contributions
  { slider: 1, col: 0, row: 1 }, // Expected return rate
  { slider: 2, col: 0, row: 2 }, // Retirement age
  { slider: 3, col: 1, row: 0 }, // Inflation rate
  { slider: 4, col: 1, row: 1 }, // Salary growth rate
];

// Drags (absolute seconds): $0 → $50,000, then 7% → 8.5%.
export const PLAN_DRAGS = [
  { slider: 0, start: 17.55, end: 18.35, to: 0.5 },
  { slider: 1, start: 18.65, end: 19.25, to: 0.53125 },
];

const knobP = (i: number, t: number) => {
  let p = SLIDERS[i].p0;
  for (const d of PLAN_DRAGS) {
    if (d.slider === i) {
      p = interpolate(t, [d.start, d.end], [p, d.to], {
        ...CLAMP,
        easing: EASE_IN_OUT,
      });
    }
  }
  return p;
};
const active = (i: number, t: number) =>
  Math.max(
    0,
    ...PLAN_DRAGS.filter((d) => d.slider === i).map((d) =>
      interpolate(
        t,
        [d.start - 0.08, d.start, d.end, d.end + 0.12],
        [0, 1, 1, 0],
        CLAMP,
      ),
    ),
  );
const raw = (i: number, p: number) =>
  SLIDERS[i].min + p * (SLIDERS[i].max - SLIDERS[i].min);

export const knobPoint = (slider: number, p: number) => {
  const c = CONTROLS.find((k) => k.slider === slider)!;
  return { x: GRID.cols[c.col] + p * GRID.w, y: GRID.trackY[c.row] };
};
export const ADD_POINT = viaCam(CAM.graphs, slotCenter(SLOTS.tr));
export const PRESENT_POINT = viaCam(CAM.graphs, presentButtonCenter(SLOTS.tr));

const local = (s: number) => s - L.planIn;

// Tax bracket card + the "Add graph" slot that becomes the Retirement
// projection, which is then presented. Mounted at L.planIn (local clock).
const Graphs: React.FC<{ readonly t: number }> = ({ t }) => {
  const { fps } = useVideoConfig();
  const lt = t - L.planIn;
  const sec = (s: number) => s * fps;
  const frame = lt * fps;

  const exit = interpolate(t, [L.present, L.present + 0.4], [0, 1], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const buildTax = interpolate(lt, [0.45, 1.25], [0, 1], CLAMP);

  const add = useAddGraph(local(L.addClick));
  const build = interpolate(
    frame,
    [sec(add.buildFrom), sec(add.buildFrom + 0.75)],
    [0, 1],
    { ...CLAMP, easing: EASE_IN_OUT },
  );
  const axis = interpolate(
    frame,
    [sec(add.headerAt), sec(add.headerAt + 0.3)],
    [0, 1],
    CLAMP,
  );

  const m = interpolate(t, [L.present, L.present + 0.6], [0, 1], {
    ...CLAMP,
    easing: EASE_MORPH,
  });
  const lerp = (a: number, b: number) => a + (b - a) * m;
  const x = lerp(SLOTS.tr.x, PRESENT_RECT.x);
  const y = lerp(SLOTS.tr.y, PRESENT_RECT.y);
  const w = lerp(CARD.w, PRESENT_RECT.w);
  const h = lerp(CARD.h, PRESENT_RECT.h);
  const mm = interpolate(t, [L.present, L.present + 0.6], [0, 1], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const compactHeader = interpolate(
    t,
    [L.present, L.present + 0.2],
    [1, 0],
    CLAMP,
  );
  const presentHeader = interpolate(
    t,
    [L.present + 0.35, L.present + 0.7],
    [0, 1],
    CLAMP,
  );
  const legend = interpolate(
    t,
    [L.present + 0.45, L.present + 0.75],
    [0, 1],
    CLAMP,
  );
  const endLabel = interpolate(
    t,
    [L.present + 0.6, L.present + 0.85],
    [0, 1],
    CLAMP,
  );
  const presentHover = interpolate(
    t,
    [L.presentClick - 0.3, L.presentClick - 0.18],
    [0, 1],
    CLAMP,
  );
  const presentPress = interpolate(
    t,
    [L.presentClick - 0.03, L.presentClick + 0.05, L.presentClick + 0.18],
    [0, 1, 0],
    CLAMP,
  );
  const slot = t < L.addClick;
  const params = {
    contrib: raw(0, knobP(0, t)),
    ret: raw(1, knobP(1, t)),
    infl: raw(3, knobP(3, t)),
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - exit,
          scale: 1 - 0.015 * exit,
          filter: exit > 0 ? `blur(${exit * 4}px)` : undefined,
        }}
      >
        <Reveal
          at={0.05}
          style={{ position: "absolute", left: HEADER.x, top: HEADER.y }}
        >
          <div style={{ fontSize: 22, fontWeight: 600, color: C.ink }}>
            Graphs
          </div>
          <div style={{ fontSize: 15, color: C.muted, marginTop: 6 }}>
            Visuals for the meeting. Edit assumptions live when presenting.
          </div>
        </Reveal>
        <Reveal
          at={0.2}
          y={14}
          style={cardStyle(SLOTS.tl.x, SLOTS.tl.y, CARD.w, CARD.h)}
        >
          <CardHeader
            title="Tax bracket impact"
            subtitle="Taxable income vs. federal brackets."
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: CARD_HEADER_H,
              width: CARD.w,
              height: CARD.h - CARD_HEADER_H,
            }}
          >
            <TaxBracketChart
              w={CARD.w}
              h={CARD.h - CARD_HEADER_H}
              build={buildTax}
            />
          </div>
        </Reveal>
      </div>

      <Reveal
        at={0.35}
        y={14}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: w,
          height: h,
          borderRadius: 12,
          overflow: "hidden",
          border: `1px solid ${slot ? `rgba(255, 255, 255, ${0.7 + 0.3 * add.hover})` : C.statsBorder}`,
          background: slot
            ? `rgba(255, 255, 255, ${0.18 + 0.3 * add.hover})`
            : C.white,
          scale: 1 - 0.01 * add.press,
          boxShadow: `0 1px 2px rgba(16, 24, 40, ${0.05 * mm}), 0 16px 40px -12px rgba(16, 24, 40, ${0.1 * mm})`,
        }}
      >
        <div style={{ opacity: add.label }}>
          <AddGraphLabel hover={add.hover} />
        </div>
        <BuildSpinner opacity={add.spinner} spin={add.spin} />
        <Reveal at={add.headerAt} style={{ opacity: compactHeader }}>
          <CardHeader
            title="Retirement projection"
            subtitle="Projected wealth over the plan horizon."
            hover={presentHover}
            press={presentPress}
          />
        </Reveal>
        <div
          style={{
            position: "absolute",
            left: 44,
            top: 40,
            opacity: presentHeader,
            whiteSpace: "nowrap",
          }}
        >
          <div
            style={{
              fontFamily: FONT.serif,
              fontSize: 30,
              lineHeight: 1.15,
              color: C.ink,
            }}
          >
            Retirement projection (2026 – 2048)
          </div>
          <div
            style={{
              fontSize: 15.5,
              fontStyle: "italic",
              color: C.muted,
              marginTop: 8,
            }}
          >
            Projected retirement wealth across the plan horizon.
          </div>
        </div>
        <RetirementChart
          w={w}
          h={h}
          m={mm}
          build={build}
          axis={axis}
          params={params}
          legend={legend}
          endLabel={endLabel}
        />
      </Reveal>
    </>
  );
};

// F11 what-if controls, sitting directly on the gradient.
const WhatIf: React.FC<{ readonly t: number }> = ({ t }) => {
  const enter = (i: number) =>
    interpolate(
      t,
      [L.whatIfIn + i * 0.06, L.whatIfIn + i * 0.06 + 0.55],
      [0, 1],
      { ...CLAMP, easing: EASE_OUT },
    );
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: GRID.cols[0],
          top: GRID.titleY - 10,
          fontSize: 14.5,
          lineHeight: "20px",
          fontWeight: 600,
          color: C.ink,
          opacity: enter(0),
        }}
      >
        What-if controls
      </div>
      {CONTROLS.map((c, i) => {
        const p = knobP(c.slider, t);
        const a = active(c.slider, t);
        const e = enter(i + 1);
        const x = GRID.cols[c.col];
        return (
          <div
            key={c.slider}
            style={{ opacity: e, translate: `0px ${(1 - e) * 12}px` }}
          >
            <div
              style={{
                position: "absolute",
                left: x,
                width: GRID.w,
                top: GRID.labelY[c.row] - 10,
                height: 20,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 14,
              }}
            >
              <span style={{ color: C.body, fontWeight: 500 }}>
                {SLIDERS[c.slider].label}
              </span>
              <span
                style={{
                  color: a > 0.5 ? C.green : C.ink,
                  fontWeight: 600,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {sliderLabel(c.slider, p)}
              </span>
            </div>
            <div
              style={{
                position: "absolute",
                left: x,
                top: GRID.trackY[c.row] - 1.5,
                width: GRID.w,
                height: 3,
                borderRadius: 2,
                background: "rgba(29, 35, 52, 0.12)",
              }}
            >
              <div
                style={{
                  width: p * GRID.w,
                  height: 3,
                  borderRadius: 2,
                  background: C.green,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: p * GRID.w - 8,
                  top: -6.5,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: C.green,
                  border: `2.5px solid ${C.white}`,
                  boxShadow: `0 1px 3px rgba(16, 24, 40, 0.3), 0 0 0 ${6 * a}px rgba(23, 82, 66, 0.15)`,
                  scale: 1 + 0.15 * a,
                }}
              />
            </div>
          </div>
        );
      })}
    </>
  );
};

// F8 → F11: graphs, add the projection, present it, then pull back to plan
// live with the what-if controls.
export const Planning: React.FC = () => {
  const t = useT();
  const { fps } = useVideoConfig();
  if (t < L.planIn - 0.1 || t > L.planOut + 0.6) {
    return null;
  }
  const cam = camAt(t, [
    { t: L.present, cam: CAM.graphs },
    { t: L.present + 0.6, cam: CAM.present, ease: EASE_MORPH },
    { t: L.pullBack, cam: CAM.present, ease: Easing.linear },
    { t: L.pullBack + 0.7, cam: CAM.whatIf },
  ]);
  const exit = interpolate(t, [L.planOut, L.planOut + 0.45], [0, 1], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });

  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - exit,
          scale: 1 - 0.015 * exit,
          filter: exit > 0 ? `blur(${exit * 4}px)` : undefined,
        }}
      >
        <Stage cam={cam}>
          <Sequence from={Math.round(L.planIn * fps)} layout="none">
            <Graphs t={t} />
          </Sequence>
        </Stage>
        {t >= L.whatIfIn ? <WhatIf t={t} /> : null}
      </div>
      <Headline
        eyebrow="Live planning"
        color={EYEBROW.planning}
        lines={["Thousands of", "what-ifs, one", "conversation"]}
        x={TEXT_X_RIGHT}
        inAt={L.whatIfIn}
        outAt={L.planOut}
      />
    </>
  );
};
