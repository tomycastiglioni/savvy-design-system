export * from "../shared/theme";

// Launch video canvas (1920×1080). All geometry here is measured from the
// 25 storyboard keyframes (keyframes_launch_video.zip).
export const W = 1920;
export const H = 1080;

export const DIATYPE = '"ABC Diatype", "DM Sans", system-ui, sans-serif';

// Background gradients (102°, 20% → 80%), sampled from the keyframes.
export const BG = {
  cream: ["#F9F5EF", "#D3CDC4"],
  mint: ["#D9F2EB", "#A4E6D4"],
  gold: ["#F8F1E2", "#EAD7B1"],
  blue: ["#E1F5FC", "#A5DAEA"],
} as const;
export type BgName = keyof typeof BG;

export const EYEBROW = {
  prep: "#8E7E57",
  planning: "#175242",
  capture: "#D79F32",
  materials: "#095972",
  followUp: "#8E7E57",
};

// Headline type: ABC Diatype Regular, black. Positions are cap-top lines.
export const HEADLINE = { size: 79.6, lh: 96, color: "#000000" };
export const TITLE_SIZE = 78.5; // F1 title, tracked -0.02em
export const TEXT_X = 174; // left text column (element edge; ink starts ~1px right)
export const TEXT_X_RIGHT = 1167; // right text column (Live planning)

export const CURSOR_SCALE = 1.3;

export type Rect = { x: number; y: number; w: number; h: number };
export type Cam = { k: number; x: number; y: number };

// A design-space point seen through a camera.
export const viaCam = (c: Cam, p: { x: number; y: number }) => ({
  x: c.x + p.x * c.k,
  y: c.y + p.y * c.k,
});
export const rectViaCam = (c: Cam, r: Rect): Rect => ({
  x: c.x + r.x * c.k,
  y: c.y + r.y * c.k,
  w: r.w * c.k,
  h: r.h * c.k,
});
