// Copy for the mobile household video: the screen behind "Open prep" in
// MobilePrep (the Dave R. review). A few words per line: the video is 3 s.
// Totals are placeholder demo figures; "+6.1%" and the RMD carry over from
// MobilePrep.
export const HOUSEHOLD = {
  name: "Dave R.",
  initials: "DR",
  meeting: "Dave R. review",
  when: "Today · 2:00 PM",
  review: "Review today · 2:00 PM",
  back: "Today",
};

export const STATS = [
  { label: "Assets", value: "$2.4M" },
  { label: "This year", value: "+6.1%", up: true },
  { label: "Accounts", value: "4" },
];

export type AgendaItem = { kind: "summary" | "agenda" | "flagged"; label: string; minutes: number };

export const AGENDA: AgendaItem[] = [
  { kind: "summary", label: "Retirement plan", minutes: 15 },
  { kind: "agenda", label: "Account changes", minutes: 10 },
  { kind: "flagged", label: "RMD before Dec 31", minutes: 5 },
];

export const BUTTON = "Start meeting";
