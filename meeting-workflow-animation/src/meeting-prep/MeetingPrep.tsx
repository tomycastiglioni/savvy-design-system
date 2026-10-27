import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { Cursor } from "./components/Cursor";
import { DocTabs } from "./scenes/DocTabs";
import { Home } from "./scenes/Home";
import { HouseholdContext } from "./scenes/HouseholdContext";
import { MeetingAgenda } from "./scenes/MeetingAgenda";
import { OutstandingTasks } from "./scenes/OutstandingTasks";
import { PrepDocument } from "./scenes/PrepDocument";
import { bgGradient, C, DOC_PANEL, FONT } from "./theme";
import { T } from "./timeline";

// Workflow 01 · Meeting prep — "Prepared before you ask".
// Home "For your review" → Loading household → Household context →
// Meeting agenda → Outstanding tasks.
export const MeetingPrep: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: bgGradient("cream"), fontFamily: FONT.sans, color: C.ink }}>
      <style>{"*{box-sizing:border-box;}"}</style>

      <Sequence name="Home" durationInFrames={Math.round(T.homeEnd * fps)}>
        <Home />
      </Sequence>

      <Sequence name="Prep document" from={Math.round(T.prepDocStart * fps)}>
        <PrepDocument />
      </Sequence>

      <Sequence name="Tabs" from={Math.round(T.tabsStart * fps)}>
        <DocTabs />
      </Sequence>

      {/* Tab content, clipped to the document panel. Scenes that scroll add their own edge fades. */}
      <div
        style={{
          position: "absolute",
          left: DOC_PANEL.x,
          top: DOC_PANEL.y,
          width: DOC_PANEL.w,
          height: DOC_PANEL.h,
          overflow: "hidden",
          borderRadius: 16,
        }}
      >
        <Sequence
          name="Household context"
          from={Math.round(T.contextStart * fps)}
          durationInFrames={Math.round((T.tabToAgenda + 0.3 - T.contextStart) * fps)}
        >
          <HouseholdContext />
        </Sequence>
        <Sequence
          name="Meeting agenda"
          from={Math.round(T.agendaStart * fps)}
          durationInFrames={Math.round((T.tabToTasks + 0.25 - T.agendaStart) * fps)}
        >
          <MeetingAgenda />
        </Sequence>
        <Sequence name="Outstanding tasks" from={Math.round(T.tasksStart * fps)}>
          <OutstandingTasks />
        </Sequence>
      </div>

      <Sequence name="Cursor">
        <Cursor />
      </Sequence>
    </AbsoluteFill>
  );
};
