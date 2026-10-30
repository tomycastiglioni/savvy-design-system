import { useCurrentFrame, useVideoConfig } from "remotion";

// 30 s launch video timeline, in seconds. Phases start on 2 s bars (120 BPM):
// Prep 0:04, Communicate 0:10, Deliver 0:18, close 0:24.
export const PHASE_TIMES = [
  [4, 10],
  [10, 18],
  [18, 24],
] as const;

export const L = {
  // Intro
  titleIn: 0.25,
  titleOut: 1.75,
  meetingIn: [2.05, 2.4] as const, // "One client meeting," then "start to finish"
  pillIn: 2.85,
  meetingOut: 3.85,
  pillFly: [3.95, 4.6] as const, // the household pill flies into the prep card
  // Prep
  trackerIn: 4.0,
  cardIn: 4.1,
  prepText: 4.3,
  reviewClick: 5.75,
  docMorph: [5.85, 6.45] as const,
  docReveal: [6.05, 7.15] as const,
  highlight: 8.55, // agenda item 3
  prepOut: 8.9,
  lift: [9.0, 9.6] as const, // the plan lifts out of the prep
  sweep1: [9.2, 10.2] as const, // green sweeps in
  line1: [9.4, 10.0] as const, // tracker: Prep → Communicate
  // Communicate
  land: [10.0, 10.7] as const, // lands as the presentation
  presentText: 10.35,
  chrome: 10.5,
  drag: [12.8, 13.6] as const, // contributions what-if
  presentOut: 14.3,
  stepBack: [14.4, 15.0] as const,
  phoneIn: [14.6, 15.25] as const,
  captureText: 14.8,
  captureOut: 16.75,
  closeUp: [16.9, 17.5] as const,
  writing: [17.15, 17.45] as const,
  sweep2: [17.2, 18.2] as const, // blue sweeps in
  line2: [17.4, 18.0] as const, // tracker: Communicate → Deliver
  // Deliver
  toRecap: [18.0, 18.75] as const, // the phone grows into the recap
  recapReveal: [18.15, 19.1] as const,
  deliverText: 18.4,
  toDoc: [20.0, 20.6] as const, // recap → client document
  emailIn: [20.45, 21.0] as const,
  write: [21.0, 21.7] as const,
  sendClick: 22.15,
  toSent: [22.25, 22.8] as const,
  sentCheck: [22.65, 23.0] as const,
  results: [22.95, 23.15, 23.35] as const,
  deliverOut: 23.8,
  trackerOut: 24.25,
  // Close
  words: [24.3, 24.6, 24.9] as const,
  wordsOut: 25.85,
  tagline: [26.3, 26.65] as const,
  taglineOut: 27.8,
  logoIn: 28.25,
  end: 30,
};

export const DURATION = L.end * 60;

export const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

// Press curve for a click at `at` (0 → 1 → 0 over ~0.2 s).
export const pressAt = (t: number, at: number) => {
  if (t < at - 0.03 || t > at + 0.18) return 0;
  return t < at + 0.05 ? (t - at + 0.03) / 0.08 : 1 - (t - at - 0.05) / 0.13;
};
