import { createContext, useContext } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

// Launch video timeline, in seconds.
//
// BASE is the cut the team approved (Nov 5, 30 s), where the voiceover was
// squeezed into the visuals. Round 4 turns that around: every line plays at
// Jeremy's natural pace with a pause after it, and the visuals make room. The
// room is taken only where the picture holds still (ROOM), so no move plays
// faster or slower than before. The close is built from the voiceover itself:
// each word lands as it's said.

const BASE = {
  // Intro: the line, the advisor's client list, Allison & Frank Chan picked
  titleIn: [0.2, 0.5], // "Deliver more for your clients" / "with Savvy Intelligence"
  pageUp: [1.3, 1.95], // the page scrolls up and the client list comes in
  listIn: [1.4, 2.0],
  listScroll: [2.05, 2.85], // the list scrolls to Allison & Frank Chan (longer in the retimed cut, below)
  pickClick: 3.05,
  pickMorph: [3.15, 3.75], // their row becomes the prep card
  // Prep
  trackerIn: 3.5,
  cardIn: 3.75,
  prepText: 3.8,
  reviewClick: 5.25,
  docMorph: [5.35, 5.95],
  docReveal: [5.55, 6.65],
  planClick: 8.1, // click on agenda item 3, "Retirement plan"
  prepOut: 8.4,
  lift: [8.5, 9.1], // the plan lifts out of the prep
  sweep1: [8.7, 9.7], // green sweeps in
  // Meet
  land: [9.5, 10.2], // lands as the presentation
  lineDraw: [8.95, 9.65], // the projection draws in as the plan lifts out
  presentText: 9.85,
  chrome: 10.1,
  bubble: 10.75, // the client's question pops in…
  typing: [10.9, 11.9], // …and writes itself out
  drag: [12.2, 13.0], // contributions what-if
  presentOut: 13.8,
  stepBack: [13.9, 14.5],
  phoneIn: [14.1, 14.75],
  captureText: 14.3,
  captureOut: 16.25,
  profileIn: [14.85, 15.3], // the client's CRM profile, beside the phone
  notes: [15.1, 15.9], // its meeting notes fill in
  synced: 15.95,
  closeUp: [16.4, 17.0],
  writing: [16.65, 16.95],
  sweep2: [16.7, 17.7], // blue sweeps in
  // Deliver
  toRecap: [17.5, 18.25], // the phone grows into the recap
  recapReveal: [17.65, 18.6],
  deliverText: 17.9,
  toDoc: [20.0, 20.6], // recap → client document
  emailIn: [20.45, 21.0],
  write: [20.9, 21.5],
  sendClick: 21.7,
  toSent: [21.8, 22.35], // the email folds into the "Email sent" banner
  sentCheck: [22.2, 22.55],
  teamIn: [22.45, 22.95], // "Sent to your team" rises in under it
  teamRows: [22.7, 22.85, 23.0],
  deliverOut: 24.1,
  trackerOut: 24.55,
} as const;

// The approved close (BASE), kept for the sneak peek, which has no close.
const BASE_CLOSE = { words: [24.6, 24.9, 25.2], more: 25.5, wordsOut: 26.15, tagline: [26.6, 26.95], taglineOut: 28.0, logoIn: 28.45, end: 30 };

// Time added (+) or taken (−) after a BASE moment where the picture holds.
const ROOM: readonly (readonly [number, number])[] = [
  [0.9, 0.6], // the title holds while "Savvy Intelligence is connected…" plays
  [2.95, 1.8], // the list scrolls further (LIST_SCROLL_S) and rests on Allison &
  //              Frank; they're picked only once the opening line has ended
  [4.5, -0.4], // the prep card holds less: the prep line now plays over it
  [7.4, -0.8], // the prep document holds less: the line now plays over it
  [10.45, -0.25], // the presentation: less wait before the client's question
  [12.05, -0.1], // and before the what-if drag
  [13.4, -0.5], // after the drag
  [16.1, 0.2], // capture: "Synced" holds while the line finishes
  [23.5, -0.4], // the team card holds less
];
const shift = (s: number) => s + ROOM.reduce((d, [at, r]) => (s > at ? d + r : d), 0);

type Times<T> = { -readonly [I in keyof T]: number }; // keeps tuples tuples
type Beats = { -readonly [K in keyof typeof BASE]: (typeof BASE)[K] extends number ? number : Times<(typeof BASE)[K]> };
const mapBeats = (f: (s: number) => number): Beats =>
  Object.fromEntries(Object.entries(BASE).map(([k, v]) => [k, typeof v === "number" ? f(v) : v.map(f)])) as unknown as Beats;

