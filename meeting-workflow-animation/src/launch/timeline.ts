import { useCurrentFrame, useVideoConfig } from "remotion";
import { Cam } from "./theme";

// Launch video timeline, in absolute seconds. Chapters start on bar lines of a
// 120 BPM grid (2s bars), so a 120 BPM track lines up with every section.
export const L = {
  // Intro · F1–F5
  titleIn: 0.25,
  titleOut: 2.0, // words leave, the prompt box opens around the logo
  zoom: [2.9, 3.7] as const, // close-up → full prompt box
  micClick: 4.0,
  dictate: [4.15, 5.3] as const,
  send: 5.5, // prompt becomes a message bubble
  status: 5.8, // "Checking your meeting preps…"
  reply: 6.6, // "Already done. Your prep is ready."
  reviewClick: 7.5,

  // Meeting prep · F6–F7
  prepMorph: 7.55, // button → loading card (0.6s)
  prepText: 7.95,
  prepExpand: 9.45, // loading card → prep document (0.6s)
  prepTabs: 9.95,
  prepOut: 11.55,

  // Live planning · F8–F11
  planIn: 12.0,
  addClick: 13.5,
  presentClick: 15.0,
  present: 15.05, // card → presentation (0.6s)
  pullBack: 16.35, // F10 → F11 (0.7s)
  whatIfIn: 16.85,
  planOut: 19.55,

  // Meeting capture · F12–F16 (03 · Meeting capture, time-remapped)
  captureIn: 20.0,
  capturePan: 21.25, // phone slides right for the headline (0.7s)
  captureText: 21.5,
  captureGrow: 26.2, // phone → desktop document
  captureTextOut: 26.15,

  // Client materials · F17–F19
  materialsIn: 28.0,
  scroll: [28.15, 29.05] as const,
  materialsPan: 29.1, // document slides right for the headline (0.65s)
  materialsText: 29.3,
  createClick: 30.25,
  draftClick: 33.45, // "Draft email to client"

  // Follow-up · F20–F23
  loaderMorph: 33.5, // button → writing-style loader (0.6s)
  loadHold: 34.35, // style tags pop in
  loaderSlide: 34.9, // loader moves right for the headline (0.6s)
  followText: 35.1,
  emailMorph: 35.95, // loader → email draft (0.6s)
  emailOpen: 36.45,
  type: [36.6, 38.1] as const,
  sendClick: 38.55,
  sent: 38.8, // draft → "Email sent" card

  // Close · F24–F25
  closeIn: 40.15,
  taglineOut: 42.15,
  logoIn: 42.5,
  end: 44.0,
};

export const DURATION = Math.round(L.end * 60);

// Background crossfades: [start, end, gradient].
export const BG_STOPS = [
  [11.6, 12.4, "mint"],
  [19.6, 20.3, "gold"],
  [27.6, 28.3, "blue"],
  [34.85, 35.65, "cream"],
] as const;

// Cameras over each source video's 1300×900 design space.
export const CAM = {
  // Prompt box (chat space = launch px at k 1).
  chatClose: { k: 1.406, x: 242, y: -119.5 },
  chat: { k: 1, x: 0, y: 0 },
  // 01 · Meeting prep document (F7).
  prep: { k: 0.915, x: 743.3, y: 127.8 },
  prepTabs: { k: 0.988, x: 730.7, y: 116.8 }, // the F7 tab bar is drawn a little larger
  // 02 · Delivery: graphs (F8–F9), presentation (F10), what-ifs (F11).
  graphs: { k: 1.628, x: -92.2, y: 77.8 },
  present: { k: 1.157, x: 208, y: 20.4 },
  whatIf: { k: 0.789, x: 67.8, y: 44.4 },
  // 03 · Meeting capture: phone centered (F12), phone right (F13–F15), desktop (F16).
  phone: { k: 1.67, x: -125.5, y: 36.4 },
  phoneRight: { k: 1.67, x: 282.5, y: 36.4 },
  desktop: { k: 1.155, x: 205.5, y: -28.3 },
  // 04 · Recap: document right (F18), editor (F19).
  desktopRight: { k: 1.155, x: 622.5, y: -28.3 },
  editor: { k: 1.155, x: 671.5, y: 8 },
} satisfies Record<string, Cam>;

export const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};
