import { Easing } from "remotion";

// Savvy Kit tokens (Figma library "Savvy Kit", Alias + Brand primitives).
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
  panel: "#F6F7F9",
  card: "#F8F9FA",
  tabsBg: "#F1F3F5",
  tabActive: "#E2E6EA",
  hover: "#F3F4F6",
  amber100: "#FCECCF", // color/warning/foreground-light
  white: "#FFFFFF",
};

export const FONT = {
  sans: '"DM Sans", system-ui, sans-serif', // font-family/text
  serif: '"DM Serif Display", Georgia, serif', // font-family/display
};

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_MORPH = Easing.bezier(0.7, 0, 0.2, 1);

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Canvas geometry (1300×900), matched to the storyboard keyframes.
export const REVIEW_BUTTON = { x: 261, y: 666, w: 238, h: 44 };
export const LOADING_BOX = { x: 367, y: 245, w: 566, h: 410 };
export const DOC_PANEL = { x: 145, y: 150, w: 1010, h: 690 };
export const TABS_BAR = { x: 166, y: 83, w: 518, h: 66 };
export const TABS = [
  { label: "Household context", x: 8, w: 175 },
  { label: "Meeting agenda", x: 183, w: 157 },
  { label: "Outstanding tasks", x: 340, w: 170 },
];
