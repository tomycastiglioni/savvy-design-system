// Global timeline, in seconds (absolute). Frame 0 is 03 · Meeting capture's last frame.
export const T = {
  stickyIn: 0.3,
  scroll1: [0.25, 1.65] as const, // into the topic summary
  scroll2: [2.15, 3.15] as const, // into the suggested tasks
  tasksReveal: 2.35,
  clickCreate: 4.55,
  toEditor: 4.65, // recap → client materials editor, 0.6s
  clickGraph: 6.35,
  scrollUp: [7.45, 8.35] as const, // preview: from the new graph back to the top
  clickSerif: 7.45, // typeface switch, launch video only
  clickSave: 8.55,
  toRecap: 8.65, // editor → recap, 0.6s
  toast: 8.75,
  clickDraft: 9.75,
  loadStart: 9.85, // button → loader → email draft
  loadHold: 10.4,
  loadEnd: 11.5,
  emailOpen: 11.95,
  typeStart: 12.1,
  typeEnd: 14.05,
  clickSend: 14.45,
  sent: 14.7,
  end: 16,
};
