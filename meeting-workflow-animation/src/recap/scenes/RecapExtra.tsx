import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AIIcon } from "../../shared/components/AIIcon";
import { SectionTitle } from "../../capture/screens/DesktopRecap";
import { SUGGESTED_TASKS, TOPICS } from "../content";
import { C, CLAMP, EASE_OUT } from "../layout";
import { T } from "../timeline";

const TaskCard: React.FC<{ readonly title: string; readonly p: number }> = ({ title, p }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "13px 16px",
      marginBottom: 10,
      borderRadius: 10,
      background: "#E3F3E9",
      border: "1px solid #D3E6DC",
      opacity: p,
      translate: `0px ${(1 - p) * 16}px`,
      scale: 0.98 + 0.02 * p,
    }}
  >
    <AIIcon size={22} />
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", color: C.green, opacity: 0.75 }}>SUGGESTED TASK</div>
      <div style={{ fontSize: 15.5, fontWeight: 600, color: C.ink, marginTop: 3 }}>{title}</div>
    </div>
    <div style={{ height: 32, padding: "0 14px", borderRadius: 8, background: C.green, color: C.white, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center" }}>
      Create task
    </div>
    <div style={{ fontSize: 13, fontWeight: 500, color: C.muted, padding: "0 6px" }}>Dismiss</div>
  </div>
);

// Continues the 03 recap: a summary by topic, then Savvy Intelligence's
// suggested tasks, which appear as they scroll into view.
export const RecapExtra: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // 03 ends on "Decisions and next steps"; the new sections fade in as the
  // scroll resumes, so frame 0 is identical to 03's last frame.
  const topics = interpolate(t, [0.1, 0.55], [0, 1], { ...CLAMP, easing: EASE_OUT });

  return (
    <>
      <div style={{ opacity: topics, translate: `0px ${(1 - topics) * 14}px` }}>
        <SectionTitle>Topics discussed</SectionTitle>
        {TOPICS.map((topic) => (
          <div key={topic.title} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 15.5, fontWeight: 600, color: C.ink }}>{topic.title}</div>
            <div style={{ fontSize: 15, lineHeight: 1.5, color: C.body, marginTop: 3 }}>{topic.text}</div>
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: "#EEF0F2", margin: "26px 0 22px" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ fontSize: 21, fontWeight: 600, color: C.ink }}>Suggested tasks</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.green, background: C.green50, borderRadius: 999, padding: "2px 9px" }}>
          {SUGGESTED_TASKS.length}
        </div>
      </div>
      {SUGGESTED_TASKS.map((title, i) => (
        <TaskCard
          key={title}
          title={title}
          p={interpolate(t, [T.tasksReveal + i * 0.13, T.tasksReveal + i * 0.13 + 0.5], [0, 1], { ...CLAMP, easing: EASE_OUT })}
        />
      ))}
    </>
  );
};
