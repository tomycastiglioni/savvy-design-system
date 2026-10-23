export * from "../shared/theme";
export { DOC_PANEL, TABS_BAR } from "../capture/layout";

// Canvas geometry (1300×900), matched to the 04 · Recap & follow-through storyboard.
export type Rect = { x: number; y: number; w: number; h: number };

// Sticky header that slides into the top of the recap document while scrolling.
export const STICKY_H = 64;
export const CREATE_BTN: Rect = { x: 755, y: 165, w: 206, h: 36 };
export const DRAFT_BTN: Rect = { x: 971, y: 165, w: 160, h: 36 };

// Client materials editor: settings on the left, live preview on the right.
export const EDITOR: Rect = { x: 100, y: 110, w: 340, h: 690 };
export const PREVIEW: Rect = { x: 470, y: 110, w: 730, h: 690 };
// Editor rows (px from the editor's top-left).
export const ROW = { x: 22, w: 296, h: 50 };
export const ROWS = { summary: 150, steps: 208, graphRetirement: 336, graphAccounts: 394 };
export const SEGMENT = { x: 22, y: 522, w: 296, h: 40 };
export const SAVE_BTN = { x: 22, y: 628, w: 296, h: 40 };

// Writing-style loader, then the email draft.
export const LOADING_BOX: Rect = { x: 335, y: 255, w: 630, h: 390 };
export const EMAIL: Rect = { x: 145, y: 130, w: 1010, h: 660 };
export const SEND_BTN = { w: 104, h: 38, right: 28, bottom: 13 }; // from the email card's bottom-right

export const center = (r: Rect) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 + 2 });
export const editorPoint = (x: number, y: number) => ({ x: EDITOR.x + x, y: EDITOR.y + y });
export const sendCenter = () => ({
  x: EMAIL.x + EMAIL.w - SEND_BTN.right - SEND_BTN.w / 2,
  y: EMAIL.y + EMAIL.h - SEND_BTN.bottom - SEND_BTN.h / 2 + 2,
});
