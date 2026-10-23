// Global timeline, in seconds (absolute).
export const T = {
  tick1: 1.0, // 32:03 → 32:04
  tick2: 2.0, // 32:04 → 32:05, then frozen
  tapStop: 2.15,
  toTranscribing: 2.2, // recording → transcribing, 0.45s
  tapRecap: 3.55, // "Stop and get recap"
  toWriting: 3.6, // transcribing → writing your recap, 0.5s
  toNotes: 5.2, // push into the notes screen, 0.5s
  tapTranscript: 6.75,
  tapSummary: 7.95,
  growStart: 8.45, // phone → desktop document
  growEnd: 9.35,
  desktopReveal: 9.0, // overlaps the end of the growth
  scrollStart: 10.2,
  scrollEnd: 11.2,
  end: 12,
};
