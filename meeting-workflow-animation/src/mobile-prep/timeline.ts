// Global timeline, in seconds.
export const T = {
  ready: 1.05, // loading resolves: the chip flips, rows fill in top to bottom
  end: 3.5,
};

export const ROW_STEP = 0.12; // between rows (the button is the fifth step)
export const rowAt = (i: number) => T.ready + 0.12 + i * ROW_STEP;

export const DURATION = Math.round(T.end * 60);
