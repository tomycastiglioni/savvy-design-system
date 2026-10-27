import { Easing } from "remotion";

// Savvy Kit tokens (Figma library "Savvy Kit", Alias + Brand primitives).
// Shared by every workflow video so they stay visually identical.
export const C = {
  green: "#175242", // color/primary/base — colors/green/500 (savvy green)
  green50: "#E5F4EB", // color/primary/background
  green100: "#CDE8D9", // color/primary/foreground-light
  green300: "#67BD8D", // color/primary/outline
  ink: "#1D2334", // colors/slate/800 (savvy primary)
  body: "#363E4C",
  muted: "#6A7281", // color/text/secondary — slate/600
  faint: "#9CA3AF", // slate/400
  label: "#8A919E",
  border: "#D1D5DB", // color/component/border-light — slate/300
  borderSoft: "#E8EAED", // color/component/base-muted — slate/200
  panel: "#F5F6F8",
  statsBorder: "#E1E4E8",
  card: "#F8F9FA",
  tabsBg: "#F1F3F5",
  tabActive: "#E2E6EA",
  hover: "#F3F4F6",
  amber100: "#FCECCF", // color/warning/foreground-light
  white: "#FFFFFF",
};

// Chart series, in fixed order. Savvy green leads; golden yellow and mauve come
// from Savvy Kit color/chart (savvy golden yellow, savvy mauve). Validated
// all-pairs for CVD separation; never more than three series per chart.
export const SERIES = ["#175242", "#D79F32", "#C06F74"] as const;
export const CHART = {
  grid: "#ECEEF1",
  axis: "#9CA3AF",
  track: "#E5E7EB",
};

export const FONT = {
  sans: '"DM Sans", system-ui, sans-serif', // font-family/text
  serif: '"DM Serif Display", Georgia, serif', // font-family/display
};

// Section background gradients (102°, 20% → 80%), shared with the launch video.
// Meeting prep is cream, delivery mint, capture gold and recap blue.
export const BG = {
  cream: ["#F9F5EF", "#D3CDC4"],
  mint: ["#D9F2EB", "#A4E6D4"],
  gold: ["#F8F1E2", "#EAD7B1"],
  blue: ["#E1F5FC", "#A5DAEA"],
} as const;
export type BgName = keyof typeof BG;
export const bgGradient = (bg: BgName) => `linear-gradient(102deg, ${BG[bg][0]} 20%, ${BG[bg][1]} 80%)`;

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_MORPH = Easing.bezier(0.7, 0, 0.2, 1);

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
