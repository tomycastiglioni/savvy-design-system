export * from "../shared/theme";

// A 3x iPhone screen recording: 1080×2348 px = 360×782.67 pt. Everything is
// laid out in points and scaled up once in MobilePrep.
export const SCALE = 3;
export const W = 1080 / SCALE;
export const H = 2348 / SCALE;
export const SAFE_TOP = 47; // status bar height
export const PAD = 20; // screen side margin

// iOS system UI. Inter stands in for SF Pro.
export const IOS = {
  font: '"Inter", system-ui, sans-serif',
  label: "#000000",
  secondary: "rgba(60, 60, 67, 0.6)",
};

// Flagged-item amber, from savvy golden yellow (#D79F32).
export const AMBER = {
  bg: "#FDF6E9",
  border: "#F3E0B8",
  icon: "#B57F1C",
};
