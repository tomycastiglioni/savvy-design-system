import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { RetirementChart } from "../../delivery/charts/RetirementChart";
import { AddGraphLabel, BuildSpinner, CardHeader, useAddGraph } from "../../delivery/components/GraphCard";
import { C, CHART, CLAMP, EASE_IN_OUT, EASE_MORPH, EASE_OUT, FONT, PRESENT_BTN } from "../../delivery/layout";
import { T } from "../../delivery/timeline";
import { Params, SLIDERS, sliderLabel } from "../../delivery/whatif";
import { CursorKey, CursorLayer } from "../../shared/components/CursorLayer";
import { Reveal } from "../../shared/components/Reveal";
import { graphicTop, INNER_W, MARGIN_X } from "../layout";

// Ad 02 · Meet. One card at 1.25× between the side margins: an almost
// transparent "Add graph" slot (no other graph, no "Graphs" label) turns solid
// as it builds the Retirement projection, goes into presentation mode (a
// "Presenting" pill with a blinking dot), then grows down to show two what-if
// controls under the chart, which the cursor drags: contributions up, the
// retirement age down to 63 (the ad's question), contributions up again.

const TOP = graphicTop("meet");
const K = 1.25;
const W = INNER_W / K;
const INSET = 24; // padding between the card edge and the header / chart
const CHART_H = { compact: 400, split: 410 };
const SLIDERS_H = 112;
const PAD = 44 + INSET;
const COL_GAP = 56;
const COL_W = (W - 2 * PAD - COL_GAP) / 2;
const ROW = { top: 30, track: 36 };
// The two controls shown: Annual contributions and Retirement age.
const SHOWN = [0, 2];

// The ad's drags (seconds, absolute): $0 → $50,000, 67 → 63, $50,000 → $75,000.
const DRAGS = [
  { slider: 0, start: 7.0, end: 7.8, to: 0.5 },
  { slider: 2, start: 8.4, end: 9.1, to: (63 - 50) / 40 },
  { slider: 0, start: 9.9, end: 10.6, to: 0.75 },
];
const sliderP = (i: number, t: number) =>
  DRAGS.filter((d) => d.slider === i).reduce((p, d) => interpolate(t, [d.start, d.end], [p, d.to], { ...CLAMP, easing: EASE_IN_OUT }), SLIDERS[i].p0);
const sliderActive = (i: number, t: number) =>
  Math.max(0, ...DRAGS.filter((d) => d.slider === i).map((d) => interpolate(t, [d.start - 0.08, d.start, d.end, d.end + 0.12], [0, 1, 1, 0], CLAMP)));
const raw = (i: number, p: number) => SLIDERS[i].min + p * (SLIDERS[i].max - SLIDERS[i].min);
// Retiring earlier means fewer years of saving and growth: each year before
// 67 takes 0.3 pt off the return and 8% off the contributions (illustrative).
const paramsAt = (t: number): Params => {
  const early = 67 - raw(2, sliderP(2, t));
  return {
    contrib: raw(0, sliderP(0, t)) * (1 - 0.08 * early),
    ret: raw(1, SLIDERS[1].p0) - 0.3 * early,
    infl: raw(3, SLIDERS[3].p0),
  };
};

const knob = (slider: number, p: number) => ({
  x: PAD + SHOWN.indexOf(slider) * (COL_W + COL_GAP) + p * COL_W,
  y: CHART_H.split + ROW.top + ROW.track + 2,
});

