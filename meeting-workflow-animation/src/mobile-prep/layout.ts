export * from "../shared/theme";

// A 3x iPhone screen recording: 1080×2348 px = 360×782.67 pt. Everything is
// laid out in points and scaled up once in MobilePrep.
export const SCALE = 3;
export const W = 1080 / SCALE;
export const H = 2348 / SCALE;
export const SAFE_TOP = 47; // status bar height
export const PAD = 20; // screen side margin

// iOS system UI (status bar). Inter stands in for SF Pro.
export const IOS = {
  font: '"Inter", system-ui, sans-serif',
  label: "#000000",
};

// Primary button, from the Savvy Advisor app (same as 03 · Meeting capture).
export const BUTTON_BG = "#16473A";

// Loading placeholders.
export const SKELETON = { base: "#ECEEF1", highlight: "#F7F8FA" };

// Row icon tiles: savvy green, then savvy mauve (#C06F74) and golden yellow
// (#D79F32) darkened for the icons, on light tints.
export const TILE = {
  summary: { fg: "#175242", bg: "#E5F4EB" },
  task: { fg: "#A4545A", bg: "#F7ECED" },
  flagged: { fg: "#B57F1C", bg: "#FDF3E1" },
  agenda: { fg: "#6A7281", bg: "#F1F3F5" },
};
