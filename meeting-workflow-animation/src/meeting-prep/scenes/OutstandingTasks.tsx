import { CircleCheck, Ellipsis, Pencil } from "lucide-react";
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Avatar } from "../components/Avatar";
import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import { C, CLAMP, EASE_OUT } from "../theme";
import { T } from "../timeline";

type Task = {
  title: string;
  owner: string;
  team?: boolean;
  due?: string;
  status: "In progress" | "Not started";
};

const TASKS: Task[] = [
  { title: "Pre-Review Check-In", owner: "Heather Lee", status: "In progress" },
  { title: "Raise cash for advisory fee", owner: "Savvy Client Services (Ops)", team: true, status: "Not started" },
  { title: "Collect 2025 tax return", owner: "Heather Lee", due: "Due Aug 28", status: "In progress" },
  { title: "Maximize 401(k) contributions", owner: "Heather Lee", due: "Due Oct 28", status: "In progress" },
  { title: "Joint account de-risking proposal", owner: "Heather Lee", status: "Not started" },
  { title: "Open new account", owner: "Savvy Client Services (Ops)", team: true, status: "Not started" },
];

const HOVER_ROW = 1;

// Mounted at T.tasksStart and holds to the end.
export const OutstandingTasks: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = interpolate(frame, [0, 0.4 * fps], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const synced = interpolate(frame, [0.75 * fps, 1.05 * fps], [0, 1], {
    ...CLAMP,
    easing: Easing.spring({ damping: 12 }),
  });
  const hoverAt = T.hoverRow - T.tasksStart;
  const hover = interpolate(frame, [hoverAt * fps, (hoverAt + 0.15) * fps], [0, 1], CLAMP);

  return (
    <AbsoluteFill
      style={{
        opacity: enter,
        translate: `${30 * (1 - enter)}px 0px`,
        maskImage: "linear-gradient(to bottom, #000 calc(100% - 120px), transparent)",
      }}
    >
      <div style={{ position: "absolute", left: 52, right: 52, top: 40 }}>
        <Reveal at={0.05} style={{ marginLeft: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <SectionHeader title="Outstanding tasks" count="(6)" />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 999,
              background: C.green50,
              color: C.green,
              fontSize: 13,
              fontWeight: 500,
              opacity: Math.min(1, synced * 1.5),
              scale: 0.8 + 0.2 * synced,
            }}
          >
            <CircleCheck size={15} strokeWidth={2} /> Synced just now
          </div>
        </Reveal>

        <div style={{ marginTop: 20 }}>
          {TASKS.map((task, i) => {
            const pill = interpolate(frame, [(0.22 + i * 0.08) * fps, (0.5 + i * 0.08) * fps], [0, 1], {
              ...CLAMP,
              easing: Easing.spring({ damping: 11 }),
            });
            return (
              <Reveal
                key={task.title}
                at={0.12 + i * 0.08}
                y={18}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  padding: "14px 14px",
                  borderRadius: 10,
                  background: i === HOVER_ROW ? `rgba(243, 244, 246, ${hover})` : "transparent",
                }}
              >
                <div>
                  <div style={{ fontSize: 16.5, fontWeight: 600, color: C.ink }}>{task.title}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, fontSize: 14.5, color: C.muted }}>
                    <Avatar size={22} person={task.team ? "team" : "heather"} />
                    {task.owner}
                    {task.due ? <span>· {task.due}</span> : null}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, color: C.faint }}>
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 500,
                      color: C.ink,
                      padding: "5px 10px",
                      borderRadius: 8,
                      border: `1px solid ${C.borderSoft}`,
                      background: C.white,
                      whiteSpace: "nowrap",
                      boxShadow: "0 1px 1px rgba(16, 24, 40, 0.04)",
                      opacity: Math.min(1, pill * 1.4),
                      scale: 0.85 + 0.15 * pill,
                    }}
                  >
                    {task.status}
                  </div>
                  <Pencil size={16} strokeWidth={1.8} />
                  <Ellipsis size={16} strokeWidth={1.8} />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
