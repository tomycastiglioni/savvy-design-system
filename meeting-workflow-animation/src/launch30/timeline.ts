import { useCurrentFrame, useVideoConfig } from "remotion";

// 30 s launch video timeline, in seconds. Prep 0:03.5, Meet 0:09.5, Deliver
// 0:17.5, close 0:24.
export const PHASE_TIMES = [
  [3.5, 9.5],
  [9.5, 17.5],
  [17.5, 24],
] as const;

export const L = {
  // Intro: the line, the advisor's client list, Allison & Frank Chan picked
  titleIn: [0.2, 0.5] as const, // "Deliver more for your clients" / "with Savvy Intelligence"
  pageUp: [1.3, 1.95] as const, // the page scrolls up and the client list comes in
  listIn: [1.4, 2.0] as const,
  listScroll: [2.05, 2.85] as const, // the list scrolls to Allison & Frank Chan
  pickClick: 3.05,
  pickMorph: [3.15, 3.75] as const, // their row becomes the prep card
  // Prep
  trackerIn: 3.5,
  cardIn: 3.75,
  prepText: 3.8,
  reviewClick: 5.25,
  docMorph: [5.35, 5.95] as const,
  docReveal: [5.55, 6.65] as const,
  planClick: 8.1, // click on agenda item 3, "Retirement plan"
  prepOut: 8.4,
  lift: [8.5, 9.1] as const, // the plan lifts out of the prep
  sweep1: [8.7, 9.7] as const, // green sweeps in
  // Meet
  land: [9.5, 10.2] as const, // lands as the presentation
  lineDraw: [8.95, 9.65] as const, // the projection draws in as the plan lifts out
  presentText: 9.85,
  chrome: 10.1,
  bubble: 10.75, // the client's question pops in…
  typing: [10.9, 11.9] as const, // …and writes itself out
  drag: [12.2, 13.0] as const, // contributions what-if
  presentOut: 13.8,
  stepBack: [13.9, 14.5] as const,
  phoneIn: [14.1, 14.75] as const,
  captureText: 14.3,
  captureOut: 16.25,
  closeUp: [16.4, 17.0] as const,
  writing: [16.65, 16.95] as const,
  sweep2: [16.7, 17.7] as const, // blue sweeps in
  // Deliver: the recap holds longer than before (0:18.25–0:20)
  toRecap: [17.5, 18.25] as const, // the phone grows into the recap
  recapReveal: [17.65, 18.6] as const,
  deliverText: 17.9,
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
