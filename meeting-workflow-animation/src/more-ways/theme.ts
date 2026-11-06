import { DIATYPE } from "../launch/theme";

// "More ways Savvy Intelligence moves your practice forward" (website): seven
// feature cards, each with a graphic that will loop. Sizes, type and colours
// from Figma (Innovation Campaign, page "-> Motion"). The graphics sit on the
// site's dark-teal glass cards; their own backgrounds are transparent.

export const FONT = DIATYPE; // ABC Diatype (Regular/Bold here; Medium in Figma)
export const DM = '"DM Sans", system-ui, sans-serif';

export const C = {
  ink: "#1d2334", // titles
  text: "#080d13",
  muted: "#7a8292",
  sub: "#4c6277",
  sub2: "#616978",
  date: "#6a8094",
  border: "#e2e4e8",
  field: "#e5e5e8",
  tile: "#f7f8f9",
  green: "#075444", // primary button
  green2: "#086b4e", // send button
  greenInk: "#004c2f",
  greenBg: "#def3dc",
  greenSoft: "#e3efe5",
  greenIcon: "rgba(23, 82, 66, 0.1)",
  mint: "#ceedcd",
  amberBg: "#fff4ce",
  amberInk: "#513810",
  chip: "rgba(255, 255, 255, 0.13)",
  // the website's card glass, behind the graphics in the storyboards
  card: "#23404f",
  cardTop: "#2b4b5b",
  page: "#0f3544",
} as const;

// Medium in Figma; the project has Diatype Regular and Bold, so Medium falls
// back to Regular until ABCDiatype-Medium.otf is added.
export const MEDIUM = 500;

export type CardKey = "say" | "know" | "report" | "day" | "monitor" | "hunt" | "more";
export const CARDS: Record<CardKey, { title: string; body: string; w: number; h: number }> = {
  say: {
    title: "Just say what you need",
    body: "Describe what you need in your own words, typed or dictated: a question about a client, a scenario to model, tasks to assign, or everything on your mind after a meeting. Savvy Intelligence takes it from there.",
    w: 534,
    h: 320,
  },
  know: {
    title: "Know more than they expect",
    body: "Upload what a prospect has shared, like statements, tax returns or an old plan. Get a summary of their situation, the planning opportunities worth raising, and an agenda for the first meeting. And once you confirm the details, the prospect is added to your CRM.",
    w: 700,
    h: 294,
  },
  report: {
    title: "Every report sounds like you wrote it",
    body: "Savvy Intelligence learns how you write from your past client emails, then drafts every advisor note in your voice. Add your brand, set the schedule, and publish straight to your client's portal.",
    w: 700,
    h: 324,
  },
  day: {
    title: "Start the day knowing what needs you",
    body: "Your daily briefing from Savvy Intelligence is waiting on your dashboard, along with account changes, open items and drafts ready for your review across your whole book.",
    w: 534,
    h: 282,
  },
  monitor: {
    title: "Monitor across your book",
    body: "Spot stale data, upcoming RMDs, portfolio drift or an expiring Roth conversion window, before the client ever asks. It watches every household on your book and flags only what needs you.",
    w: 406,
    h: 256,
  },
  hunt: {
    title: "Skip the data hunting",
    body: "Find beneficiaries, cost basis or what last year's tax return reported, and more without opening another tab. Savvy Intelligence checks every source on file before it answers.",
    w: 406,
    h: 294,
  },
  more: {
    title: "And a whole lot more…",
    body: "Savvy Intelligence can handle hundreds of jobs across your practice, and we're adding more all the time.",
    w: 406,
    h: 346,
  },
};
