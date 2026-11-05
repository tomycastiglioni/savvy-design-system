import React, { useState } from "react";
import { AbsoluteFill, Img, Sequence, staticFile, useVideoConfig } from "remotion";
import { loadAdFonts } from "./fonts";
import { AD } from "./layout";
import { AdCapture } from "./scenes/AdCapture";
import { AdDeliver } from "./scenes/AdDeliver";
import { AdMeet } from "./scenes/AdMeet";
import { AdPrep } from "./scenes/AdPrep";

// Innovation Campaign · "01 — Meeting steps (4x5) v3" (Figma), 1080×1350:
// the v3 text layout (Savvy logo, Diatype Light headline, body copy) on the
// step's gradient, with that step's workflow animation playing under it,
// laid out for the 4:5 frame: bigger than on the website, left edge on the
// text margin, free to run off the right and bottom (src/ads/scenes/).

export { AD };

type Workflow = "prep" | "meet" | "capture" | "deliver";
// Each step's graphic, laid out for the ad (src/ads/scenes/).
const WORKFLOWS: Record<Workflow, React.FC> = { prep: AdPrep, meet: AdMeet, capture: AdCapture, deliver: AdDeliver };

export type AdSpec = {
  readonly workflow: Workflow;
  readonly gradient: readonly [string, string];
  // Text column (Figma auto layout: left 74.57, top 86.48; logo, 50.97, then
  // headline, 42.78, body).
  readonly column: number;
  readonly headline: readonly string[]; // one entry per forced line
  readonly headlineSize?: number;
  readonly headlineWidth?: number;
  readonly body: readonly string[]; // one entry per paragraph
  readonly bodyWidth?: number;
  // The graphic starts `start` s into its workflow (past the entrance, so the
  // first frame already shows the UI).
  readonly start?: number;
};

// Type sizes from Figma (headline letter-spacing −2%, body +0.5%).
const HEADLINE = 91.012;
const BODY = 34.804;
const LOGO = { w: 200.781, h: 67.589 };

export const MeetingStepAd: React.FC<AdSpec> = ({ workflow, gradient, column, headline, headlineSize = HEADLINE, headlineWidth, body, bodyWidth, start = 0 }) => {
  useState(loadAdFonts);
  const { fps } = useVideoConfig();
  const Animation = WORKFLOWS[workflow];
  return (
    <AbsoluteFill style={{ background: `linear-gradient(90deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`, overflow: "hidden" }}>
      <Sequence from={-Math.round(start * fps)}>
        <Animation />
      </Sequence>
      <div style={{ position: "absolute", left: 74.57, top: 86.48, width: column, display: "flex", flexDirection: "column", gap: 50.967, fontFamily: '"ABC Diatype", sans-serif' }}>
        <Img src={staticFile("ads/savvy-logo.svg")} style={{ width: LOGO.w, height: LOGO.h, display: "block" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 42.776 }}>
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
          <div style={{ width: bodyWidth ?? column, fontSize: BODY, fontWeight: 400, lineHeight: 1.35, letterSpacing: 0.005 * BODY, color: "rgba(0, 0, 0, 0.78)" }}>
            {body.map((p) => (
              <div key={p}>{p}</div>
            ))}
          </div>
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
    column: 723.939,
    headline: ["Planning and prep that’s ready before you ask."],
    body: ["AI knows your clients and drafts meeting prep ahead of each client engagement."],
    start: 0.6,
  },
  meet: {
    workflow: "meet",
    gradient: ["#D9F2EB", "#A4E6D4"],
    column: 836.565,
    headline: ["Make your financial advice easy to present."],
    headlineSize: 86.442,
    body: ["Ask AI “What if they retire at 63?” and watch the financial planning custom charts update live."],
    start: 0.6,
  },
  capture: {
    workflow: "capture",
    gradient: ["#F8F1E2", "#EAD7B1"],
    column: 839.524,
    headline: ["Meeting capture on the go & synced."],
    body: ["Savvy records everything from your phone while you focus on planning with your clients. Notes are synced and their recap is written ready for your approval."],
    start: 0.6,
  },
  deliver: {
    workflow: "deliver",
    gradient: ["#E1F5FC", "#A5DAEA"],
    column: 824.962,
    headline: ["From advice", "to execution."],
    headlineWidth: 780.618,
    body: ["Recap email in your voice, ready to send.", "Tasks sent to your dedicated team, ready to execute."],
  },
} satisfies Record<Workflow, AdSpec>;
