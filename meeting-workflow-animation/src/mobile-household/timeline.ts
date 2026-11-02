// Global timeline, in seconds.
export const T = {
  header: 0.08, // label, name and review line rise in, 0.05 s apart
  card: 0.3, // the assets card rises in
  count: [0.45, 1.15] as const, // $0.0M → $2.4M, landing just before the pill
  line: [0.5, 1.25] as const, // the growth line draws in
  pill: 1.1, // "+6.1%" pops in as the number lands
  agenda: 1.2, // label and card rise in
  rows: [1.35, 1.47, 1.59] as const, // agenda items, top to bottom
  end: 3,
};

export const DURATION = Math.round(T.end * 60);
