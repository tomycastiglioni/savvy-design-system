// Global timeline, in seconds.
export const T = {
  pill: 0.08, // "Recorded · 42 min", then the title and the subtitle, 0.05 s apart
  card: 0.3, // the summary card rises in
  points: [0.5, 0.62, 0.74] as const, // the three points check in, top to bottom
  email: 0.9, // the drafted email row
  button: 1.02, // "Send follow-up"
  press: 1.95, // the button is pressed (screen recordings show no finger)
  sent: 2.05, // it turns to "Sent"
  end: 3,
};

export const DURATION = Math.round(T.end * 60);
