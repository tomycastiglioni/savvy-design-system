import React from "react";
import { AbsoluteFill, Easing } from "remotion";
import { L, PHASE_TIMES, useT } from "../timeline";
import { BgName, bgGradient, EASE_IN_OUT } from "../theme";
import { ramp } from "./Motion";
import { StepState, TrackerView } from "./Tracker";

// Each phase's background sweeps in from the right over the last.
const Sweep: React.FC<{ readonly bg: BgName; readonly p: number }> = ({ bg, p }) => {
  if (p <= 0) return null;
  const at = 1.18 - 1.36 * p;
  return (
    <AbsoluteFill
      style={{
        background: bgGradient(bg),
        maskImage: p < 1 ? `linear-gradient(90deg, transparent ${at * 100 - 18}%, #000 ${at * 100 + 18}%)` : undefined,
      }}
    />
  );
};

export const LiveBackground: React.FC = () => {
  const t = useT();
  return (
    <>
      <AbsoluteFill style={{ background: bgGradient("cream") }} />
      <Sweep bg="mint" p={ramp(t, ...L.sweep1, EASE_IN_OUT)} />
      <Sweep bg="blue" p={ramp(t, ...L.sweep2, EASE_IN_OUT)} />
    </>
  );
};

const POP = Easing.out(Easing.back(2.2));

// The tracker over the whole story: the active step's ring fills with the time
// left in its phase; a finished step pops to a check.
export const LiveTracker: React.FC = () => {
  const t = useT();
  const enter = ramp(t, L.trackerIn, L.trackerIn + 0.5);
  const leave = ramp(t, L.trackerOut, L.trackerOut + 0.35, EASE_IN_OUT);
  if (t < L.trackerIn || leave >= 1) return null;

  const steps: StepState[] = PHASE_TIMES.map(([a, b]) => {
    if (t >= b) return { status: "done", pop: ramp(t, b, b + 0.35, POP) };
    if (t >= a) return { status: "active", ring: (t - a) / (b - a) };
    return { status: "todo" };
  });
  const blur = (1 - enter) * 6 + leave * 4;

  return (
    <TrackerView
      steps={steps}
      style={{ opacity: enter * (1 - leave), translate: `0px ${(1 - enter) * -28}px`, filter: blur > 0.05 ? `blur(${blur}px)` : undefined }}
    />
  );
};
