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
  chipIcon: "#9cdaf8", // the glass chips' icon stroke
  cardTop: "#2b4b5b",
  page: "#0f3544",
} as const;

// Medium in Figma; the project has Diatype Regular and Bold, so Medium falls
// back to Regular until ABCDiatype-Medium.otf is added.
export const MEDIUM = 500;

export type CardKey = "say" | "know" | "report" | "day" | "monitor" | "hunt" | "more" | "record" | "dayone" | "service" | "briefing" | "morewide" | "knowbook" | "summary";
export const CARDS: Record<CardKey, { title: string; body: string; w: number; h: number }> = {
  // The section's second version (Figma "Hero", 25683:472): three rows of
  // two cards, all on the dark-teal glass.
  record: {
    title: "Every agent works from the same client record",
    body: "Accounts, tax, planning, meeting notes, and client communications already flow into one client record. We maintain the connections, so there’s nothing for you to set up. Each new agent we release works from that same record on day 1.",
    w: 534,
    h: 264,
  },
  dayone: {
    title: "Ready on day 1, at no added cost",
    body: "Savvy Intelligence is built into the platform, so you can drop tools you’d otherwise pay for. There’s nothing to install or configure.",
    w: 700,
    h: 384, // the Figma card's 542 less its copy (to 158), so the card can sit centred with even space
  },
  service: {
    title: "Backed by your service team at Savvy",
    body: "Requests from your meetings route straight to your service team at Savvy. You approve, and they take it from there.",
    w: 700,
    h: 376,
  },
  briefing: {
    title: "Start the day knowing what needs you",
    body: "Your daily briefing from Savvy Intelligence is waiting on your dashboard, along with account changes, open items and drafts ready for your review across your whole book.",
    w: 534,
    h: 324, // the Figma card's 542 less its copy (to 218), the briefing centred in it
  },
  knowbook: {
    title: "Know more than they expect",
    body: "Because accounts, tax returns, and plans sit in the same record, Savvy Intelligence can spot a Roth window that reopened, an upcoming RMD, or portfolio drift across every household on your book.",
    w: 617,
    h: 350,
  },
  summary: {
    title: "Every household, summarized before the call",
    body: "See who’s in the household, what you discussed last, open tasks, and recent account changes in one summary. Savvy Intelligence updates it after every meeting, so you’re caught up before you dial.",
    w: 700,
    h: 430,
  },
  morewide: {
    title: "And a whole lot more…",
    body: "Savvy Intelligence can handle hundreds of jobs across your practice, and we’re adding more all the time.",
    w: 617,
    h: 376,
  },
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
