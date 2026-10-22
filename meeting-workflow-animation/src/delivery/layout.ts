export * from "../shared/theme";

// Canvas geometry (1300×900), matched to the 02 · Delivery storyboard.
export type Point = { x: number; y: number };
export type Rect = { x: number; y: number; w: number; h: number };

export const HEADER = { x: 177, y: 84 };
export const CARD = { w: 457, h: 314 };
export const SLOTS = {
  tl: { x: 177, y: 158 },
  tr: { x: 651, y: 158 },
  bl: { x: 177, y: 486 },
  br: { x: 651, y: 486 },
};

export const PRESENT_RECT: Rect = { x: 108, y: 125, w: 1084, h: 650 };
export const SPLIT_RECT: Rect = { x: 98, y: 125, w: 606, h: 650 };

// Graph card header: title block on the left, [Present] [edit] [close] on the right.
export const CARD_HEADER_H = 66;
export const PRESENT_BTN = { w: 92, h: 30, top: 16, right: 68 }; // right = offset of its right edge from the card's right edge

export const slotCenter = (s: Point): Point => ({ x: s.x + CARD.w / 2, y: s.y + CARD.h / 2 });
export const presentButtonCenter = (s: Point): Point => ({
  x: s.x + CARD.w - PRESENT_BTN.right - PRESENT_BTN.w / 2,
  y: s.y + PRESENT_BTN.top + PRESENT_BTN.h / 2 + 2,
});

// What-if controls column.
export const PANEL = { x: 775, w: 425, titleY: 222, rowY: 268, rowGap: 86, trackOffset: 36 };
export const knobCenter = (row: number, p: number): Point => ({
  x: PANEL.x + p * PANEL.w,
  y: PANEL.rowY + row * PANEL.rowGap + PANEL.trackOffset + 2,
});
