// Copy for the mobile recap video: after the Dave R. review (MobilePrep,
// MobileHousehold), the recap and the follow-up, ready to send. A few words per
// line: the video is about 3 s. The points follow the review's agenda; the
// length, the Dec 10 date and the next steps are placeholder demo details.
export const RECAP = {
  label: "Meeting recap",
  name: "Dave R.",
  title: "Review recap",
  when: "Today · 2:00 PM · 42 min",
  short: "Dave R. · Today",
  minutes: 42,
};

export const POINTS = ["Retirement plan on track", "Beneficiary form to sign", "RMD set for Dec 10"];

export const NEXT_STEPS = [
  { owner: "You", initials: "P", text: "Send beneficiary form" },
  { owner: "Dave", initials: "DR", text: "Confirm RMD account" },
];

export const EMAIL = {
  to: "Dave R.",
  subject: "Recap of today's review",
  greeting: "Hi Dave,",
  intro: "Thanks for today. Quick recap:",
  attachment: "Meeting recap.pdf",
};

export const BUTTON = "Send follow-up";
