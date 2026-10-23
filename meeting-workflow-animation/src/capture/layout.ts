export * from "../shared/theme";

// Canvas geometry (1300×900), matched to the 03 · Meeting capture storyboard.
export type Rect = { x: number; y: number; w: number; h: number };

// Vector iPhone: titanium frame → black bezel → screen.
export const PHONE: Rect = { x: 463, y: 62, w: 374, h: 776 };
export const BEZEL = 12; // frame + bezel thickness around the screen
export const SCREEN: Rect = { x: PHONE.x + BEZEL, y: PHONE.y + BEZEL, w: PHONE.w - 2 * BEZEL, h: PHONE.h - 2 * BEZEL };
export const SCREEN_RADIUS = 48;

// Desktop document: same panel and tab bar as 01 · Meeting prep's prep document.
export const DOC_PANEL: Rect = { x: 145, y: 150, w: 1010, h: 690 };
export const TABS_BAR = { x: 145, y: 63, h: 66 };
export const DESKTOP_TABS = [
  { label: "Overview", x: 8, w: 132 },
  { label: "Transcript", x: 140, w: 132 },
];

// Mobile palette, sampled from the Savvy Advisor app mockups.
export const M = {
  red: "#AD3A35",
  wave: "#9A9EA4",
  button: "#16473A",
  buttonMuted: "#E5E7EB",
  link: "#1D4135",
  linkMuted: "#9EB1AB",
  titanium: "#72818B",
};

// Screen-relative positions (px inside SCREEN).
export const MOBILE = {
  timerY: 236,
  waveY: 350,
  statusY: 404, // "Recording" / "Transcribing" row
  nameY: 446,
  pauseY: 606,
  stopY: 652,
  discardY: 708,
  buttonX: 14,
  buttonH: 36,
  iconCenterY: 306, // "Writing your recap" icon
  writingTitleY: 368,
  writingNameY: 404,
  backY: 684,
  tabsY: 178,
};

export const screenPoint = (x: number, y: number) => ({ x: SCREEN.x + x, y: SCREEN.y + y });
