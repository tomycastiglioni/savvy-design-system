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
export const Recap: React.FC = () => (
  <AbsoluteFill style={{ background: bgGradient("blue"), fontFamily: FONT.sans, color: C.ink }}>
    <style>{"*{box-sizing:border-box;}"}</style>
    <RecapPage />
    <EditorPanel />
    <Toast at={T.toast} dur={1.15}>
      Client document saved
    </Toast>
    <DraftFlow />
    <RecapCursor />
  </AbsoluteFill>
);
