import { BgName } from "../shared/theme";

export * from "../shared/theme";
export { DIATYPE } from "../launch/theme";

// 30 s launch video: one client meeting, followed through Prep → Communicate →
// Deliver. Canvas 1920×1080.
export const W = 1920;
export const H = 1080;

export type PhaseKey = "prep" | "communicate" | "deliver";
export type Phase = { key: PhaseKey; label: string; when: string; bg: BgName; accent: string };

// Each phase owns a background and an accent (the launch eyebrow colors).
export const PHASES: readonly Phase[] = [
  { key: "prep", label: "Prep", when: "Before the meeting", bg: "cream", accent: "#8E7E57" },
  { key: "communicate", label: "Communicate", when: "During the meeting", bg: "mint", accent: "#175242" },
  { key: "deliver", label: "Deliver", when: "After the meeting", bg: "blue", accent: "#095972" },
];
export const phase = (key: PhaseKey) => PHASES.find((p) => p.key === key) as Phase;

// Layout: headline column on the left, product UI on the right, both centred
// on the frame's middle line.
export const TEXT_X = 174;
export const CY = 540;
export const UI = { x: 860, w: 900, cy: CY };
// Centred `h`-tall block on the middle line.
export const centerTop = (h: number) => CY - h / 2;

// The one meeting the whole video follows.
export const HOUSEHOLD = "Allison & Frank Chan";
export const MEETING = "Quarterly Review";

// Abstract UI: body copy becomes bars; only names, numbers and labels stay text.
export const BAR = { color: "#E6E9ED", strong: "#D6DBE1" };
export const CARD_SHADOW = "0 2px 4px rgba(16, 24, 40, 0.04), 0 30px 70px -24px rgba(16, 24, 40, 0.22)";