// Voiceover: Jeremy B. (ElevenLabs v4), one file per line in
// public/audio/launch30/vo/, cut from the takes with 60 ms either side and
// level-matched (see README). `len` is the file's length; `said` are the
// onsets of the words the close puts on screen, from the file's start.
type VoLine = { readonly src: string; readonly len: number };
const VO_LINES = {
  intro: { src: "01-intro", len: 5.35 }, // "Savvy Intelligence is connected to your whole practice, helping you deliver more for your clients."
  prep: { src: "02-prep", len: 2.75 }, // "Your agenda is prepped before you even ask."
  meet: { src: "03-meet", len: 2.64 }, // "Present and adjust plans live in the meeting."
  capture: { src: "04-capture", len: 3.47 }, // "And every word's captured, so you can stay in the conversation."
  deliver: { src: "05-deliver", len: 5.85 }, // "Afterwards, your recap is ready to send. Then just approve the follow-ups, and your team takes it from there."
} satisfies Record<string, VoLine>;
const PAD = 0.06; // silence at either end of each file

// The close: "Prep, meet, deliver, and so much more." on two lines, then
// "That's your whole practice, working for you." (the tagline, Bookends.tsx).
export const CLOSE = {
  line: { src: "06-close", len: 3.38, said: [0.06, 0.72, 1.39, 2.09] },
  words: ["Prep.", "Meet.", "Deliver."], // first line, word by word
  more: "And so much more.", // second line
  tagline: { src: "07-tagline", len: 2.58, said: [0.06, 1.75] }, // "That's…" / "working…"
} as const;

const LEAD = 0.1; // text starts arriving this long before its word is said
const END_CARD = 1.3; // the logo holds this long (was 1.55)

// `retimed` false gives the approved cut's beats (no voiceover).
// The list scroll in the retimed cut: six rows down to the Chans, at the
// approved cut's speed.
const LIST_SCROLL_S = 1.7;

const build = (retimed: boolean) => {
  const b = mapBeats(retimed ? shift : (s) => s);
  if (retimed) b.listScroll = [b.listScroll[0], b.listScroll[0] + LIST_SCROLL_S];
  if (!retimed) {
    return { ...b, ...BASE_CLOSE, vo: [] as { src: string; at: number; len: number }[] };
  }
  const { line, tagline } = CLOSE;
  // Lines 1–5 sit on the picture: the opening line with the title, each
  // phase's line as its screen arrives.
  const intro = 0.1;
  // A pause after the opening line: the client is picked, their prep card
  // lands, and only then the prep line.
  const prep = b.cardIn + 0.45;
  const meet = b.land[0] - 0.15; // "Present…" as the plan lands as a presentation
  const capture = b.phoneIn[0] + 0.15; // "And every word's captured…" as the phone slides in
  const deliver = b.deliverText;
  // The close: the first word slides in 0.45 s after the deliver screen
  // starts to leave, each word as it's said; the tagline follows a pause.
  const close = b.deliverOut + 0.45 + LEAD - line.said[0];
  const closeEnd = close + line.len - PAD;
  const tag = closeEnd + 0.5 - tagline.said[0];
  const tagEnd = tag + tagline.len - PAD;
  const said = (at: number, s: number) => at + s - LEAD;
  const taglineOut = tagEnd - 0.15;
  const logoIn = taglineOut + 0.4;
  return {
    ...b,
    words: [said(close, line.said[0]), said(close, line.said[1]), said(close, line.said[2])],
    more: said(close, line.said[3]),
    wordsOut: closeEnd, // leaves as the line ends
    tagline: [said(tag, tagline.said[0]), said(tag, tagline.said[1])],
    taglineOut,
    logoIn,
    end: Math.ceil((logoIn + END_CARD) * 60) / 60,
    vo: [
      { src: VO_LINES.intro.src, at: intro, len: VO_LINES.intro.len },
      { src: VO_LINES.prep.src, at: prep, len: VO_LINES.prep.len },
      { src: VO_LINES.meet.src, at: meet, len: VO_LINES.meet.len },
      { src: VO_LINES.capture.src, at: capture, len: VO_LINES.capture.len },
      { src: VO_LINES.deliver.src, at: deliver, len: VO_LINES.deliver.len },
      { src: line.src, at: close, len: line.len },
      { src: tagline.src, at: tag, len: tagline.len },
    ],
  };
};

export type Timeline = ReturnType<typeof build> & { readonly phases: readonly (readonly [number, number])[] };
const timeline = (retimed: boolean): Timeline => {
  const l = build(retimed);
  const f = retimed ? shift : (s: number) => s;
  // Prep, Meet and Deliver on the tracker
  const phases = [
    [f(3.5), f(9.5)],
    [f(9.5), f(17.5)],
    [f(17.5), f(24)],
  ] as const;
  return { ...l, phases };
};

export const TIMELINE = timeline(true);
// The approved cut's beats; Launch30Peek runs on these so its loop edits
// (scripts/launch30-peek.sh) still line up.
export const PEEK_TIMELINE = timeline(false);

export const TimelineContext = createContext<Timeline>(TIMELINE);
export const useL = () => useContext(TimelineContext);
export const durationOf = (l: Timeline, fps = 60) => Math.round(l.end * fps);

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