const Controls: React.FC<{ readonly t: number; readonly top: number }> = ({ t, top }) => (
  <div style={{ position: "absolute", left: 0, top, width: W, height: SLIDERS_H }}>
    <div style={{ position: "absolute", left: PAD, right: PAD, top: 0, height: 1, background: "#EEF0F2" }} />
    {SHOWN.map((s, i) => {
      const p = sliderP(s, t);
      const active = sliderActive(s, t);
      return (
        <Reveal key={SLIDERS[s].label} at={T.panelStart + 0.1 + i * 0.08} style={{ position: "absolute", left: PAD + i * (COL_W + COL_GAP), top: ROW.top, width: COL_W }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15 }}>
            <span style={{ color: C.body, fontWeight: 500 }}>{SLIDERS[s].label}</span>
            <span style={{ color: active > 0.5 ? C.green : C.ink, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{sliderLabel(s, p)}</span>
          </div>
          <div style={{ position: "absolute", left: 0, top: ROW.track, width: COL_W, height: 4, borderRadius: 2, background: CHART.track }}>
            <div style={{ width: p * COL_W, height: 4, borderRadius: 2, background: C.green }} />
            <div
              style={{
                position: "absolute",
                left: p * COL_W - 9,
                top: -7,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: C.green,
                border: `3px solid ${C.white}`,
                boxShadow: `0 1px 3px rgba(16, 24, 40, 0.3), 0 0 0 ${6 * active}px rgba(23, 82, 66, 0.15)`,
                scale: 1 + 0.15 * active,
              }}
            />
          </div>
        </Reveal>
      );
    })}
  </div>
);

// "Presenting" pill, top right, its dot blinking like a recording light.
const LivePill: React.FC<{ readonly t: number; readonly opacity: number }> = ({ t, opacity }) => {
  const blink = 0.25 + 0.75 * (0.5 + 0.5 * Math.cos(2 * Math.PI * (t - T.presentEnd) * 1.1));
  return (
    <div
      style={{
        position: "absolute",
        right: 28,
        top: 34,
        display: "flex",
        alignItems: "center",
        gap: 8,
        height: 32,
        padding: "0 14px 0 12px",
        borderRadius: 16,
        background: "#FDECEC",
        color: "#AD3A35",
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        opacity,
      }}
    >
      <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#D64545", opacity: blink, boxShadow: `0 0 0 ${3 * blink}px rgba(214, 69, 69, 0.18)` }} />
      Presenting
    </div>
  );
};

const INNER = { x: INSET, y: INSET / 2, w: W - 2 * INSET };
const ADD = { x: W / 2, y: CHART_H.compact / 2 };
const PRESENT = { x: INNER.x + INNER.w - 14 - (15 + 12) * 2 - PRESENT_BTN.w / 2, y: INNER.y + PRESENT_BTN.top + PRESENT_BTN.h / 2 + 2 };
const REST = { x: ADD.x + 70, y: CHART_H.compact + 60 };
const dragKeys = (): CursorKey[] =>
  DRAGS.flatMap((d, i) => {
    const from = knob(d.slider, i === 2 ? DRAGS[0].to : SLIDERS[d.slider].p0);
    const to = knob(d.slider, d.to);
    return [
      { t: d.start - 0.1, ...from },
      { t: d.start, ...from, ease: "linear" },
      { t: d.end, ...to },
      { t: d.end + 0.1, ...to, ease: "linear" },
    ] satisfies CursorKey[];
  });

const AdMeetCursor: React.FC = () => (
  <CursorLayer
    path={[
      { t: 1.2, x: W - 40, y: CHART_H.compact + 120 },
      { t: 1.85, ...ADD },
      { t: 2.05, ...ADD, ease: "linear" },
      { t: 2.7, ...REST },
      { t: 3.55, ...REST, ease: "linear" },
      { t: 4.25, ...PRESENT },
      { t: 4.6, ...PRESENT, ease: "linear" },
      { t: 6.25, x: W - 60, y: CHART_H.split + SLIDERS_H + 40, ease: "linear" },
      ...dragKeys(),
      { t: 11.2, x: W - 120, y: CHART_H.split + SLIDERS_H + 30 },
    ]}
    opacity={[
      [1.2, 0],
      [1.35, 1],
      [4.55, 1],
      [4.75, 0],
      [6.25, 0],
      [6.4, 1],
    ]}
    clicks={[
      { at: T.clickAdd, ...ADD },
      { at: T.clickPresent, ...PRESENT },
    ]}
    hand={[
      [1.65, 2.1],
      [4.05, 4.75],
      [6.7, 10.75],
    ]}
    holds={DRAGS.map((d) => [d.start - 0.05, d.end + 0.05] as const)}
  />
);

export const AdMeet: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const sec = (s: number) => s * fps;

  const add = useAddGraph(T.clickAdd);
  const build = interpolate(frame, [sec(add.buildFrom), sec(add.buildFrom + 0.75)], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const axis = interpolate(frame, [sec(add.headerAt), sec(add.headerAt + 0.3)], [0, 1], CLAMP);
  const m = interpolate(frame, [sec(T.presentStart), sec(T.presentEnd)], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const split = interpolate(frame, [sec(T.splitStart), sec(T.splitEnd)], [0, 1], { ...CLAMP, easing: EASE_MORPH });
  const compactHeader = interpolate(frame, [sec(T.presentStart), sec(T.presentStart + 0.2)], [1, 0], CLAMP);
  const presentHeader = interpolate(frame, [sec(T.presentEnd - 0.25), sec(T.presentEnd + 0.1)], [0, 1], CLAMP);
  const legend = interpolate(frame, [sec(T.presentEnd - 0.15), sec(T.presentEnd + 0.15)], [0, 1], CLAMP);
  const endLabel = interpolate(frame, [sec(T.presentEnd), sec(T.presentEnd + 0.25)], [0, 1], CLAMP);
  const presentHover = interpolate(frame, [sec(T.clickPresent - 0.3), sec(T.clickPresent - 0.18)], [0, 1], CLAMP);
  const presentPress = interpolate(frame, [sec(T.clickPresent - 0.03), sec(T.clickPresent + 0.05), sec(T.clickPresent + 0.18)], [0, 1, 0], CLAMP);
  const controls = interpolate(frame, [sec(T.panelStart), sec(T.panelStart + 0.5)], [0, 1], { ...CLAMP, easing: EASE_OUT });
  // The empty slot is almost transparent; it turns solid as the graph builds.
  const solid = interpolate(frame, [sec(T.clickAdd), sec(T.clickAdd + 0.35)], [0, 1], { ...CLAMP, easing: EASE_OUT });

  const chartH = CHART_H.compact + (CHART_H.split - CHART_H.compact) * split;
  const cardH = chartH + SLIDERS_H * split;

  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.ink }}>
      <div style={{ position: "absolute", left: MARGIN_X, top: TOP, width: W, height: 900, scale: K, transformOrigin: "0 0" }}>
        <Reveal
          at={0.35}
          y={14}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: W,
            height: cardH,
            borderRadius: 14,
            overflow: "hidden",
            border: `1px solid rgba(225, 228, 232, ${0.55 + 0.45 * solid})`,
            background: `rgba(255, 255, 255, ${0.22 + 0.78 * solid + 0.1 * add.hover * (1 - solid)})`,
            scale: 1 - 0.01 * add.press,
            boxShadow: `0 1px 2px rgba(16, 24, 40, ${0.05 * solid}), 0 16px 40px -12px rgba(16, 24, 40, ${0.04 * solid + 0.06 * m})`,
          }}
        >
          {/* The empty slot's label and spinner, enlarged for the big card. */}
          <div style={{ position: "absolute", left: 0, top: 0, width: W, height: CHART_H.compact, scale: 1.6 }}>
            <div style={{ opacity: add.label }}>
              <AddGraphLabel hover={add.hover} />
            </div>
            <BuildSpinner opacity={add.spinner} spin={add.spin} />
          </div>

          <div style={{ position: "absolute", left: INNER.x, top: INNER.y, width: INNER.w, height: chartH - INSET }}>
            <Reveal at={add.headerAt} style={{ opacity: compactHeader }}>
              <CardHeader title="Retirement projection" subtitle="Projected wealth over the plan horizon." hover={presentHover} press={presentPress} />
            </Reveal>
            <div style={{ position: "absolute", left: 32, top: 36, opacity: presentHeader, whiteSpace: "nowrap" }}>
              {/* 26 px (30 on the website) so the "Presenting" pill fits beside it. */}
              <div style={{ fontFamily: FONT.serif, fontSize: 26, lineHeight: 1.15 }}>Retirement projection (2026 – 2048)</div>
              <div style={{ fontSize: 15.5, fontStyle: "italic", color: C.muted, marginTop: 8 }}>Projected retirement wealth across the plan horizon.</div>
            </div>
            <LivePill t={t} opacity={presentHeader} />
            <RetirementChart w={INNER.w} h={chartH - INSET} m={m} build={build} axis={axis} params={paramsAt(t)} legend={legend} endLabel={endLabel} />
          </div>

          {split > 0 ? (
            <div style={{ opacity: controls }}>
              <Controls t={t} top={chartH} />
            </div>
          ) : null}
        </Reveal>
        <AdMeetCursor />
      </div>
    </AbsoluteFill>
  );
};
