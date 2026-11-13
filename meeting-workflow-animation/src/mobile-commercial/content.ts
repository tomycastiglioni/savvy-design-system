// Copy for the commercial's three phone screens: Dave R.'s annual review at
// the golf club, his retirement plan, and the follow-up after. Dave R. carries
// over from the earlier mobile videos (MobilePrep, MobileHousehold,
// MobileRecap); figures are placeholder demo details.
export const MEETING = {
  type: "Annual review",
  client: "Dave R.",
  initials: "DR",
  when: "Today · 10:30 AM",
  time: "10:30",
  place: "Pebble Creek GC",
};

// The household summary: account changes, one open task, one flagged item.
export const SUMMARY = {
  changes: { label: "Account changes", value: "$40K rollover · up 6.1%" },
  task: { label: "Open task", value: "Beneficiary form to sign" },
  flagged: { label: "Flagged", value: "RMD not taken yet" },
};

export const AGENDA = ["Retirement plan", "Account changes", "RMD before Dec 31"];

// The plan: on track, one clear result.
export const PLAN = {
  title: "Retirement plan",
  retireAt: 65,
  result: 94, // probability of success, %
  resultLabel: "chance the plan lasts past 95",
  atRetirement: "$2.9M",
};

export const RECAP = {
  title: "Meeting recap ready",
  sub: "Annual review · Dave R.",
  minutes: 48,
  points: ["Retirement plan on track (94%)", "Beneficiary form to sign", "RMD set for Dec 10"],
  next: [
    { owner: "You", initials: "P", text: "Send beneficiary form" },
    { owner: "Dave", initials: "DR", text: "Confirm RMD account" },
  ],
  send: "Send follow-up",
  ask: "Send the follow-up.",
  sent: "Follow-up sent.",
  sentTo: "Sent to Dave R. · recap attached",
};

// Status bar times for each screen (before, during and after the meeting).
export const CLOCK = { meeting: "10:12", plan: "10:51", recap: "11:46" };
