import React from "react";
import { useT } from "../anim";
import { GlassChip, IconName } from "../Bits";
import { FONT } from "../theme";

// 07 · And a whole lot more… (406×346), on the dark card (Figma): three rows
// of the jobs Savvy Intelligence handles, scrolling in alternate directions,
// endlessly. Nothing else happens.
export type MoreState = {
  readonly drift?: number; // px each row has scrolled (rows alternate direction)
};

// Two layouts: the first section's card (406×346) and the second's, wider
// (617×376, Figma 25683:703), with larger chips.
type Layout = { readonly w: number; readonly h: number; readonly chip: number; readonly gap: number; readonly rowW: number; readonly rows: readonly { dx: number; dy: number; dir: number }[] };
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
// Row centres from Figma, relative to the frame's centre; rowW is one run of
// the eight chips.
const LAYOUTS: Record<"card" | "wide", Layout> = {
  card: {
    w: 406,
    h: 346,
    chip: 13.893,
    gap: 11.578,
    rowW: 1335.771,
    rows: [
      { dx: -399.26, dy: -61.67, dir: -1 },
      { dx: 0, dy: 0, dir: 1 },
      { dx: 400.4, dy: 61.67, dir: -1 },
    ],
  },
  wide: {
    w: 617,
    h: 376,
    chip: 15.876,
    gap: 13.23,
    rowW: 1527.626,
    rows: [
      { dx: -244.71, dy: -70.47, dir: -1 },
      { dx: -1.2, dy: 0, dir: 1 },
      { dx: 269.49, dy: 70.47, dir: -1 },
    ],
  },
};

export const More: React.FC<{ readonly s: MoreState; readonly wide?: boolean }> = ({ s, wide = false }) => {
  const { drift = 0 } = s;
  const { w: W, h: H, chip, gap, rowW, rows } = LAYOUTS[wide ? "wide" : "card"];
  const period = rowW + gap;
  return (
    <div style={{ position: "relative", width: W, height: H, overflow: "hidden", fontFamily: FONT }}>
      {rows.map((row, r) => {
        // three runs of the row side by side, shifted modulo one run: seamless
        const shift = (((row.dir * drift) % period) + period) % period;
        const left = W / 2 + row.dx - rowW / 2 - period + shift;
        return (
          <div key={r} style={{ position: "absolute", left, top: H / 2 + row.dy - (chip * 3.35) / 2, display: "flex", gap, alignItems: "center" }}>
            {[0, 1, 2].flatMap((copy) => JOBS.map((job) => <GlassChip key={`${copy}-${job.label}`} icon={job.icon} label={job.label} size={chip} />))}
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

// The loop (24 s): one full run of a row scrolls by, so the end meets the start.
export const MORE_SECONDS = 24;
export const MoreLoop: React.FC = () => {
  const t = useT();
  const { rowW, gap } = LAYOUTS.card;
  return <More s={{ drift: ((rowW + gap) * t) / MORE_SECONDS }} />;
};

export const MOREWIDE_FRAMES: readonly { s: MoreState; title: string; caption: string }[] = [
  { s: {}, title: "Hundreds of jobs", caption: "The design’s three rows of jobs, in the wider frame (617×376) with the larger chips." },
  { s: { drift: 170 }, title: "Scrolling", caption: "Same as before: the top and bottom rows scroll left, the middle row right, slow and steady, wrapping endlessly." },
];

// The wide card's loop: one full run of a row, slower (40 s, about 38 px/s).
export const MOREWIDE_SECONDS = 40;
export const MoreWideLoop: React.FC = () => {
  const t = useT();
  const { rowW, gap } = LAYOUTS.wide;
  return <More wide s={{ drift: ((rowW + gap) * t) / MOREWIDE_SECONDS }} />;
};
