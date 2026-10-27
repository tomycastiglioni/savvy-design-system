import React from "react";
import { CursorLayer } from "../shared/components/CursorLayer";
import { center, CREATE_BTN, DRAFT_BTN, editorPoint, ROW, ROWS, SAVE_BTN, sendCenter } from "./layout";
import { T } from "./timeline";

const CREATE = center(CREATE_BTN);
const DRAFT = center(DRAFT_BTN);
const GRAPH = editorPoint(ROW.x + 23, ROWS.graphRetirement + ROW.h / 2 + 2);
// In the gap under the graph rows while the preview builds the graph and
// scrolls back up.
const REST = editorPoint(ROW.x + 90, ROWS.graphAccounts + ROW.h + 14);
const SAVE = editorPoint(SAVE_BTN.x + SAVE_BTN.w / 2, SAVE_BTN.y + SAVE_BTN.h / 2 + 2);
const SEND = sendCenter();

// Hidden while scrolling (continuing 03, which ends without a cursor) and
// while the writing-style loader runs.
export const RecapCursor: React.FC = () => (
  <CursorLayer
    path={[
      { t: 3.3, x: 1235, y: 300 },
      { t: 4.35, ...CREATE },
      { t: 4.75, ...CREATE, ease: "linear" },
      { t: 6.15, ...GRAPH },
      { t: 6.5, ...GRAPH, ease: "linear" },
      { t: 7.0, ...REST },
      { t: 7.8, ...REST, ease: "linear" },
      { t: 8.35, ...SAVE },
      { t: 8.8, ...SAVE, ease: "linear" },
      { t: 9.55, ...DRAFT },
      { t: 10.1, ...DRAFT, ease: "linear" },
      { t: 13.8, x: 930, y: 600, ease: "linear" }, // hidden during the loader
      { t: 14.3, ...SEND },
      { t: 14.75, ...SEND, ease: "linear" },
      { t: 15.15, x: SEND.x + 40, y: SEND.y + 40 },
    ]}
    opacity={[
      [3.3, 0],
      [3.45, 1],
      [9.95, 1],
      [10.1, 0],
      [13.8, 0],
      [13.95, 1],
      [14.85, 1],
      [15.15, 0],
    ]}
    clicks={[
      { at: T.clickCreate, ...CREATE },
      { at: T.clickGraph, ...GRAPH },
      { at: T.clickSave, ...SAVE },
      { at: T.clickDraft, ...DRAFT },
      { at: T.clickSend, ...SEND },
    ]}
    hand={[
      [4.15, 4.8],
      [5.95, 6.55],
      [8.15, 8.85],
      [9.35, 10.1],
      [14.05, 14.85],
    ]}
  />
);
