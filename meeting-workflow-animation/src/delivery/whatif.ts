import { interpolate } from "remotion";
import { CLAMP, EASE_IN_OUT } from "../shared/theme";

const pct = (v: number) => {
  const r = Math.round(v * 10) / 10;
  return Number.isInteger(r) ? `${r}%` : `${r.toFixed(1)}%`;
};

type Slider = {
  label: string;
  min: number;
  max: number;
  step: number;
  p0: number; // starting knob position, 0–1
  format: (v: number) => string;
};

export const SLIDERS: Slider[] = [
  { label: "Annual contributions", min: 0, max: 100000, step: 1000, p0: 0, format: (v) => `$${Math.round(v).toLocaleString("en-US")}` },
  { label: "Expected return rate", min: 0, max: 16, step: 0.1, p0: 0.4375, format: pct },
  { label: "Retirement age", min: 50, max: 90, step: 1, p0: 0.425, format: (v) => String(Math.round(v)) },
  { label: "Inflation rate", min: 0, max: 7.5, step: 0.1, p0: 0.4, format: pct },
  { label: "Salary growth rate", min: 0, max: 5, step: 0.1, p0: 0.4, format: pct },
];

// Cursor drags (seconds, absolute): $0 → $50,000, 7% → 8.5%, 3% → 2.5%.
export const DRAGS = [
  { slider: 0, start: 7.0, end: 7.8, to: 0.5 },
  { slider: 1, start: 8.4, end: 9.1, to: 0.53125 },
  { slider: 3, start: 9.7, end: 10.4, to: 1 / 3 },
];

export const sliderP = (i: number, t: number) => {
  let p = SLIDERS[i].p0;
  for (const d of DRAGS) {
    if (d.slider === i) {
      p = interpolate(t, [d.start, d.end], [p, d.to], { ...CLAMP, easing: EASE_IN_OUT });
    }
  }
  return p;
};

const raw = (i: number, p: number) => SLIDERS[i].min + p * (SLIDERS[i].max - SLIDERS[i].min);

// Displayed value snaps to the slider step; the chart uses the continuous value.
export const sliderLabel = (i: number, p: number) => {
  const s = SLIDERS[i];
  return s.format(Math.round(raw(i, p) / s.step) * s.step);
};

export const sliderActive = (i: number, t: number) =>
  Math.max(
    0,
    ...DRAGS.filter((d) => d.slider === i).map((d) =>
      interpolate(t, [d.start - 0.08, d.start, d.end, d.end + 0.12], [0, 1, 1, 0], CLAMP),
    ),
  );

export type Params = { contrib: number; ret: number; infl: number };

export const paramsAt = (t: number): Params => ({
  contrib: raw(0, sliderP(0, t)),
  ret: raw(1, sliderP(1, t)),
  infl: raw(3, sliderP(3, t)),
});

export const START_YEAR = 2026;
export const YEARS = 22;

// Real growth = expected return − inflation − 0.25% fees. ~$10M taxable today
// reaches ~$22.5M by 2048 at the defaults; contributions split 70/30.
export const project = (p: Params, years: number) => {
  const g = (p.ret - p.infl - 0.25) / 100;
  const grow = (rate: number) => Math.pow(1 + rate, years);
  const annuity = Math.abs(g) < 1e-6 ? years : (grow(g) - 1) / g;
  return {
    taxable: 10e6 * grow(g) + 0.7 * p.contrib * annuity,
    pretax: 0.3e6 * grow(g + 0.01) + 0.3 * p.contrib * annuity,
    roth: 0.06e6 * grow(g + 0.005),
  };
};
