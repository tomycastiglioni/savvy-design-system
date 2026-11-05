import React, { useState } from "react";
import { AbsoluteFill, Img, Sequence, staticFile, useVideoConfig } from "remotion";
import { Capture } from "../capture/Capture";
import { Delivery } from "../delivery/Delivery";
import { MeetingPrep } from "../meeting-prep/MeetingPrep";
import { Recap } from "../recap/Recap";
import { loadAdFonts } from "./fonts";

// Innovation Campaign · "01 — Meeting steps (4x5) v3" (Figma), 1080×1350:
// the v3 text layout (Savvy logo, Diatype Light headline, body copy) on the
// step's gradient, with that step's workflow animation playing under it,
// placed like the v2 graphics and running off the frame. The animations are
// the landing-page workflow videos with their background dropped.
//
// Placements start from v2's and keep the UI clear of the (longer) v3 copy:
// the highest the animation ever reaches sits ~45 px under the body text.
// Meet and Capture are smaller than in v2 (0.93× vs 1.18×, 1.05× vs 1.29×) so
// the what-if controls and the desktop recap they reach stay inside the frame.

export const AD = { w: 1080, h: 1350 };
// The workflow videos' canvas.
const SOURCE = { w: 1300, h: 900 };

type Workflow = "prep" | "meet" | "capture" | "deliver";
const WORKFLOWS: Record<Workflow, React.FC> = {
  prep: () => <MeetingPrep transparent />,
  meet: () => <Delivery transparent />,
  capture: () => <Capture transparent />,
  deliver: () => <Recap transparent />,
};

export type AdSpec = {
  readonly workflow: Workflow;
  readonly gradient: readonly [string, string];
  // Text column (Figma auto layout: left 74.57, top 86.48, gap 56).
  readonly column: number;
  readonly headline: readonly string[]; // one entry per forced line
  readonly headlineSize?: number;
  readonly headlineWidth?: number;
  readonly body: readonly string[]; // one entry per paragraph
  readonly bodyWidth?: number;
  // The animation: its 1300×900 canvas placed at x, y and scaled, starting
  // `start` s in (past its entrance, so the first frame already shows the UI).
  readonly graphic: { readonly x: number; readonly y: number; readonly scale: number };
  readonly start?: number;
};

export const MeetingStepAd: React.FC<AdSpec> = ({ workflow, gradient, column, headline, headlineSize = 100, headlineWidth, body, bodyWidth, graphic, start = 0 }) => {
  useState(loadAdFonts);
  const { fps } = useVideoConfig();
  const Animation = WORKFLOWS[workflow];
  return (
    <AbsoluteFill style={{ background: `linear-gradient(90deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: graphic.x, top: graphic.y, width: SOURCE.w, height: SOURCE.h, scale: graphic.scale, transformOrigin: "0 0" }}>
        <Sequence from={-Math.round(start * fps)} layout="none">
          <Animation />
        </Sequence>
      </div>
      <div style={{ position: "absolute", left: 74.57, top: 86.48, width: column, display: "flex", flexDirection: "column", gap: 56, fontFamily: '"ABC Diatype", sans-serif' }}>
        <Img src={staticFile("ads/savvy-logo.svg")} style={{ width: 220.609, height: 74.264, display: "block" }} />
        <div
          style={{
            width: headlineWidth ?? column,
            fontSize: headlineSize,
            fontWeight: 300,
            lineHeight: 1,
            letterSpacing: -0.02 * headlineSize,
            color: "#000000",
          }}
        >
          {headline.map((line, i) => (
            <React.Fragment key={line}>
              {i ? <br /> : null}
              {line}
            </React.Fragment>
          ))}
        </div>
        <div style={{ width: bodyWidth ?? column, fontSize: 38.241, fontWeight: 400, lineHeight: 1.35, letterSpacing: 0.1912, color: "rgba(0, 0, 0, 0.78)" }}>
          {body.map((p) => (
            <div key={p}>{p}</div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// The four ads, copy and sizes as in Figma.
// Each ad runs the rest of its workflow video after `start`.
export const adFrames = (spec: AdSpec, sourceSeconds: number, fps = 60) => Math.round((sourceSeconds - (spec.start ?? 0)) * fps);

export const ADS = {
  prep: {
    workflow: "prep",
    gradient: ["#F9F5EF", "#D3CDC4"],
    column: 795.432,
    headline: ["Planning and prep that’s ready before you ask."],
    body: ["AI knows your clients and drafts meeting prep ahead of each client engagement."],
    bodyWidth: 728.146,
    graphic: { x: -80, y: 670, scale: 1240 / SOURCE.w },
    start: 0.6,
  },
  meet: {
    workflow: "meet",
    gradient: ["#D9F2EB", "#A4E6D4"],
    column: 919.181,
    headline: ["Make your financial advice easy to present."],
    headlineSize: 94.978,
    body: ["Ask AI “What if they retire at 63?” and watch the financial planning custom charts update live."],
    graphic: { x: (AD.w - 0.93 * SOURCE.w) / 2, y: 496, scale: 0.93 },
    start: 0.6,
  },
  capture: {
    workflow: "capture",
    gradient: ["#F8F1E2", "#EAD7B1"],
    column: 922.432,
    headline: ["Meeting capture on the go & synced."],
    body: ["Savvy records everything from your phone while you focus on planning with your clients. Notes are synced and their recap is written ready for your approval."],
    graphic: { x: (AD.w - 1.05 * SOURCE.w) / 2, y: 616, scale: 1.05 },
    start: 0.6,
  },
  deliver: {
    workflow: "deliver",
    gradient: ["#E1F5FC", "#A5DAEA"],
    column: 906.432,
    headline: ["From advice", "to execution."],
    headlineWidth: 857.708,
    body: ["Recap email in your voice, ready to send.", "Tasks sent to your dedicated team, ready to execute."],
    graphic: { x: -80, y: 623, scale: 1240 / SOURCE.w },
  },
} satisfies Record<Workflow, AdSpec>;
