// Shared ad geometry (1080×1350, Figma "01 — Meeting steps (4x5) v3").
export const AD = { w: 1080, h: 1350 };
// The text column's left edge; graphics line up with it and may only run off
// the right and bottom edges.
export const MARGIN_X = 74.57;
// Where each ad's body copy ends (Figma auto layout: top 86.48 + block height).
export const TEXT_BOTTOM = { prep: 667.74, meet: 557.74, capture: 619.74, deliver: 567.74 } as const;
// Gap from the body copy to the graphic.
export const GAP = 80;
export const graphicTop = (k: keyof typeof TEXT_BOTTOM) => TEXT_BOTTOM[k] + GAP;
// Width between the side margins.
export const INNER_W = AD.w - 2 * MARGIN_X;
