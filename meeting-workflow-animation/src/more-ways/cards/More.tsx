import React from "react";
import { GlassChip, IconName } from "../Bits";
import { C, FONT } from "../theme";

// 07 · And a whole lot more… (406×346), on the dark card (Figma): three rows
// of the jobs Savvy Intelligence handles, drifting in alternate directions,
// endlessly. Now and then one lights up as it runs, and a new one slides in.
export type MoreState = {
  readonly drift?: number; // px each row has moved (rows alternate direction)
  readonly lit?: string; // label of the chip that's running
  readonly added?: number; // 0–1: the new job sliding into the middle row
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
const NEW_JOB = { icon: "chip-chart" as IconName, label: "Tax-loss harvesting" };
const GAP = 11.578;
const ROW_W = 1335.771;
// Row centres from Figma, relative to the frame's centre.
const ROWS = [
  { dx: -399.26, dy: -61.67, dir: -1 },
  { dx: 0, dy: 0, dir: 1 },
  { dx: 400.4, dy: 61.67, dir: -1 },
];

const NewTag: React.FC = () => (
  <span style={{ marginLeft: -2, padding: "2px 6px", borderRadius: 5, background: C.mint, color: C.greenInk, fontSize: 10, lineHeight: 1.2 }}>New</span>
);

export const More: React.FC<{ readonly s: MoreState }> = ({ s }) => {
  const { drift = 0, lit, added = 0 } = s;
  return (
    <div style={{ position: "relative", width: W, height: H, overflow: "hidden", fontFamily: FONT }}>
      {ROWS.map((row, r) => {
        // the row twice over, so it can drift without running out
        const shift = (((row.dir * drift) % (ROW_W + GAP)) + (ROW_W + GAP)) % (ROW_W + GAP);
        const left = W / 2 + row.dx - ROW_W / 2 - (ROW_W + GAP) + shift;
        return (
          <div key={r} style={{ position: "absolute", left, top: H / 2 + row.dy - 23.39, display: "flex", gap: GAP, alignItems: "center" }}>
            {[0, 1, 2].flatMap((copy) =>
              JOBS.flatMap((job) => {
                const chip = <GlassChip key={`${copy}-${job.label}`} icon={job.icon} label={job.label} lit={r === 1 && copy === 1 && lit === job.label ? 1 : 0} />;
                if (r === 1 && copy === 1 && job.label === "Model rebalances" && added > 0) {
                  return [
                    <div key="new" style={{ width: added * 210, overflow: "visible", display: "flex", justifyContent: "flex-end" }}>
                      <div style={{ opacity: added, scale: 0.9 + 0.1 * added }}>
                        <GlassChip icon={NEW_JOB.icon} label={NEW_JOB.label} lit={0.6 * added} extra={<NewTag />} style={{ paddingRight: 12 }} />
                      </div>
                    </div>,
                    chip,
                  ];
                }
                return [chip];
              }),
            )}
          </div>
        );
      })}
    </div>
  );
};

export const MORE_FRAMES: readonly { s: MoreState; title: string; caption: string }[] = [
  { s: {}, title: "Hundreds of jobs", caption: "The design’s three rows of jobs." },
  { s: { drift: 120 }, title: "Always moving", caption: "The rows drift in alternate directions, slowly and endlessly, so the list never ends." },
  { s: { drift: 210, lit: "Model rebalances" }, title: "Running", caption: "Now and then a job lights up as it runs: its chip brightens and outlines, then settles." },
  { s: { drift: 60, added: 1 }, title: "And more all the time", caption: "A new job slides into the middle row with a “New” tag, pushing the others along." },
];
