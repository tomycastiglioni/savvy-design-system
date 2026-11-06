import React from "react";
import { GlassChip, IconName } from "../Bits";
import { FONT } from "../theme";

// 07 · And a whole lot more… (406×346), on the dark card (Figma): three rows
// of the jobs Savvy Intelligence handles, scrolling in alternate directions,
// endlessly. Nothing else happens.
export type MoreState = {
  readonly drift?: number; // px each row has scrolled (rows alternate direction)
};

const W = 406;
const H = 346;
const JOBS: readonly { icon: IconName; label: string }[] = [
  { icon: "chip-chart", label: "Tax projections" },
  { icon: "chip-users", label: "Beneficiary checks" },
  { icon: "chip-square-plus", label: "Onboarding" },
  { icon: "chip-refresh", label: "Model rebalances" },
  { icon: "chip-mail", label: "Client emails" },
  { icon: "chip-calendar", label: "Meeting prep" },
  { icon: "chip-circle-check", label: "Follow-up" },
  { icon: "chip-layers", label: "Household summaries" },
];
const GAP = 11.578;
const ROW_W = 1335.771; // one run of the eight chips (Figma)
// Row centres from Figma, relative to the frame's centre.
const ROWS = [
  { dx: -399.26, dy: -61.67, dir: -1 },
  { dx: 0, dy: 0, dir: 1 },
  { dx: 400.4, dy: 61.67, dir: -1 },
];

export const More: React.FC<{ readonly s: MoreState }> = ({ s }) => {
  const { drift = 0 } = s;
  const period = ROW_W + GAP;
  return (
    <div style={{ position: "relative", width: W, height: H, overflow: "hidden", fontFamily: FONT }}>
      {ROWS.map((row, r) => {
        // three runs of the row side by side, shifted modulo one run: seamless
        const shift = (((row.dir * drift) % period) + period) % period;
        const left = W / 2 + row.dx - ROW_W / 2 - period + shift;
        return (
          <div key={r} style={{ position: "absolute", left, top: H / 2 + row.dy - 23.39, display: "flex", gap: GAP, alignItems: "center" }}>
            {[0, 1, 2].flatMap((copy) => JOBS.map((job) => <GlassChip key={`${copy}-${job.label}`} icon={job.icon} label={job.label} />))}
          </div>
        );
      })}
    </div>
  );
};

export const MORE_FRAMES: readonly { s: MoreState; title: string; caption: string }[] = [
  { s: {}, title: "Hundreds of jobs", caption: "The design’s three rows of jobs." },
  { s: { drift: 140 }, title: "Scrolling", caption: "The top and bottom rows scroll left, the middle row right, at a slow, steady pace." },
  { s: { drift: 280 }, title: "Endlessly", caption: "The rows wrap seamlessly, so the list never runs out. A plain scroll, nothing else." },
];
