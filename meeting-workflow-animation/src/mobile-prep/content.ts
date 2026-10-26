// Copy for the mobile prep video. Same advisor (Heather Lee) as the other videos.
export const NOTIFICATION = {
  app: "Savvy",
  // Non-breaking space keeps "Dave R." on one line.
  body: "Your prep for the Dave\u00A0R. review is ready.",
};

export const TODAY = {
  date: "Monday, October 26",
  greeting: "Good morning, Heather",
};

export type Meeting = { who: string; when: string; prep: "none" | "ready" | "preparing" };

export const MEETINGS: Meeting[] = [
  { who: "Team huddle", when: "10:00 AM · Internal", prep: "none" },
  { who: "Dave R.", when: "2:00 PM · Annual review", prep: "preparing" },
  { who: "Prospect intro", when: "4:30 PM · New household", prep: "none" },
];

export const TASKS = [
  { title: "Collect updated beneficiary form", meta: "Dave R. · Due Oct 30" },
  { title: "Confirm 529 deposit for Ellis", meta: "Allison & Frank Chan · Due Nov 2" },
  { title: "Review Q3 performance reports", meta: "All households · Due Friday" },
];

export const RECAPS = [{ title: "Quarterly Review recap", meta: "Allison & Frank Chan · Jul 31" }];

// The prep the notification opens.
export const REVIEW = {
  title: "Annual review",
  meta: "Dave R. · Today, 2:00 PM",
};

export const ACCOUNT_CHANGES = ["Rollover IRA funded from his 401(k), $412K", "Joint account rebalanced to 60/40"];

export const OPEN_TASK = {
  title: "Collect updated beneficiary form",
  owner: "Heather Lee",
  due: "Due Oct 30",
  status: "In progress",
};

export const FLAGGED = { title: "Inherited IRA RMD not taken yet", due: "Due Dec 31" };

export const AGENDA = [
  "Life updates and retirement timing",
  "Review account changes",
  "Sign the beneficiary form",
  "Plan the inherited IRA RMD",
];
