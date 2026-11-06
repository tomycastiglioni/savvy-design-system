import { createContext, useContext } from "react";

// Shared ad geometry. The 4:5 layout is the Figma one ("01 — Meeting steps
// (4x5) v3"); 1:1 and 9:16 reuse its text block, scaled, and fit each graphic
// to the room left under it.

export type Format = "4x5" | "1x1" | "9x16";
type Spec = {
  readonly w: number;
  readonly h: number;
  readonly textTop: number; // where the logo starts
  readonly textScale: number; // the Figma text block, scaled
  readonly gap: number; // body copy → graphic
  // Key UI (clicked buttons, centred cards) stays above this line; graphics
  // may still run past it. 9:16 keeps clear of the story/reel overlays.
  readonly safeBottom: number;
};
export const FORMATS: Record<Format, Spec> = {
  "4x5": { w: 1080, h: 1350, textTop: 86.48, textScale: 1, gap: 80, safeBottom: 1350 },
  "1x1": { w: 1080, h: 1080, textTop: 74.57, textScale: 0.75, gap: 56, safeBottom: 1080 },
  "9x16": { w: 1080, h: 1920, textTop: 250, textScale: 1, gap: 96, safeBottom: 1600 },
};

// The text column's left edge; graphics line up with it and may only run off
// the right and bottom edges.
export const MARGIN_X = 74.57;
// Width between the side margins (all formats are 1080 wide).
export const INNER_W = 1080 - 2 * MARGIN_X;

// Height of each ad's Figma text block (logo to the end of the body copy).
export type Step = "prep" | "meet" | "capture" | "deliver";
const BLOCK_H: Record<Step, number> = { prep: 528.33, meet: 427.33, capture: 484.33, deliver: 437.33 };
// Formats whose headline runs a line shorter than Figma's (the `formats` copy
// overrides in MeetingStepAd.tsx): 1:1 sets Prep in two lines, Deliver in one.
const HEADLINE_LINE = 91.012;
const BLOCK_H_BY_FORMAT: Partial<Record<Format, Partial<Record<Step, number>>>> = {
  "1x1": { prep: BLOCK_H.prep - HEADLINE_LINE, deliver: BLOCK_H.deliver - HEADLINE_LINE },
};

export const FormatContext = createContext<Format>("4x5");

export type AdLayout = Spec & {
  readonly format: Format;
  readonly textBottom: number; // end of the body copy
  readonly top: number; // the graphic line
};
export const adLayout = (format: Format, step: Step): AdLayout => {
  const f = FORMATS[format];
  const textBottom = f.textTop + (BLOCK_H_BY_FORMAT[format]?.[step] ?? BLOCK_H[step]) * f.textScale;
  return { ...f, format, textBottom, top: textBottom + f.gap };
};
export const useAdLayout = (step: Step) => adLayout(useContext(FormatContext), step);
// Pick a per-format value.
export const byFormat = <V,>(format: Format, values: Record<Format, V>) => values[format];
