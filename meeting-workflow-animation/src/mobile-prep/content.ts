// Copy for the mobile prep video. Kept to a few words per line: the whole
// video is 3.5 s.
export const GREETING = {
  date: "Monday, October 26",
  hello: "Good morning, Peter",
  section: "Next meeting",
};

export const MEETING = {
  title: "Dave R. review",
  when: "Today · 2:00 PM",
};

export type Row = { kind: "summary" | "task" | "flagged" | "agenda"; label: string; value: string };

export const ROWS: Row[] = [
  { kind: "summary", label: "Summary", value: "Portfolio up 6.1%" },
  { kind: "task", label: "Task", value: "Beneficiary form" },
  { kind: "flagged", label: "Flagged", value: "RMD not taken yet" },
  { kind: "agenda", label: "Agenda", value: "Retirement, accounts, RMD" },
];

export const BUTTON = "Open prep";
