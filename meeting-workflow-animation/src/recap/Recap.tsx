import React from "react";
import { AbsoluteFill } from "remotion";
import { Toast } from "./components/Bits";
import { bgGradient, C, FONT } from "./layout";
import { RecapCursor } from "./RecapCursor";
import { DraftFlow } from "./scenes/DraftFlow";
import { EditorPanel } from "./scenes/EditorPanel";
import { RecapPage } from "./scenes/RecapPage";
import { T } from "./timeline";

// Workflow 04 · Recap & follow-through — "The meeting ends. The follow-up doesn't wait."
// Continues 03's recap: topics → suggested tasks → client document (edit,
// save) → draft client email in the advisor's writing style → sent.
// `hideCursor` renders clean stills (thumbnails); `transparent` drops the
// background and `toastTop` moves the "saved" toast (for the ads).
export const Recap: React.FC<{ readonly hideCursor?: boolean; readonly transparent?: boolean; readonly toastTop?: number }> = ({
  hideCursor = false,
  transparent = false,
  toastTop,
}) => (
  <AbsoluteFill style={{ background: transparent ? undefined : bgGradient("blue"), fontFamily: FONT.sans, color: C.ink }}>
    <style>{"*{box-sizing:border-box;}"}</style>
    <RecapPage />
    <EditorPanel />
    <Toast at={T.toast} dur={1.15} top={toastTop}>
      Client document saved
    </Toast>
    <DraftFlow />
    {hideCursor ? null : <RecapCursor />}
  </AbsoluteFill>
);
