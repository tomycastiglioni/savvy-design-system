import React from "react";
import { CursorLayer } from "../../shared/components/CursorLayer";
import { REVIEW_BUTTON, TABS, TABS_BAR } from "../theme";
import { T } from "../timeline";

const REVIEW = { x: REVIEW_BUTTON.x + REVIEW_BUTTON.w / 2, y: REVIEW_BUTTON.y + REVIEW_BUTTON.h / 2 + 2 };
const tabCenter = (i: number) => ({ x: TABS_BAR.x + TABS[i].x + TABS[i].w / 2, y: TABS_BAR.y + TABS_BAR.h / 2 + 2 });
const AGENDA_TAB = tabCenter(1);
const TASKS_TAB = tabCenter(2);
const TASK_ROW = { x: 330, y: 330 };

// Moves between 3.2s and 6.95s happen while the cursor is hidden.
export const Cursor: React.FC = () => (
  <CursorLayer
    path={[
      { t: 1.6, x: 960, y: 905 },
      { t: 2.6, ...REVIEW },
      { t: 3.2, ...REVIEW, ease: "linear" },
      { t: 6.95, x: 820, y: 620, ease: "linear" },
      { t: 7.75, ...AGENDA_TAB },
      { t: 7.95, ...AGENDA_TAB, ease: "linear" },
      { t: 8.9, x: 560, y: 380 },
      { t: 9.6, x: 560, y: 380, ease: "linear" },
      { t: 10.1, ...TASKS_TAB },
      { t: 10.75, ...TASKS_TAB, ease: "linear" },
      { t: 11.4, ...TASK_ROW },
    ]}
    opacity={[
      [1.6, 0],
      [1.75, 1],
      [3.0, 1],
      [3.2, 0],
      [6.95, 0],
      [7.1, 1],
    ]}
    clicks={[
      { at: T.clickReview, ...REVIEW },
      { at: T.clickAgenda, ...AGENDA_TAB },
      { at: T.clickTasks, ...TASKS_TAB },
    ]}
    hand={[
      [2.42, 3.2],
      [7.55, 8.1],
      [9.92, 10.8],
      [11.25, Infinity],
    ]}
  />
);
